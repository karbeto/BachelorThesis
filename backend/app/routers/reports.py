import uuid
import aiofiles 
from pathlib import Path
from fastapi import (
    APIRouter, Depends, HTTPException,
    status, UploadFile, File, Form,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from geoalchemy2.functions import ST_DWithin, ST_GeomFromText
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from app.database import get_db
from app.models.report import Report, ReportStatus
from app.models.report_image import ReportImage
from app.models.report_status_history import ReportStatusHistory
from app.models.report_vote import ReportVote
from app.models.municipality_category_routing import MunicipalityCategoryRouting
from app.models.category import Category
from app.models.municipality import Municipality
from app.models.notification import Notification
from app.models.user import User
from app.schemas.report import (
    ReportResponse,
    ReportStatusUpdate,
    ReportImageResponse,       
    ReportStatusHistoryResponse,
)
from app.core.dependencies import get_current_user, get_current_admin
from app.services.ai import classify_report, encode_image_to_base64
from app.services.email import send_report_email, send_status_update_email

router = APIRouter(prefix="/reports", tags=["Reports"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

DUPLICATE_RADIUS_METERS = 50


async def get_report_or_404(report_id: int, db: AsyncSession) -> Report:
    result = await db.execute(
        select(Report).where(Report.id == report_id)
    )
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    return report


async def get_vote_count(report_id: int, db: AsyncSession) -> int:
    result = await db.execute(
        select(func.count(ReportVote.id)).where(
            ReportVote.report_id == report_id
        )
    )
    return result.scalar() or 0


async def get_report_images(
    report_id: int, db: AsyncSession
) -> list[ReportImage]:
    result = await db.execute(
        select(ReportImage).where(ReportImage.report_id == report_id)
    )
    return list(result.scalars().all())


async def build_report_response(
    report: Report, db: AsyncSession
) -> ReportResponse:
    vote_count = await get_vote_count(report.id, db)
    images = await get_report_images(report.id, db)

    latitude = None
    longitude = None
    if report.location is not None:
        from geoalchemy2.functions import ST_X, ST_Y
        coords = await db.execute(
            select(
                ST_X(Report.location),
                ST_Y(Report.location),
            ).where(Report.id == report.id)
        )
        row = coords.one_or_none()
        if row:
            longitude = row[0]
            latitude = row[1]

    cat_result = await db.execute(
        select(Category.name).where(Category.id == report.category_id)
    )
    category_name = cat_result.scalar_one_or_none()

    mun_result = await db.execute(
        select(Municipality.name).where(
            Municipality.id == report.municipality_id
        )
    )
    municipality_name = mun_result.scalar_one_or_none()
    
    user_full_name = None
    if report.user_id:
        user_result = await db.execute(
            select(User.full_name).where(User.id == int(report.user_id))
        )
        user_full_name = user_result.scalar_one_or_none()

    return ReportResponse(
        id=report.id,
        title=report.title,
        description=report.description,
        address=report.address,
        status=report.status,
        is_duplicate=report.is_duplicate,
        parent_report_id=report.parent_report_id,
        email_sent=report.email_sent,
        category_id=report.category_id,
        category_name=category_name,
        municipality_id=report.municipality_id,
        municipality_name=municipality_name,
        user_id=report.user_id,
        user_full_name=user_full_name,
        latitude=latitude,
        longitude=longitude,
        images=[ReportImageResponse.model_validate(img) for img in images],
        vote_count=vote_count,
        created_at=report.created_at,
        updated_at=report.updated_at,
    )


async def find_duplicate(
    latitude: float,
    longitude: float,
    category_id: int,
    db: AsyncSession,
) -> Report | None:
    point_wkt = f"POINT({longitude} {latitude})"
    result = await db.execute(
        select(Report).where(
            Report.category_id == category_id,
            Report.is_duplicate == False,  # noqa: E712
            Report.status != ReportStatus.rejected,
            ST_DWithin(
                Report.location,
                ST_GeomFromText(point_wkt, 4326),
                DUPLICATE_RADIUS_METERS,
            ),
        ).order_by(Report.created_at.asc()).limit(1)
    )
    return result.scalar_one_or_none()


async def get_routing_email(
    municipality_id: int,
    category_id: int,
    db: AsyncSession,
) -> str | None:
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.municipality_id == municipality_id,
            MunicipalityCategoryRouting.category_id == category_id,
            MunicipalityCategoryRouting.is_active == True,  # noqa: E712
        )
    )
    routing = result.scalar_one_or_none()
    return routing.routing_email if routing else None


async def create_notification(
    user_id: int,
    report_id: int,
    message: str,
    db: AsyncSession,
) -> None:
    notification = Notification(
        user_id=user_id,
        report_id=report_id,
        message=message,
        is_read=False,
    )
    db.add(notification)


@router.post(
    "/",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_report(
    title: str = Form(..., min_length=3, max_length=255),
    description: str | None = Form(None),
    latitude: float = Form(..., ge=-90, le=90),
    longitude: float = Form(..., ge=-180, le=180),
    address: str | None = Form(None),
    municipality_id: int = Form(...),
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    municipality_result = await db.execute(
        select(Municipality).where(Municipality.id == municipality_id)
    )
    if not municipality_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )

    categories_result = await db.execute(
        select(Category).where(Category.is_active == True)  # noqa: E712
    )
    categories = categories_result.scalars().all()
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active categories found",
        )
    category_names = [str(c.name) for c in categories]

    image_base64 = None
    image_bytes = None
    image_filename = None

    if image and image.content_type in ("image/jpeg", "image/png", "image/webp"):
        image_bytes = await image.read()
        image_base64 = encode_image_to_base64(image_bytes)
        ext = image.filename.rsplit(".", 1)[-1] if image.filename else "jpg"
        image_filename = f"{uuid.uuid4()}.{ext}"

    ai_result = await classify_report(
        description=description or title,
        category_names=category_names,
        image_base64=image_base64,
    )
    matched_category = next(
        (c for c in categories if c.name == ai_result["category_name"]),
        categories[0],
    )

    duplicate_parent = await find_duplicate(
        latitude=latitude,
        longitude=longitude,
        category_id=matched_category.id,
        db=db,
    )
    is_duplicate = duplicate_parent is not None
    parent_report_id = duplicate_parent.id if duplicate_parent else None

    location = from_shape(Point(longitude, latitude), srid=4326)
    report = Report(
        title=title,
        description=description,
        location=location,
        address=address,
        category_id=matched_category.id,
        municipality_id=municipality_id,
        user_id=current_user.id,
        status=ReportStatus.submitted,
        is_duplicate=is_duplicate,
        parent_report_id=parent_report_id,
        email_sent=False,
    )
    db.add(report)
    await db.flush()
    await db.refresh(report)

    if image_bytes and image_filename:
        file_path = UPLOAD_DIR / image_filename
        async with aiofiles.open(file_path, "wb") as f:
            await f.write(image_bytes)
            
        report_image = ReportImage(
            report_id=report.id,
            image_url=f"/uploads/{image_filename}",
            is_primary=True,
        )
        db.add(report_image)
        await db.flush()

    email_sent = False
    if not is_duplicate:
        routing_email = await get_routing_email(
            municipality_id=municipality_id,
            category_id=matched_category.id,
            db=db,
        )
        if routing_email:
            try:
                email_sent = await send_report_email(
                    to_email=str(routing_email),
                    report_id=report.id,
                    title=title,
                    description=description,
                    category_name=str(matched_category.name),
                    address=address,
                    latitude=latitude,
                    longitude=longitude,
                    citizen_email=str(current_user.email),
                )
            except Exception as e:
                print(f"SMTP Error encountered: {e}")
                email_sent = False
                
            report.email_sent = email_sent
            await db.flush()

    await create_notification(
        user_id=current_user.id,
        report_id=report.id,
        message=(
            f"Вашата пријава #{report.id} '{title}' е успешно поднесена."
            if not is_duplicate
            else "Сличен проблем веќе е пријавен. Вашиот глас е додаден."
        ),
        db=db,
    )

    await db.commit()
    
    await db.refresh(report)
    
    return await build_report_response(report, db)


@router.get("/my", response_model=list[ReportResponse])
async def my_reports(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Report)
        .where(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
    )
    reports = result.scalars().all()
    return [await build_report_response(r, db) for r in reports]


@router.get("/", response_model=list[ReportResponse])
async def list_reports(
    municipality_id: int | None = None,
    category_id: int | None = None,
    status: ReportStatus | None = None,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    query = select(Report).where(Report.is_duplicate == False)  # noqa: E712
    
    if municipality_id:
        query = query.where(Report.municipality_id == municipality_id)
    if category_id:
        query = query.where(Report.category_id == category_id)
    if status:
        query = query.where(Report.status == status)

    query = query.order_by(Report.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(query)
    reports = result.scalars().all()
    return [await build_report_response(r, db) for r in reports]


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    report = await get_report_or_404(report_id, db)
    return await build_report_response(report, db)


@router.patch("/{report_id}/status", response_model=ReportResponse)
async def update_report_status(
    report_id: int,
    payload: ReportStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    report = await get_report_or_404(report_id, db)
    old_status = report.status

    if old_status == payload.status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report is already in this status",
        )

    report.status = payload.status
    await db.flush()

    history = ReportStatusHistory(
        report_id=report.id,
        changed_by=current_user.id,
        old_status=old_status.value,
        new_status=payload.status.value,
        note=payload.note,
    )
    db.add(history)
    await db.flush()

    if report.user_id:
        status_translations = {
            ReportStatus.submitted: "Поднесено",
            ReportStatus.in_progress: "Се решава",
            ReportStatus.resolved: "Решено ✓",
            ReportStatus.rejected: "Одбиено",
        }
        status_mk = status_translations.get(
            payload.status, payload.status.value
        )

        await create_notification(
            user_id=report.user_id,
            report_id=report.id,
            message=(
                f"Статусот на пријава #{report.id} '{report.title}' "
                f"е сменет во: {status_mk}"
            ),
            db=db,
        )

        citizen_result = await db.execute(
            select(User).where(User.id == report.user_id)
        )
        citizen = citizen_result.scalar_one_or_none()
        if citizen:
            try:
                await send_status_update_email(
                    to_email=str(citizen.email),
                    report_id=report.id,
                    title=str(report.title),
                    new_status=payload.status.value,
                )
            except Exception as e:
                print(f"Status SMTP communication crash: {e}")

    await db.commit()
    await db.refresh(report)
    return await build_report_response(report, db)


@router.get(
    "/{report_id}/history",
    response_model=list[ReportStatusHistoryResponse],
)
async def get_report_history(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    await get_report_or_404(report_id, db)
    result = await db.execute(
        select(ReportStatusHistory)
        .where(ReportStatusHistory.report_id == report_id)
        .order_by(ReportStatusHistory.changed_at.asc())
    )
    return [
        ReportStatusHistoryResponse.model_validate(h)
        for h in result.scalars().all()
    ]


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = await get_report_or_404(report_id, db)
    if report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reports",
        )
    if report.status != ReportStatus.submitted:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only delete reports that are still submitted",
        )
    await db.delete(report)
    
    await db.commit()
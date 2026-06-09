from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime, timezone

from app.database import get_db
from app.models.report_rating import ReportRating
from app.models.report import Report, ReportStatus
from app.models.report_status_history import ReportStatusHistory 
from app.schemas.rating import ReportRatingCreate, ReportRatingResponse
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(tags=["Ratings"])


@router.post(
    "/reports/{report_id}/rating",
    response_model=ReportRatingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def rate_report(
    report_id: int,
    payload: ReportRatingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Report).where(Report.id == report_id)
    )
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if report.status != ReportStatus.resolved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only rate resolved reports",
        )
        
    if report.parent_report_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating is only allowed for the master report. Duplicate reports cannot be rated individually.",
        )

    if report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only rate your own reports",
        )

    existing = await db.execute(
        select(ReportRating).where(
            ReportRating.report_id == report_id,
            ReportRating.user_id == current_user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already rated this report",
        )

    rating = ReportRating(
        report_id=report_id,
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(rating)
    await db.flush()

    if payload.rating in [1, 2]:
        current_time = datetime.now(timezone.utc)
        
        report.status = ReportStatus.submitted
        report.updated_at = current_time
        
        master_history = ReportStatusHistory(
            report_id=report.id,
            changed_by=current_user.id,
            old_status=ReportStatus.resolved.value,
            new_status=ReportStatus.submitted.value,
            note=f"Системска реверзија: Пријавата е автоматски вратена во статус 'Поднесено' поради ниска оцена од ({payload.rating} ѕвезди) од граѓанинот.",
        )
        db.add(master_history)
        
        await db.execute(
            update(Report)
            .where(Report.parent_report_id == report.id)
            .values(
                status=ReportStatus.submitted,
                updated_at=current_time
            )
        )
        
        child_res = await db.execute(
            select(Report.id).where(Report.parent_report_id == report.id)
        )
        child_ids = child_res.scalars().all()
        
        for child_id in child_ids:
            child_history = ReportStatusHistory(
                report_id=child_id,
                changed_by=current_user.id,
                old_status=ReportStatus.resolved.value,
                new_status=ReportStatus.submitted.value,
                note=f"Каскадна реверзија од матична пријава #{report.id} поради ниска оценa од граѓанинот.",
            )
            db.add(child_history)

        await db.flush()

    await db.commit()
    await db.refresh(rating)
    return ReportRatingResponse.model_validate(rating)


@router.get(
    "/reports/{report_id}/ratings",
    response_model=list[ReportRatingResponse],
)
async def get_report_ratings(
    report_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Report).where(Report.id == report_id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    ratings_result = await db.execute(
        select(ReportRating)
        .where(ReportRating.report_id == report_id)
        .order_by(ReportRating.created_at.desc())
    )
    return [
        ReportRatingResponse.model_validate(r)
        for r in ratings_result.scalars().all()
    ]
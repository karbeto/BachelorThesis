from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.report import Report, ReportStatus
from app.models.category import Category
from app.models.municipality import Municipality
from app.models.municipality_employee import MunicipalityEmployee
from app.core.dependencies import get_current_admin
from app.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class StatsResponse(BaseModel):
    total: int
    submitted: int
    in_progress: int
    resolved: int
    rejected: int


class CategoryStatsResponse(BaseModel):
    category_id: int
    category_name: str
    count: int


class HeatmapPoint(BaseModel):
    latitude: float
    longitude: float
    report_id: int


class DashboardResponse(BaseModel):
    stats: StatsResponse
    by_category: list[CategoryStatsResponse]


async def get_admin_municipality_id(
    current_user: User,
    db: AsyncSession,
) :
    result = await db.execute(
        select(MunicipalityEmployee).where(
            MunicipalityEmployee.user_id == current_user.id
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No municipality assigned to this admin",
        )
    return employee.municipality_id


@router.get("/stats", response_model=DashboardResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    municipality_id = await get_admin_municipality_id(current_user, db)

    total_result = await db.execute(
        select(func.count(Report.id)).where(
            Report.municipality_id == municipality_id
        )
    )
    total = total_result.scalar() or 0

    submitted_result = await db.execute(
        select(func.count(Report.id)).where(
            Report.municipality_id == municipality_id,
            Report.status == ReportStatus.submitted,
        )
    )
    submitted = submitted_result.scalar() or 0

    in_progress_result = await db.execute(
        select(func.count(Report.id)).where(
            Report.municipality_id == municipality_id,
            Report.status == ReportStatus.in_progress,
        )
    )
    in_progress = in_progress_result.scalar() or 0

    resolved_result = await db.execute(
        select(func.count(Report.id)).where(
            Report.municipality_id == municipality_id,
            Report.status == ReportStatus.resolved,
        )
    )
    resolved = resolved_result.scalar() or 0

    rejected_result = await db.execute(
        select(func.count(Report.id)).where(
            Report.municipality_id == municipality_id,
            Report.status == ReportStatus.rejected,
        )
    )
    rejected = rejected_result.scalar() or 0

    category_result = await db.execute(
        select(Category.id, Category.name, func.count(Report.id))
        .join(Report, Report.category_id == Category.id)
        .where(Report.municipality_id == municipality_id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(Report.id).desc())
    )
    by_category = [
        CategoryStatsResponse(
            category_id=row[0],
            category_name=row[1],
            count=row[2],
        )
        for row in category_result.all()
    ]

    return DashboardResponse(
        stats=StatsResponse(
            total=total,
            submitted=submitted,
            in_progress=in_progress,
            resolved=resolved,
            rejected=rejected,
        ),
        by_category=by_category,
    )


@router.get("/heatmap", response_model=list[HeatmapPoint])
async def get_heatmap(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    from geoalchemy2.functions import ST_X, ST_Y
    municipality_id = await get_admin_municipality_id(current_user, db)

    result = await db.execute(
        select(
            Report.id,
            ST_X(Report.location),
            ST_Y(Report.location),
        ).where(
            Report.municipality_id == municipality_id,
            Report.location.isnot(None),
        )
    )

    return [
        HeatmapPoint(
            report_id=row[0],
            longitude=row[1],
            latitude=row[2],
        )
        for row in result.all()
    ]

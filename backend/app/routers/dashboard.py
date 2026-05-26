from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.report import Report, ReportStatus
from app.models.category import Category
from app.models.municipality import Municipality
from app.models.municipality_employee import MunicipalityEmployee
from app.core.dependencies import get_current_admin
from app.models.user import User, UserRole
from pydantic import BaseModel
from typing import Optional

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


async def get_municipality_filter(
    current_user: User,
    db: AsyncSession,
) -> Optional[int]:
    """
    Returns municipality_id for municipality_admin.
    Returns None for superadmin (no filter — sees all data).
    """
    if current_user.role == UserRole.superadmin:
        return None

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
    municipality_id = await get_municipality_filter(current_user, db)

    def mun_filter(query):
        if municipality_id is not None:
            return query.where(Report.municipality_id == municipality_id)
        return query

    total = (await db.execute(
        mun_filter(select(func.count(Report.id)))
    )).scalar() or 0

    submitted = (await db.execute(
        mun_filter(select(func.count(Report.id))).where(
            Report.status == ReportStatus.submitted
        )
    )).scalar() or 0

    in_progress = (await db.execute(
        mun_filter(select(func.count(Report.id))).where(
            Report.status == ReportStatus.in_progress
        )
    )).scalar() or 0

    resolved = (await db.execute(
        mun_filter(select(func.count(Report.id))).where(
            Report.status == ReportStatus.resolved
        )
    )).scalar() or 0

    rejected = (await db.execute(
        mun_filter(select(func.count(Report.id))).where(
            Report.status == ReportStatus.rejected
        )
    )).scalar() or 0

    cat_query = (
        select(Category.id, Category.name, func.count(Report.id))
        .join(Report, Report.category_id == Category.id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(Report.id).desc())
    )
    if municipality_id is not None:
        cat_query = cat_query.where(Report.municipality_id == municipality_id)

    category_result = await db.execute(cat_query)
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
    municipality_id = await get_municipality_filter(current_user, db)

    query = select(
        Report.id,
        ST_X(Report.location),
        ST_Y(Report.location),
    ).where(Report.location.isnot(None))

    if municipality_id is not None:
        query = query.where(Report.municipality_id == municipality_id)

    result = await db.execute(query)

    return [
        HeatmapPoint(
            report_id=row[0],
            longitude=row[1],
            latitude=row[2],
        )
        for row in result.all()
    ]
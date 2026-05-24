from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.municipality_category_routing import (
    MunicipalityCategoryRouting)
from app.models.municipality import Municipality
from app.models.category import Category
from app.schemas.routing import RoutingCreate, RoutingUpdate, RoutingResponse
from app.core.dependencies import get_current_superadmin, get_current_admin

router = APIRouter(prefix="/routing", tags=["Routing"])


@router.post(
    "/",
    response_model=RoutingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_routing(
    payload: RoutingCreate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    municipality = await db.execute(
        select(Municipality).where(Municipality.id == payload.municipality_id)
    )
    if not municipality.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )

    category = await db.execute(
        select(Category).where(Category.id == payload.category_id)
    )
    if not category.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    existing = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.municipality_id ==
            payload.municipality_id,
            MunicipalityCategoryRouting.category_id ==
            payload.category_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Routing already exists for this municipality and category",
        )

    routing = MunicipalityCategoryRouting(
        municipality_id=payload.municipality_id,
        category_id=payload.category_id,
        routing_email=payload.routing_email,
        department_name=payload.department_name,
    )
    db.add(routing)
    await db.flush()
    await db.refresh(routing)
    return RoutingResponse.model_validate(routing)


@router.get("/", response_model=list[RoutingResponse])
async def list_routings(
    municipality_id: int | None = None,
    category_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    query = select(MunicipalityCategoryRouting)
    if municipality_id:
        query = query.where(
            MunicipalityCategoryRouting.municipality_id == municipality_id
        )
    if category_id:
        query = query.where(
            MunicipalityCategoryRouting.category_id == category_id
        )
    result = await db.execute(query)
    return [
        RoutingResponse.model_validate(r)
        for r in result.scalars().all()
    ]


@router.get("/{routing_id}", response_model=RoutingResponse)
async def get_routing(
    routing_id: int,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
    return RoutingResponse.model_validate(routing)


@router.patch("/{routing_id}", response_model=RoutingResponse)
async def update_routing(
    routing_id: int,
    payload: RoutingUpdate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
    if payload.routing_email is not None:
        routing.routing_email = payload.routing_email
    if payload.department_name is not None:
        routing.department_name = payload.department_name
    if payload.is_active is not None:
        routing.is_active = payload.is_active

    await db.flush()
    await db.refresh(routing)
    return RoutingResponse.model_validate(routing)


@router.delete("/{routing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routing(
    routing_id: int,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
    await db.delete(routing)

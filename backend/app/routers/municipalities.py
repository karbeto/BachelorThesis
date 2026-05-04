from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.municipality import Municipality
from app.models.city import City
from app.schemas.municipality import MunicipalityCreate, MunicipalityResponse
from app.core.dependencies import get_current_superadmin

router = APIRouter(prefix="/municipalities", tags=["Municipalities"])


@router.post(
    "/",
    response_model=MunicipalityResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_municipality(
    payload: MunicipalityCreate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    city_result = await db.execute(
        select(City).where(City.id == payload.city_id)
    )
    if not city_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found",
        )

    result = await db.execute(
        select(Municipality).where(Municipality.name == payload.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Municipality already exists",
        )

    municipality = Municipality(
        name=payload.name,
        city_id=payload.city_id,
    )
    db.add(municipality)
    await db.flush()
    await db.refresh(municipality)
    return MunicipalityResponse.model_validate(municipality)


@router.get("/", response_model=list[MunicipalityResponse])
async def list_municipalities(
    city_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Municipality).order_by(Municipality.name)
    if city_id:
        query = query.where(Municipality.city_id == city_id)
    result = await db.execute(query)
    return [
        MunicipalityResponse.model_validate(m)
        for m in result.scalars().all()
    ]


@router.get("/{municipality_id}", response_model=MunicipalityResponse)
async def get_municipality(
    municipality_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Municipality).where(Municipality.id == municipality_id)
    )
    municipality = result.scalar_one_or_none()
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )
    return MunicipalityResponse.model_validate(municipality)


@router.delete("/{municipality_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_municipality(
    municipality_id: int,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(Municipality).where(Municipality.id == municipality_id)
    )
    municipality = result.scalar_one_or_none()
    if not municipality:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )
    await db.delete(municipality)

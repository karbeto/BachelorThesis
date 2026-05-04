from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.city import City
from app.schemas.city import CityCreate, CityResponse
from app.core.dependencies import get_current_superadmin

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.post(
    "/",
    response_model=CityResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_city(
    payload: CityCreate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(City).where(City.name == payload.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="City already exists",
        )
    city = City(name=payload.name, country=payload.country)
    db.add(city)
    await db.flush()
    await db.refresh(city)
    return CityResponse.model_validate(city)


@router.get("/", response_model=list[CityResponse])
async def list_cities(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(City).order_by(City.name))
    return [CityResponse.model_validate(c) for c in result.scalars().all()]


@router.get("/{city_id}", response_model=CityResponse)
async def get_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found",
        )
    return CityResponse.model_validate(city)


@router.delete("/{city_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_city(
    city_id: int,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(select(City).where(City.id == city_id))
    city = result.scalar_one_or_none()
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found",
        )
    await db.delete(city)

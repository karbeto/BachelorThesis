from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.category import Category
from app.schemas.category import (CategoryCreate,
                                  CategoryUpdate,
                                  CategoryResponse)
from app.core.dependencies import get_current_superadmin

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post(
    "/",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(Category).where(Category.name == payload.name)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Category already exists",
        )
    category = Category(
        name=payload.name,
        description=payload.description,
    )
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return CategoryResponse.model_validate(category)


@router.get("/", response_model=list[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Category)
        .where(Category.is_active == True)  # noqa: E712
        .order_by(Category.name)
    )
    return [
        CategoryResponse.model_validate(c)
        for c in result.scalars().all()
    ]


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return CategoryResponse.model_validate(category)


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    if payload.name is not None:
        category.name = payload.name
    if payload.description is not None:
        category.description = payload.description
    if payload.is_active is not None:
        category.is_active = payload.is_active

    await db.flush()
    await db.refresh(category)
    return CategoryResponse.model_validate(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _: object = Depends(get_current_superadmin),
):
    result = await db.execute(
        select(Category).where(Category.id == category_id)
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    await db.delete(category)

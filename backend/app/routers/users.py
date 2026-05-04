from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.dependencies import get_current_user
from app.core.security import verify_password, hash_password

router = APIRouter(prefix="/users", tags=["Users"])


class UpdateProfile(BaseModel):
    full_name: str | None = None
    phone: str | None = None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


@router.patch("/me", response_model=UserResponse)
async def update_profile(
    payload: UpdateProfile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.phone is not None:
        current_user.phone = payload.phone

    await db.flush()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.patch("/me/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    payload: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )
    current_user.password = hash_password(payload.new_password)
    await db.flush()

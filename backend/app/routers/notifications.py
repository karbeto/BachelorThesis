from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=list[NotificationResponse])
async def list_notifications(
    unread_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    if unread_only:
        query = query.where(Notification.is_read == False)  # noqa: E712

    result = await db.execute(query)
    return [
        NotificationResponse.model_validate(n)
        for n in result.scalars().all()
    ]


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_as_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    notification.is_read = True
    await db.flush()
    await db.refresh(notification)
    return NotificationResponse.model_validate(notification)


@router.patch("/read-all", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_as_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Notification).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False,  # noqa: E712
        )
    )
    notifications = result.scalars().all()
    for notification in notifications:
        notification.is_read = True
    await db.flush()

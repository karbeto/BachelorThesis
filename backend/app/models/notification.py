from sqlalchemy import (
    Column, Integer, Boolean,
    DateTime, ForeignKey, Text,
    CheckConstraint, func,
)
from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    report_id = Column(
        Integer,
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=True,
    )
    idea_id = Column(
        Integer,
        ForeignKey("ideas.id", ondelete="CASCADE"),
        nullable=True,
    )
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    __table_args__ = (
        CheckConstraint(
            "(report_id IS NOT NULL AND idea_id IS NULL) OR "
            "(idea_id IS NOT NULL AND report_id IS NULL)",
            name="ck_notification_one_ref",
        ),
    )

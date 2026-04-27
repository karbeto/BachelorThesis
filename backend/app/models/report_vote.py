from sqlalchemy import (
    Column, Integer, DateTime,
    ForeignKey, UniqueConstraint, func,
)
from app.database import Base


class ReportVote(Base):
    __tablename__ = "report_votes"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(
        Integer,
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "report_id",
            "user_id",
            name="uq_report_vote",
        ),
    )

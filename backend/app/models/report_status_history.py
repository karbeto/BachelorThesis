from sqlalchemy import (
    Column, Integer, String,
    DateTime, ForeignKey, Text, func,
)
from app.database import Base


class ReportStatusHistory(Base):
    __tablename__ = "report_status_history"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(
        Integer,
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    changed_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    old_status = Column(String(30), nullable=False)
    new_status = Column(String(30), nullable=False)
    note = Column(Text, nullable=True)
    changed_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

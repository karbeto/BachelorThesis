import enum
from sqlalchemy import (
    Column, Integer, String, Boolean,
    DateTime, ForeignKey, Text, Enum, func,
)
from geoalchemy2 import Geometry
from app.database import Base


class ReportStatus(str, enum.Enum):
    submitted = "submitted"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    municipality_id = Column(
        Integer,
        ForeignKey("municipalities.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    location = Column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=False,
    )
    address = Column(String(255), nullable=True)
    status = Column(
        Enum(ReportStatus),
        nullable=False,
        default=ReportStatus.submitted,
        index=True,
    )
    is_duplicate = Column(Boolean, nullable=False, default=False)
    parent_report_id = Column(
        Integer,
        ForeignKey("reports.id", ondelete="SET NULL"),
        nullable=True,
    )
    email_sent = Column(Boolean, nullable=False, default=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

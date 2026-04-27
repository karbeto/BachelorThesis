import enum
from sqlalchemy import (
    Column, Integer, String,
    DateTime, ForeignKey, Text, Enum, func,
)
from geoalchemy2 import Geometry
from app.database import Base


class IdeaStatus(str, enum.Enum):
    open = "open"
    under_review = "under_review"
    accepted = "accepted"
    rejected = "rejected"


class Idea(Base):
    __tablename__ = "ideas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    municipality_id = Column(
        Integer,
        ForeignKey("municipalities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=True,
    )
    status = Column(
        Enum(IdeaStatus),
        nullable=False,
        default=IdeaStatus.open,
        index=True,
    )
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

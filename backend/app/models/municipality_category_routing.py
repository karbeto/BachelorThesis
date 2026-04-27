from sqlalchemy import (
    Column, Integer, String, Boolean,
    DateTime, ForeignKey, UniqueConstraint, func,
)
from app.database import Base


class MunicipalityCategoryRouting(Base):
    __tablename__ = "municipality_category_routing"

    id = Column(Integer, primary_key=True, index=True)
    municipality_id = Column(
        Integer,
        ForeignKey("municipalities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category_id = Column(
        Integer,
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    routing_email = Column(String(255), nullable=False)
    department_name = Column(String(150), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "municipality_id",
            "category_id",
            name="uq_municipality_category",
        ),
    )

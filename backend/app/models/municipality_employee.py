from sqlalchemy import (
    Column, Integer, String,
    DateTime, ForeignKey, func,
)
from app.database import Base


class MunicipalityEmployee(Base):
    __tablename__ = "municipality_employees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    municipality_id = Column(
        Integer,
        ForeignKey("municipalities.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    department = Column(String(150), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

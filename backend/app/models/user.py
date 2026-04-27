import enum
from sqlalchemy import (
    Column, Integer, String,
    Boolean, DateTime, Enum,
    func,
)
from app.database import Base


class UserRole(str, enum.Enum):
    citizen = "citizen"
    municipality_admin = "municipality_admin"
    superadmin = "superadmin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(
        Enum(UserRole),
        nullable=False,
        default=UserRole.citizen,
    )
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

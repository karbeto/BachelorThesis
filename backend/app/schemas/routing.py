from pydantic import BaseModel, EmailStr
from datetime import datetime


class RoutingCreate(BaseModel):
    municipality_id: int | None = None 
    category_id: int
    routing_email: EmailStr
    department_name: str | None = None


class RoutingUpdate(BaseModel):
    routing_email: EmailStr | None = None
    department_name: str | None = None
    is_active: bool | None = None


class RoutingResponse(BaseModel):
    id: int
    municipality_id: int
    category_id: int
    routing_email: str
    department_name: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

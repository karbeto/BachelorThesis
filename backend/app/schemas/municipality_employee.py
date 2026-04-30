from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserResponse


class MunicipalityEmployeeCreate(BaseModel):
    user_id: int
    municipality_id: int
    department: str | None = None


class MunicipalityEmployeeResponse(BaseModel):
    id: int
    user_id: int
    municipality_id: int
    department: str | None
    created_at: datetime
    user: UserResponse | None = None

    model_config = {"from_attributes": True}

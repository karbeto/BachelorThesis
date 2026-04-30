from pydantic import BaseModel
from datetime import datetime


class MunicipalityCreate(BaseModel):
    name: str
    city_id: int


class MunicipalityResponse(BaseModel):
    id: int
    name: str
    city_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

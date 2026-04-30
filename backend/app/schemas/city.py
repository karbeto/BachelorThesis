from pydantic import BaseModel
from datetime import datetime


class CityCreate(BaseModel):
    name: str
    country: str = "Macedonia"


class CityResponse(BaseModel):
    id: int
    name: str
    country: str
    created_at: datetime

    model_config = {"from_attributes": True}

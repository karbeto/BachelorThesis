from pydantic import BaseModel, Field
from datetime import datetime
from app.models.idea import IdeaStatus


class IdeaCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)
    municipality_id: int


class IdeaStatusUpdate(BaseModel):
    status: IdeaStatus


class IdeaResponse(BaseModel):
    id: int
    title: str
    description: str
    status: IdeaStatus
    municipality_id: int
    municipality_name: str | None = None
    user_id: int | None
    user_full_name: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    vote_count: int = 0
    voted_by_user: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

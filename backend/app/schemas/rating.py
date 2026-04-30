from pydantic import BaseModel, Field
from datetime import datetime


class ReportRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReportRatingResponse(BaseModel):
    id: int
    report_id: int
    user_id: int
    rating: int
    comment: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

from pydantic import BaseModel, Field
from datetime import datetime
from app.models.report import ReportStatus


class LocationSchema(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class ReportCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str | None = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    address: str | None = None
    category_id: int
    municipality_id: int


class ReportStatusUpdate(BaseModel):
    status: ReportStatus
    note: str | None = None


class ReportImageResponse(BaseModel):
    id: int
    image_url: str
    is_primary: bool

    model_config = {"from_attributes": True}


class ReportResponse(BaseModel):
    id: int
    title: str
    description: str | None
    address: str | None
    status: ReportStatus
    is_duplicate: bool
    parent_report_id: int | None
    email_sent: bool
    category_id: int
    municipality_id: int
    user_id: int | None
    latitude: float | None = None
    longitude: float | None = None
    images: list[ReportImageResponse] = []
    vote_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ReportStatusHistoryResponse(BaseModel):
    id: int
    old_status: ReportStatus
    new_status: ReportStatus
    note: str | None
    changed_by: int | None
    changed_at: datetime

    model_config = {"from_attributes": True}

from pydantic import BaseModel
from datetime import datetime


class NotificationResponse(BaseModel):
    id: int
    message: str
    is_read: bool
    report_id: int | None
    idea_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}

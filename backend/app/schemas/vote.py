from pydantic import BaseModel
from datetime import datetime


class VoteResponse(BaseModel):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportVoteResponse(VoteResponse):
    report_id: int


class IdeaVoteResponse(VoteResponse):
    idea_id: int

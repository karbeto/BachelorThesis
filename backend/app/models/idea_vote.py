from sqlalchemy import (
    Column, Integer, DateTime,
    ForeignKey, UniqueConstraint, func,
)
from app.database import Base


class IdeaVote(Base):
    __tablename__ = "idea_votes"

    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(
        Integer,
        ForeignKey("ideas.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "idea_id",
            "user_id",
            name="uq_idea_vote",
        ),
    )

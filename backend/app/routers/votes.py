from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.report_vote import ReportVote
from app.models.idea_vote import IdeaVote
from app.models.report import Report
from app.models.idea import Idea
from app.schemas.vote import ReportVoteResponse, IdeaVoteResponse
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(tags=["Votes"])


@router.post(
    "/reports/{report_id}/vote",
    response_model=ReportVoteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def vote_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = await db.execute(
        select(Report).where(Report.id == report_id)
    )
    if not report.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
        
    target_report_id = report.parent_report_id if report.is_duplicate and report.parent_report_id else report.id
    
    existing = await db.execute(
        select(ReportVote).where(
            ReportVote.report_id == report_id,
            ReportVote.user_id == current_user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already voted for this report",
        )

    vote = ReportVote(report_id=report_id, user_id=current_user.id)
    db.add(vote)
    await db.commit()
    await db.refresh(vote)
    return ReportVoteResponse.model_validate(vote)


@router.delete(
    "/reports/{report_id}/vote",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def unvote_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ReportVote).where(
            ReportVote.report_id == report_id,
            ReportVote.user_id == current_user.id,
        )
    )
    vote = result.scalar_one_or_none()
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vote not found",
        )
    await db.delete(vote)


@router.post(
    "/ideas/{idea_id}/vote",
    response_model=IdeaVoteResponse,
    status_code=status.HTTP_201_CREATED,
)
async def vote_idea(
    idea_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    idea = await db.execute(
        select(Idea).where(Idea.id == idea_id)
    )
    if not idea.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found",
        )

    existing = await db.execute(
        select(IdeaVote).where(
            IdeaVote.idea_id == idea_id,
            IdeaVote.user_id == current_user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Already voted for this idea",
        )

    vote = IdeaVote(idea_id=idea_id, user_id=current_user.id)
    db.add(vote)
    await db.flush()
    await db.refresh(vote)
    return IdeaVoteResponse.model_validate(vote)


@router.delete(
    "/ideas/{idea_id}/vote",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def unvote_idea(
    idea_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(IdeaVote).where(
            IdeaVote.idea_id == idea_id,
            IdeaVote.user_id == current_user.id,
        )
    )
    vote = result.scalar_one_or_none()
    if not vote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vote not found",
        )
    await db.delete(vote)

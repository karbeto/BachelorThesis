from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.idea import Idea, IdeaStatus
from app.models.idea_vote import IdeaVote
from app.models.municipality import Municipality
from app.schemas.idea import IdeaCreate, IdeaStatusUpdate, IdeaResponse
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter(prefix="/ideas", tags=["Ideas"])


async def get_idea_or_404(idea_id: int, db: AsyncSession) -> Idea:
    """Retrieves the tracked ORM instance for state modifications."""
    result = await db.execute(select(Idea).where(Idea.id == idea_id))
    idea = result.scalar_one_or_none()
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found",
        )
    return idea


def build_idea_response(
    idea: Idea, 
    municipality_name: str | None, 
    user_full_name: str | None, 
    vote_count: int
) -> IdeaResponse:
    """Maps database fields and processes spatial coordinates cleanly."""
    lat, lon = None, None
    if getattr(idea, "location", None) is not None:
        try:
            from geoalchemy2.shape import to_shape
            point = to_shape(idea.location)
            lat = point.y
            lon = point.x
        except Exception:
            pass

    return IdeaResponse(
        id=idea.id,
        title=idea.title,
        description=idea.description,
        status=idea.status,
        municipality_id=idea.municipality_id,
        municipality_name=municipality_name,
        user_id=idea.user_id,
        user_full_name=user_full_name,
        latitude=lat,
        longitude=lon,
        vote_count=vote_count,
        created_at=idea.created_at,
        updated_at=idea.updated_at,
    )


@router.post("/", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
async def create_idea(
    payload: IdeaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    municipality_result = await db.execute(
        select(Municipality.name).where(Municipality.id == payload.municipality_id)
    )
    municipality_name = municipality_result.scalar_one_or_none()
    if not municipality_name:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )

    idea = Idea(
        title=payload.title,
        description=payload.description,
        municipality_id=payload.municipality_id,
        user_id=current_user.id,
        status=IdeaStatus.open,
    )

    if payload.latitude is not None and payload.longitude is not None:
        from geoalchemy2.shape import from_shape
        from shapely.geometry import Point
        idea.location = from_shape(
            Point(payload.longitude, payload.latitude), srid=4326
        )

    db.add(idea)
    await db.commit()  # Persists resource to database
    await db.refresh(idea)
    
    return build_idea_response(
        idea, 
        municipality_name=municipality_name, 
        user_full_name=current_user.full_name, 
        vote_count=0
    )


@router.get("/", response_model=list[IdeaResponse])
async def list_ideas(
    municipality_id: int | None = None,
    status: IdeaStatus | None = None,
    db: AsyncSession = Depends(get_db),
):
    # Perform clean SQL outerjoins to resolve string data fields directly
    query = (
        select(Idea, Municipality.name, User.full_name)
        .outerjoin(Municipality, Municipality.id == Idea.municipality_id)
        .outerjoin(User, User.id == Idea.user_id)
        .order_by(Idea.created_at.desc())
    )
    if municipality_id:
        query = query.where(Idea.municipality_id == municipality_id)
    if status:
        query = query.where(Idea.status == status)

    result = await db.execute(query)
    rows = result.all()

    responses = []
    for idea, municipality_name, user_full_name in rows:
        vote_result = await db.execute(
            select(func.count(IdeaVote.id)).where(IdeaVote.idea_id == idea.id)
        )
        vote_count = vote_result.scalar() or 0
        responses.append(
            build_idea_response(idea, municipality_name, user_full_name, vote_count)
        )

    return responses


@router.get("/{idea_id}", response_model=IdeaResponse)
async def get_idea(
    idea_id: int,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Idea, Municipality.name, User.full_name)
        .outerjoin(Municipality, Municipality.id == Idea.municipality_id)
        .outerjoin(User, User.id == Idea.user_id)
        .where(Idea.id == idea_id)
    )
    result = await db.execute(query)
    row = result.first()
    
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found",
        )
        
    idea, municipality_name, user_full_name = row
    
    vote_result = await db.execute(
        select(func.count(IdeaVote.id)).where(IdeaVote.idea_id == idea_id)
    )
    vote_count = vote_result.scalar() or 0
    
    return build_idea_response(idea, municipality_name, user_full_name, vote_count)


@router.patch("/{idea_id}/status", response_model=IdeaResponse)
async def update_idea_status(
    idea_id: int,
    payload: IdeaStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    idea = await get_idea_or_404(idea_id, db)
    idea.status = payload.status
    await db.commit()  # Save status update

    query = (
        select(Idea, Municipality.name, User.full_name)
        .outerjoin(Municipality, Municipality.id == Idea.municipality_id)
        .outerjoin(User, User.id == Idea.user_id)
        .where(Idea.id == idea_id)
    )
    result = await db.execute(query)
    idea, municipality_name, user_full_name = result.first()

    vote_result = await db.execute(
        select(func.count(IdeaVote.id)).where(IdeaVote.idea_id == idea_id)
    )
    vote_count = vote_result.scalar() or 0
    return build_idea_response(idea, municipality_name, user_full_name, vote_count)


@router.delete("/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_idea(
    idea_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    idea = await get_idea_or_404(idea_id, db)
    if idea.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own ideas",
        )
    await db.delete(idea)
    await db.commit()  # Save delete action


@router.post("/{idea_id}/vote", status_code=status.HTTP_201_CREATED)
async def vote_idea(
    idea_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await get_idea_or_404(idea_id, db)
    existing = await db.execute(
        select(IdeaVote).where(
            IdeaVote.idea_id == idea_id,
            IdeaVote.user_id == current_user.id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Already voted")
        
    db.add(IdeaVote(idea_id=idea_id, user_id=current_user.id))
    await db.commit()  
    return {"voted": True}


@router.delete("/{idea_id}/vote", status_code=status.HTTP_204_NO_CONTENT)
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
        raise HTTPException(status_code=404, detail="Vote not found")
        
    await db.delete(vote)
    await db.commit() 
    return None
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.database import get_db
from app.models.municipality_category_routing import MunicipalityCategoryRouting
from app.models.user import User
from app.models.municipality import Municipality
from app.models.category import Category
from app.schemas.routing import RoutingCreate, RoutingUpdate, RoutingResponse
from app.core.dependencies import get_current_admin

router = APIRouter(prefix="/routing", tags=["Routing"])


@router.post(
    "/",
    response_model=RoutingResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_routing(
    payload: RoutingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin), 
):
    if current_user.role != "superadmin":
        emp_query = await db.execute(
            text("SELECT municipality_id FROM municipality_employees WHERE user_id = :u_id"),
            {"u_id": current_user.id}
        )
        resolved_municipality_id = emp_query.scalar_one_or_none()
        
        if resolved_municipality_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your admin account is not assigned to any municipality workspace."
            )
    else:
        if payload.municipality_id is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="municipality_id is required for superadmin configurations."
            )
        resolved_municipality_id = payload.municipality_id

    municipality = await db.execute(
        select(Municipality).where(Municipality.id == resolved_municipality_id)
    )
    if not municipality.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Municipality not found",
        )

    category = await db.execute(
        select(Category).where(Category.id == payload.category_id)
    )
    if not category.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    existing = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.municipality_id == resolved_municipality_id,
            MunicipalityCategoryRouting.category_id == payload.category_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Routing already exists for this municipality and category",
        )

    routing = MunicipalityCategoryRouting(
        municipality_id=resolved_municipality_id, 
        category_id=payload.category_id,
        routing_email=payload.routing_email,
        department_name=payload.department_name,
    )
    db.add(routing)
    await db.flush()
    await db.refresh(routing)
    return RoutingResponse.model_validate(routing)


@router.get("/", response_model=list[RoutingResponse])
async def list_routings(
    municipality_id: int | None = None,
    category_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    query = select(MunicipalityCategoryRouting)
    
    if current_user.role != "superadmin":
        emp_query = await db.execute(
            text("SELECT municipality_id FROM municipality_employees WHERE user_id = :u_id"),
            {"u_id": current_user.id}
        )
        user_municipality_id = emp_query.scalar_one_or_none()
        
        if user_municipality_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin account is not assigned to any municipality layout."
            )
        
        if municipality_id and municipality_id != user_municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view configurations for this municipality."
            )
            
        municipality_id = user_municipality_id

    if municipality_id:
        query = query.where(
            MunicipalityCategoryRouting.municipality_id == municipality_id
        )
    if category_id:
        query = query.where(
            MunicipalityCategoryRouting.category_id == category_id
        )
        
    result = await db.execute(query)
    return [
        RoutingResponse.model_validate(r)
        for r in result.scalars().all()
    ]


@router.get("/{routing_id}", response_model=RoutingResponse)
async def get_routing(
    routing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
        
    if current_user.role != "superadmin":
        emp_query = await db.execute(
            text("SELECT municipality_id FROM municipality_employees WHERE user_id = :u_id"),
            {"u_id": current_user.id}
        )
        user_municipality_id = emp_query.scalar_one_or_none()
        if user_municipality_id is None or routing.municipality_id != user_municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this routing configuration."
            )

    return RoutingResponse.model_validate(routing)


@router.patch("/{routing_id}", response_model=RoutingResponse)
async def update_routing(
    routing_id: int,
    payload: RoutingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
        
    if current_user.role != "superadmin":
        emp_query = await db.execute(
            text("SELECT municipality_id FROM municipality_employees WHERE user_id = :u_id"),
            {"u_id": current_user.id}
        )
        user_municipality_id = emp_query.scalar_one_or_none()
        if user_municipality_id is None or routing.municipality_id != user_municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to modify this routing configuration."
            )

    if payload.routing_email is not None:
        routing.routing_email = payload.routing_email
    if payload.department_name is not None:
        routing.department_name = payload.department_name
    if payload.is_active is not None:
        routing.is_active = payload.is_active

    await db.flush()
    await db.refresh(routing)
    return RoutingResponse.model_validate(routing)


@router.delete("/{routing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routing(
    routing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(MunicipalityCategoryRouting).where(
            MunicipalityCategoryRouting.id == routing_id
        )
    )
    routing = result.scalar_one_or_none()
    if not routing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routing not found",
        )
        
    if current_user.role != "superadmin":
        emp_query = await db.execute(
            text("SELECT municipality_id FROM municipality_employees WHERE user_id = :u_id"),
            {"u_id": current_user.id}
        )
        user_municipality_id = emp_query.scalar_one_or_none()
        if user_municipality_id is None or routing.municipality_id != user_municipality_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this routing configuration."
            )

    await db.delete(routing)
    await db.flush()
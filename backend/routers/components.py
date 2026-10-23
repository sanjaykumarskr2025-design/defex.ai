from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Component, Machine, User, get_db
from schemas import Component as ComponentSchema, ComponentCreate, ListResponse
from auth import get_current_user

router = APIRouter(prefix="/api/v1/components", tags=["components"])

@router.get("", response_model=ListResponse)
async def list_components(
    machine_id: str = None,
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Component).filter(Component.user_id == current_user.id)
    if machine_id:
        query = query.filter(Component.machine_id == machine_id)

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {
        "items": [ComponentSchema.from_orm(c) for c in items],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{component_id}", response_model=ComponentSchema)
async def get_component(
    component_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.user_id == current_user.id
    ).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return ComponentSchema.from_orm(component)

@router.post("", response_model=ComponentSchema)
async def create_component(
    component: ComponentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify machine exists and belongs to user
    machine = db.query(Machine).filter(
        Machine.id == component.machine_id,
        Machine.user_id == current_user.id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db_component = Component(**component.dict(), user_id=current_user.id)
    db.add(db_component)
    db.commit()
    db.refresh(db_component)
    return ComponentSchema.from_orm(db_component)

@router.put("/{component_id}", response_model=ComponentSchema)
async def update_component(
    component_id: str,
    component_update: ComponentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.user_id == current_user.id
    ).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    for key, value in component_update.dict().items():
        setattr(component, key, value)

    db.commit()
    db.refresh(component)
    return ComponentSchema.from_orm(component)

@router.delete("/{component_id}")
async def delete_component(
    component_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.user_id == current_user.id
    ).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    db.delete(component)
    db.commit()
    return {"message": "Component deleted"}

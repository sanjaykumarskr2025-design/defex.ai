from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Maintenance, User, get_db
from schemas import Maintenance as MaintenanceSchema, MaintenanceCreate, ListResponse
from auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/v1/maintenance", tags=["maintenance"])

@router.get("", response_model=ListResponse)
async def list_maintenance(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Maintenance).filter(Maintenance.user_id == current_user.id).count()
    items = db.query(Maintenance).filter(Maintenance.user_id == current_user.id).order_by(Maintenance.due_date).offset(skip).limit(limit).all()

    return {
        "items": [MaintenanceSchema.from_orm(m) for m in items],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{maintenance_id}", response_model=MaintenanceSchema)
async def get_maintenance(
    maintenance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    maintenance = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id,
        Maintenance.user_id == current_user.id
    ).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance task not found")
    return MaintenanceSchema.from_orm(maintenance)

@router.post("", response_model=MaintenanceSchema)
async def create_maintenance(
    maintenance: MaintenanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_maintenance = Maintenance(**maintenance.dict(), user_id=current_user.id)
    db.add(db_maintenance)
    db.commit()
    db.refresh(db_maintenance)
    return MaintenanceSchema.from_orm(db_maintenance)

@router.put("/{maintenance_id}", response_model=MaintenanceSchema)
async def update_maintenance(
    maintenance_id: str,
    maintenance_update: MaintenanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    maintenance = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id,
        Maintenance.user_id == current_user.id
    ).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance task not found")

    for key, value in maintenance_update.dict().items():
        setattr(maintenance, key, value)

    db.commit()
    db.refresh(maintenance)
    return MaintenanceSchema.from_orm(maintenance)

@router.post("/{maintenance_id}/complete")
async def complete_maintenance(
    maintenance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    maintenance = db.query(Maintenance).filter(
        Maintenance.id == maintenance_id,
        Maintenance.user_id == current_user.id
    ).first()
    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance task not found")

    maintenance.status = "completed"
    maintenance.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(maintenance)
    return MaintenanceSchema.from_orm(maintenance)

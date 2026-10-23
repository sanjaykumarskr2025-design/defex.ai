from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import Machine, User, get_db
from schemas import Machine as MachineSchema, MachineCreate, ListResponse
from auth import get_current_user
from typing import List

router = APIRouter(prefix="/api/v1/machines", tags=["machines"])

@router.get("", response_model=ListResponse)
async def list_machines(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Machine).filter(Machine.user_id == current_user.id).count()
    items = db.query(Machine).filter(Machine.user_id == current_user.id).offset(skip).limit(limit).all()
    return {
        "items": [MachineSchema.from_orm(m) for m in items],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{machine_id}", response_model=MachineSchema)
async def get_machine(
    machine_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return MachineSchema.from_orm(machine)

@router.post("", response_model=MachineSchema)
async def create_machine(
    machine: MachineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_machine = Machine(**machine.dict(), user_id=current_user.id)
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return MachineSchema.from_orm(db_machine)

@router.put("/{machine_id}", response_model=MachineSchema)
async def update_machine(
    machine_id: str,
    machine_update: MachineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    for key, value in machine_update.dict().items():
        setattr(machine, key, value)

    db.commit()
    db.refresh(machine)
    return MachineSchema.from_orm(machine)

@router.delete("/{machine_id}")
async def delete_machine(
    machine_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    db.delete(machine)
    db.commit()
    return {"message": "Machine deleted"}

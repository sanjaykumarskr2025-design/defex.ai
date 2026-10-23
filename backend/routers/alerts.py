from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Alert, User, get_db
from schemas import Alert as AlertSchema, AlertCreate, ListResponse
from auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])

@router.get("", response_model=ListResponse)
async def list_alerts(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Alert).filter(Alert.user_id == current_user.id).count()
    items = db.query(Alert).filter(Alert.user_id == current_user.id).order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()

    result_items = []
    for alert in items:
        from database import Machine, Component
        machine = db.query(Machine).filter(Machine.id == alert.machine_id).first()
        component = db.query(Component).filter(Component.id == alert.component_id).first() if alert.component_id else None

        alert_dict = AlertSchema.from_orm(alert).dict()
        alert_dict["machine_name"] = machine.name if machine else "Unknown"
        alert_dict["component_name"] = component.name if component else "N/A"
        result_items.append(alert_dict)

    return {
        "items": result_items,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{alert_id}", response_model=AlertSchema)
async def get_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return AlertSchema.from_orm(alert)

@router.post("{alert_id}/acknowledge")
async def acknowledge_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "acknowledged"
    alert.acknowledged_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return AlertSchema.from_orm(alert)

@router.post("/{alert_id}/resolve")
async def resolve_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    alert = db.query(Alert).filter(
        Alert.id == alert_id,
        Alert.user_id == current_user.id
    ).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.status = "resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return AlertSchema.from_orm(alert)

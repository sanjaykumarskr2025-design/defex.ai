from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import Alert, User, Machine, Component, get_db
from schemas import Alert as AlertSchema, AlertCreate, ListResponse
from auth import get_current_user
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])

@router.get("", response_model=ListResponse)
async def list_alerts(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Alert).filter(Alert.user_id == current_user.id).count()
    # Use eager loading to avoid N+1 queries
    items = db.query(Alert).options(
        joinedload(Alert.machine),
        joinedload(Alert.component)
    ).filter(Alert.user_id == current_user.id).order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()

    result_items = []
    for alert in items:
        alert_dict = AlertSchema.from_orm(alert).dict()
        alert_dict["machine_name"] = alert.machine.name if alert.machine else "Unknown"
        alert_dict["component_name"] = alert.component.name if alert.component else "N/A"
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

@router.post("/{alert_id}/acknowledge")
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
    alert.acknowledged_at = datetime.now(timezone.utc)
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
    alert.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alert)
    return AlertSchema.from_orm(alert)

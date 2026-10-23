from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import User, Machine, Component, Inspection, Alert, get_db
from schemas import DashboardStats
from auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_machines = db.query(Machine).filter(Machine.user_id == current_user.id).count()
    total_components = db.query(Component).filter(Component.user_id == current_user.id).count()
    total_inspections = db.query(Inspection).filter(Inspection.user_id == current_user.id).count()
    active_alerts = db.query(Alert).filter(
        Alert.user_id == current_user.id,
        Alert.status.in_(["open", "acknowledged"])
    ).count()
    machines_operational = db.query(Machine).filter(
        Machine.user_id == current_user.id,
        Machine.status == "operational"
    ).count()
    machines_maintenance = db.query(Machine).filter(
        Machine.user_id == current_user.id,
        Machine.status == "maintenance"
    ).count()

    return {
        "total_machines": total_machines,
        "total_components": total_components,
        "total_inspections": total_inspections,
        "active_alerts": active_alerts,
        "machines_operational": machines_operational,
        "machines_maintenance": machines_maintenance
    }

@router.get("/chart-data")
async def get_chart_data(
    period: str = "30d",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Determine date range
    if period == "7d":
        days = 7
    elif period == "30d":
        days = 30
    elif period == "90d":
        days = 90
    else:
        days = 30

    start_date = datetime.utcnow() - timedelta(days=days)

    # Inspections timeline
    inspections = db.query(Inspection).filter(
        Inspection.user_id == current_user.id,
        Inspection.created_at >= start_date
    ).all()

    timeline_data = {}
    for inspection in inspections:
        date = inspection.created_at.strftime("%Y-%m-%d")
        timeline_data[date] = timeline_data.get(date, 0) + 1

    inspections_timeline = [
        {"date": date, "count": count}
        for date, count in sorted(timeline_data.items())
    ]

    # Defect distribution
    defect_counts = {}
    for inspection in inspections:
        for defect in inspection.defects:
            category = defect.get("category", "Unknown")
            defect_counts[category] = defect_counts.get(category, 0) + 1

    defect_distribution = [
        {"name": cat, "value": count}
        for cat, count in sorted(defect_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # Severity distribution
    severity_counts = {}
    for inspection in inspections:
        severity = inspection.severity
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    severity_distribution = [
        {"severity": sev, "count": count}
        for sev, count in severity_counts.items()
    ]

    return {
        "inspections_timeline": inspections_timeline,
        "defect_distribution": defect_distribution,
        "severity_distribution": severity_distribution
    }

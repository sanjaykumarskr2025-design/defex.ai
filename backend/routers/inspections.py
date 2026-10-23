from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from database import Inspection, Component, Machine, User, Alert, get_db
from schemas import Inspection as InspectionSchema, ListResponse
from auth import get_current_user
import cv2
import numpy as np
from pathlib import Path
import os
from datetime import datetime, timezone

router = APIRouter(prefix="/api/v1/inspections", tags=["inspections"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

def detect_defects_heuristic(image_path: str) -> dict:
    """
    Simple heuristic-based defect detection using OpenCV.
    This is a prototype implementation - a real model would be more sophisticated.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return {"defects": [], "severity": "low", "recommendation": "Image could not be processed"}

        # Edge detection
        edges = cv2.Canny(img, 100, 200)
        # Handle OpenCV version differences (3.x vs 4.x)
        result = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        contours = result[0] if len(result) == 3 else result[1]

        defects = []
        severity = "low"

        # Heuristic: more contours might indicate defects
        if len(contours) > 50:
            severity = "high"
            defects.append({
                "category": "Surface Irregularities",
                "confidence": 0.72,
                "region": None
            })
        elif len(contours) > 20:
            severity = "medium"
            defects.append({
                "category": "Minor Scratches",
                "confidence": 0.58,
                "region": None
            })

        # Variance test for wear/corrosion
        variance = cv2.Laplacian(img, cv2.CV_64F).var()
        if variance < 50:
            defects.append({
                "category": "Wear Pattern",
                "confidence": 0.65,
                "region": None
            })

        recommendation = "Monitor component" if defects else "Component appears normal"

        return {
            "defects": defects,
            "severity": severity,
            "recommendation": recommendation
        }
    except Exception as e:
        return {
            "defects": [],
            "severity": "low",
            "recommendation": f"Analysis incomplete: {str(e)}"
        }

@router.get("", response_model=ListResponse)
async def list_inspections(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total = db.query(Inspection).filter(Inspection.user_id == current_user.id).count()
    # Use eager loading to avoid N+1
    items = db.query(Inspection).options(
        joinedload(Inspection.machine),
        joinedload(Inspection.component)
    ).filter(Inspection.user_id == current_user.id).order_by(Inspection.created_at.desc()).offset(skip).limit(limit).all()

    result_items = []
    for inspection in items:
        inspection_dict = InspectionSchema.from_orm(inspection).dict()
        inspection_dict["machine_name"] = inspection.machine.name if inspection.machine else "Unknown"
        inspection_dict["component_name"] = inspection.component.name if inspection.component else "Unknown"
        result_items.append(inspection_dict)

    return {
        "items": result_items,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/{inspection_id}", response_model=InspectionSchema)
async def get_inspection(
    inspection_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inspection = db.query(Inspection).filter(
        Inspection.id == inspection_id,
        Inspection.user_id == current_user.id
    ).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return InspectionSchema.from_orm(inspection)

@router.post("")
async def create_inspection(
    component_id: str,
    machine_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify component and machine exist
    component = db.query(Component).filter(
        Component.id == component_id,
        Component.user_id == current_user.id
    ).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    machine = db.query(Machine).filter(
        Machine.id == machine_id,
        Machine.user_id == current_user.id
    ).first()
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")

    # Save uploaded file
    file_path = UPLOAD_DIR / f"{datetime.now(timezone.utc).timestamp()}_{file.filename}"
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Run defect detection
    detection_result = detect_defects_heuristic(str(file_path))

    # Create inspection record
    db_inspection = Inspection(
        user_id=current_user.id,
        machine_id=machine_id,
        component_id=component_id,
        image_path=str(file_path),
        status="completed",
        severity=detection_result["severity"],
        defects=detection_result["defects"],
        recommendation=detection_result["recommendation"]
    )
    db.add(db_inspection)
    db.commit()
    db.refresh(db_inspection)

    # Generate alert if defects found
    if detection_result["defects"]:
        alert = Alert(
            user_id=current_user.id,
            machine_id=machine_id,
            component_id=component_id,
            title=f"Defects detected in {component.name}",
            description=f"Inspection found {len(detection_result['defects'])} potential defects",
            priority=detection_result["severity"],
            status="open"
        )
        db.add(alert)
        db.commit()

    return {
        **InspectionSchema.from_orm(db_inspection).dict(),
        "machine_name": machine.name,
        "component_name": component.name
    }

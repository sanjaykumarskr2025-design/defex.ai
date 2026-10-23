import os
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# Auth
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    role: str = "operator"
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    user: User

# Machine
class MachineBase(BaseModel):
    name: str
    type: str
    location: str
    status: str = "operational"

class MachineCreate(MachineBase):
    pass

class Machine(MachineBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Component
class ComponentBase(BaseModel):
    name: str
    type: str
    machine_id: str
    serial_number: Optional[str] = None
    condition: str = "good"

class ComponentCreate(ComponentBase):
    pass

class Component(ComponentBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Inspection
class DefectDetection(BaseModel):
    category: str
    confidence: float
    region: Optional[dict] = None

class InspectionBase(BaseModel):
    component_id: str
    machine_id: str
    status: str = "completed"
    severity: str = "low"
    defects: list[DefectDetection] = []
    recommendation: str = ""

class InspectionCreate(InspectionBase):
    pass

class Inspection(InspectionBase):
    id: str
    user_id: str
    image_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Alert
class AlertBase(BaseModel):
    title: str
    description: str
    machine_id: str
    component_id: Optional[str] = None
    priority: str = "medium"
    status: str = "open"

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: str
    user_id: str
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Maintenance
class MaintenanceBase(BaseModel):
    title: str
    description: str
    machine_id: str
    component_id: Optional[str] = None
    priority: str = "medium"
    due_date: datetime
    status: str = "pending"

class MaintenanceCreate(MaintenanceBase):
    pass

class Maintenance(MaintenanceBase):
    id: str
    user_id: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Pagination
class ListResponse(BaseModel):
    items: list
    total: int
    skip: int
    limit: int

# Dashboard
class DashboardStats(BaseModel):
    total_machines: int
    total_components: int
    total_inspections: int
    active_alerts: int
    machines_operational: int
    machines_maintenance: int

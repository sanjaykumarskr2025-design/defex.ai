from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Float, Integer, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import uuid
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./partsight.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="operator")
    created_at = Column(DateTime, default=datetime.utcnow)

    machines = relationship("Machine", back_populates="user")
    components = relationship("Component", back_populates="user")
    inspections = relationship("Inspection", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    maintenance = relationship("Maintenance", back_populates="user")

class Machine(Base):
    __tablename__ = "machines"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    type = Column(String)
    location = Column(String)
    status = Column(String, default="operational")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="machines")
    components = relationship("Component", back_populates="machine")
    inspections = relationship("Inspection", back_populates="machine")
    alerts = relationship("Alert", back_populates="machine")
    maintenance = relationship("Maintenance", back_populates="machine")

class Component(Base):
    __tablename__ = "components"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    machine_id = Column(String, ForeignKey("machines.id"))
    name = Column(String, index=True)
    type = Column(String)
    serial_number = Column(String, nullable=True)
    condition = Column(String, default="good")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="components")
    machine = relationship("Machine", back_populates="components")
    inspections = relationship("Inspection", back_populates="component")
    alerts = relationship("Alert", back_populates="component")
    maintenance = relationship("Maintenance", back_populates="component")

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    machine_id = Column(String, ForeignKey("machines.id"))
    component_id = Column(String, ForeignKey("components.id"))
    image_path = Column(String, nullable=True)
    status = Column(String, default="completed")
    severity = Column(String, default="low")
    defects = Column(JSON, default=list)
    recommendation = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="inspections")
    machine = relationship("Machine", back_populates="inspections")
    component = relationship("Component", back_populates="inspections")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    machine_id = Column(String, ForeignKey("machines.id"))
    component_id = Column(String, ForeignKey("components.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    priority = Column(String, default="medium")
    status = Column(String, default="open")
    created_at = Column(DateTime, default=datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="alerts")
    machine = relationship("Machine", back_populates="alerts")
    component = relationship("Component", back_populates="alerts")

class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    machine_id = Column(String, ForeignKey("machines.id"))
    component_id = Column(String, ForeignKey("components.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    priority = Column(String, default="medium")
    due_date = Column(DateTime)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="maintenance")
    machine = relationship("Machine", back_populates="maintenance")
    component = relationship("Component", back_populates="maintenance")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)

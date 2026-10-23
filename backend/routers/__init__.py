from fastapi import APIRouter

from . import auth, machines, components, inspections, alerts, maintenance, dashboard

__all__ = ["auth", "machines", "components", "inspections", "alerts", "maintenance", "dashboard"]

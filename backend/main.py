from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi
import os
from pathlib import Path

from database import init_db

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="DefEx.ai API",
    description="AI-Powered Defect Detection Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from routers import auth, machines, components, inspections, alerts, maintenance, dashboard

app.include_router(auth.router)
app.include_router(machines.router)
app.include_router(components.router)
app.include_router(inspections.router)
app.include_router(alerts.router)
app.include_router(maintenance.router)
app.include_router(dashboard.router)

# Health check
@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "name": "DefEx.ai",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

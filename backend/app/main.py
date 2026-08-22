from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine

# ============================================================
# Import ALL models before create_all()
# ============================================================

from app.models import (
    User,
    Prediction,
    MLModel,
    ModelMetric,
)

from app.routers.auth import router as auth_router
from app.routers.prediction import router as prediction_router


# ============================================================
# Create database tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="Rumor Detection API",
    description="Backend API for the Rumor Detection System",
    version="1.0.0",
)


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # ----------------------------------------------------
        # Production Vercel frontend
        # ----------------------------------------------------
        "https://rumor-detection-system-git-main-demo-176f.vercel.app",

        # Other Vercel deployment
        "https://rumor-detection-system-dgd6zbkrd-demo-176f.vercel.app",

        # ----------------------------------------------------
        # Local development
        # ----------------------------------------------------
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ],

    # Required for JWT Authorization / authenticated requests
    allow_credentials=True,

    # Allow GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_methods=["*"],

    # Allow Content-Type, Authorization, etc.
    allow_headers=["*"],
)


# ============================================================
# Routers
# ============================================================

app.include_router(auth_router)
app.include_router(prediction_router)


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Rumor Detection API is running",
        "status": "success",
    }


# ============================================================
# Health Check
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
    }


# ============================================================
# Database Test
# ============================================================

@app.get("/api/database-test")
def database_test():

    try:
        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT DATABASE()")
            )

            database_name = result.scalar()

        return {
            "status": "success",
            "message": "MySQL connection successful",
            "database": database_name,
        }

    except Exception as e:

        return {
            "status": "error",
            "message": "MySQL connection failed",
            "error": str(e),
        }
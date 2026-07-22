from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.logger import setup_logging
from backend.app.api.v1.endpoints.health import router as health_router

# Setup Logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API services supporting AirSight AI platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS configuration
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Core Platform Services
app.include_router(health_router, prefix=settings.API_V1_STR, tags=["System Health"])

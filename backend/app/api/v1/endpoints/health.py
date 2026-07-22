from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from backend.app.db.session import get_db

router = APIRouter()

@router.get("/health", summary="Perform System Health Check")
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    Standard platform health check monitoring API layer uptime 
    and asynchronous PostGIS connection state.
    """
    db_status = "healthy"
    try:
        # Verify db session can query database
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "online" if db_status == "healthy" else "degraded",
        "database": db_status,
        "services": {
            "fastapi": "healthy"
        }
    }

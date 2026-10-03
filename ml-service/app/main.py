import os
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="VayuGuard ML Analytics Service",
    description="Microservice for environmental data analysis and predictive health modeling",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

class HealthResponse(BaseModel):
    status: str
    service: str
    uptime_seconds: float
    model_loaded: bool

@app.get("/")
def read_root():
    return {
        "service": "VayuGuard ML Service",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
def health_check():
    """
    Health check endpoint for ML Service
    """
    return HealthResponse(
        status="ok",
        service="ml-service",
        uptime_seconds=round(time.time() - START_TIME, 2),
        model_loaded=False  # Phase 1: Model integration in later phase
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

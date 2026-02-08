from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.routers import (
    auth_router,
    profile_router,
    incidents_router,
    risks_router,
    reports_router,
    metrics_router,
    patterns_router,
    graphs_router,
    analysis_router,
    controls_router,
    notifications_router,
    onboarding_router,
    scenarios_router,
    graph_studio_router,
)
from app.seed import seed_data

app = FastAPI(title="EFCE API")

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(incidents_router)
app.include_router(risks_router)
app.include_router(reports_router)
app.include_router(metrics_router)
app.include_router(patterns_router)
app.include_router(graphs_router)
app.include_router(graph_studio_router)
app.include_router(analysis_router)
app.include_router(controls_router)
app.include_router(notifications_router)
app.include_router(onboarding_router)
app.include_router(scenarios_router)


@app.on_event("startup")
def on_startup() -> None:
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

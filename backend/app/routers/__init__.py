from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.incidents import router as incidents_router
from app.routers.risks import router as risks_router
from app.routers.reports import router as reports_router
from app.routers.metrics import router as metrics_router
from app.routers.patterns import router as patterns_router
from app.routers.graphs import router as graphs_router
from app.routers.analysis import router as analysis_router
from app.routers.controls import router as controls_router

__all__ = [
    "auth_router",
    "profile_router",
    "incidents_router",
    "risks_router",
    "reports_router",
    "metrics_router",
    "patterns_router",
    "graphs_router",
    "analysis_router",
    "controls_router",
]

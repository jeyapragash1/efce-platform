from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.models.metric import DailyMetric
from app.schemas.metric import DailyMetric as DailyMetricSchema

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/daily", response_model=list[DailyMetricSchema])
def list_metrics(db: Session = Depends(get_db)) -> list[DailyMetricSchema]:
    return db.query(DailyMetric).order_by(DailyMetric.date.asc()).all()

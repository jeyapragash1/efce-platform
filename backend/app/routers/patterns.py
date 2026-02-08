from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.pattern import CausePattern, RepeatRateTrend, ServiceCauseMatrix
from app.schemas.pattern import CausePattern as CausePatternSchema
from app.schemas.pattern import PatternsSummary, RepeatRateTrend as RepeatRateTrendSchema, ServiceCauseMatrixRow

router = APIRouter(prefix="/patterns", tags=["patterns"])


@router.get("", response_model=PatternsSummary)
def get_patterns(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatternsSummary:
    top_causes = [
        CausePatternSchema(cause=p.cause, count=p.count, avg_impact=p.avg_impact)
        for p in db.query(CausePattern).all()
    ]
    matrix_rows = db.query(ServiceCauseMatrix).all()
    matrix_causes = sorted({row.cause for row in matrix_rows})
    service_map: dict[str, dict[str, int]] = {}
    for row in matrix_rows:
        service_map.setdefault(row.service, {})[row.cause] = row.count

    service_cause_matrix = [
        ServiceCauseMatrixRow(service=service, causes=causes)
        for service, causes in service_map.items()
    ]

    repeat_rate_trend = [
        RepeatRateTrendSchema(date=r.date, repeat_rate=r.repeat_rate)
        for r in db.query(RepeatRateTrend).all()
    ]

    return PatternsSummary(
        top_causes=top_causes,
        matrix_causes=matrix_causes,
        service_cause_matrix=service_cause_matrix,
        repeat_rate_trend=repeat_rate_trend,
    )

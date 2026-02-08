from pydantic import BaseModel


class CausePattern(BaseModel):
    cause: str
    count: int
    avg_impact: str


class ServiceCauseMatrixRow(BaseModel):
    service: str
    causes: dict[str, int]


class RepeatRateTrend(BaseModel):
    date: str
    repeat_rate: int


class PatternsSummary(BaseModel):
    top_causes: list[CausePattern]
    matrix_causes: list[str]
    service_cause_matrix: list[ServiceCauseMatrixRow]
    repeat_rate_trend: list[RepeatRateTrend]

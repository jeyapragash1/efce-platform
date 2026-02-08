from pydantic import BaseModel


class DailyMetric(BaseModel):
    date: str
    incidents: int
    mttr: int

    class Config:
        from_attributes = True

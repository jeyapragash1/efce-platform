from datetime import datetime
from pydantic import BaseModel


class IncidentBase(BaseModel):
    title: str
    service: str
    severity: str
    status: str
    started_at: datetime
    duration_min: int


class IncidentCreate(IncidentBase):
    id: str


class Incident(IncidentBase):
    id: str

    class Config:
        from_attributes = True

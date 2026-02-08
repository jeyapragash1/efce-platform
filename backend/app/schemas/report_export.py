from datetime import datetime
from pydantic import BaseModel


class ReportExport(BaseModel):
    id: int
    incident_id: str
    created_at: datetime

    class Config:
        from_attributes = True

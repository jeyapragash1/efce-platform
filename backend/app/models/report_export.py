from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.db.base import Base


class ReportExport(Base):
    __tablename__ = "report_exports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    incident_id = Column(String(40), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

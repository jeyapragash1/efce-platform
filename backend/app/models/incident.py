from sqlalchemy import Column, DateTime, Integer, String

from app.db.base import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(40), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    service = Column(String(120), nullable=False)
    severity = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=False)
    duration_min = Column(Integer, nullable=False)

from sqlalchemy import Column, Integer, String

from app.db.base import Base


class DailyMetric(Base):
    __tablename__ = "daily_metrics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), nullable=False)
    incidents = Column(Integer, nullable=False)
    mttr = Column(Integer, nullable=False)

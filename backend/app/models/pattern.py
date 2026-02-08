from sqlalchemy import Column, Integer, String

from app.db.base import Base


class CausePattern(Base):
    __tablename__ = "cause_patterns"

    id = Column(Integer, primary_key=True, index=True)
    cause = Column(String(255), nullable=False)
    count = Column(Integer, nullable=False)
    avg_impact = Column(String(20), nullable=False)


class ServiceCauseMatrix(Base):
    __tablename__ = "service_cause_matrix"

    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(120), nullable=False)
    cause = Column(String(255), nullable=False)
    count = Column(Integer, nullable=False)


class RepeatRateTrend(Base):
    __tablename__ = "repeat_rate_trend"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(20), nullable=False)
    repeat_rate = Column(Integer, nullable=False)

from sqlalchemy import Column, DateTime, Integer, JSON, String
from sqlalchemy.sql import func

from app.db.base import Base


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    state = Column(JSON, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

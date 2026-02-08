from sqlalchemy import Column, DateTime, Integer, JSON
from sqlalchemy.sql import func

from app.db.base import Base


class GraphStudioState(Base):
    __tablename__ = "graph_studio_state"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    nodes = Column(JSON, nullable=False)
    edges = Column(JSON, nullable=False)
    evidence = Column(JSON, nullable=False)
    versions = Column(JSON, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

from sqlalchemy import Column, Integer, JSON, String

from app.db.base import Base


class CausalGraph(Base):
    __tablename__ = "causal_graphs"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(40), index=True, nullable=False)
    nodes = Column(JSON, nullable=False)
    edges = Column(JSON, nullable=False)

from sqlalchemy import Column, Integer, JSON, String

from app.db.base import Base


class AttributionBundle(Base):
    __tablename__ = "analysis_attributions"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(40), index=True, nullable=False)
    items = Column(JSON, nullable=False)


class CounterfactualBundle(Base):
    __tablename__ = "analysis_counterfactuals"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(40), index=True, nullable=False)
    items = Column(JSON, nullable=False)

from sqlalchemy import Column, JSON, String

from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(40), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    date = Column(String(20), nullable=False)
    tags = Column(JSON, nullable=False)

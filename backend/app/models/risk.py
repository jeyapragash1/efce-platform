from sqlalchemy import Column, String

from app.db.base import Base


class Risk(Base):
    __tablename__ = "risks"

    id = Column(String(40), primary_key=True, index=True)
    risk = Column(String(255), nullable=False)
    owner = Column(String(120), nullable=False)
    level = Column(String(20), nullable=False)
    status = Column(String(30), nullable=False)

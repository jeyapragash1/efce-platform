from sqlalchemy import Column, Integer, String

from app.db.base import Base


class Control(Base):
    __tablename__ = "controls"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(120), nullable=False)

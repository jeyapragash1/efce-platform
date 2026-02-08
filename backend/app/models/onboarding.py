from sqlalchemy import Boolean, Column, DateTime, Integer
from sqlalchemy.sql import func

from app.db.base import Base


class OnboardingState(Base):
    __tablename__ = "onboarding_state"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    step = Column(Integer, nullable=False, default=0)
    dismissed = Column(Boolean, nullable=False, default=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

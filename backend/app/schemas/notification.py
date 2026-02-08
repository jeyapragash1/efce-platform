from datetime import datetime
from pydantic import BaseModel


class NotificationCreate(BaseModel):
    message: str
    type: str | None = None


class Notification(BaseModel):
    id: int
    message: str
    type: str | None = None
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True

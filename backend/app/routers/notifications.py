from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import Notification as NotificationSchema
from app.schemas.notification import NotificationCreate

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationSchema])
def list_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[NotificationSchema]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .all()
    )


@router.post("", response_model=NotificationSchema, status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationSchema:
    notification = Notification(
        user_id=current_user.id,
        message=payload.message,
        type=payload.type,
        read=False,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.patch("/{notification_id}/read", response_model=NotificationSchema)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationSchema:
    notification = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.id == notification_id)
        .first()
    )
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/read-all", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    db.query(Notification).filter(Notification.user_id == current_user.id).update({"read": True})
    db.commit()


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    notification = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.id == notification_id)
        .first()
    )
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    db.delete(notification)
    db.commit()

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.user import UserProfile, UserProfileUpdate

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=UserProfile)
def get_profile(
    current_user: User = Depends(get_current_user),
) -> UserProfile:
    user = current_user
    return UserProfile(
        name=user.name,
        email=user.email,
        org=user.org,
        avatar_url=user.avatar_url,
    )


@router.put("", response_model=UserProfile)
def update_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserProfile:
    user = current_user
    if payload.name is not None:
        user.name = payload.name
    if payload.org is not None:
        user.org = payload.org
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(user)
    return UserProfile(
        name=user.name,
        email=user.email,
        org=user.org,
        avatar_url=user.avatar_url,
    )

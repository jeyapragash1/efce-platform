from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.onboarding import OnboardingState
from app.models.user import User
from app.schemas.onboarding import OnboardingState as OnboardingStateSchema
from app.schemas.onboarding import OnboardingUpdate

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.get("", response_model=OnboardingStateSchema)
def get_state(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingStateSchema:
    state = db.query(OnboardingState).filter(OnboardingState.user_id == current_user.id).first()
    if not state:
        state = OnboardingState(user_id=current_user.id, step=0, dismissed=False)
        db.add(state)
        db.commit()
        db.refresh(state)
    return OnboardingStateSchema(step=state.step, dismissed=state.dismissed)


@router.put("", response_model=OnboardingStateSchema)
def update_state(
    payload: OnboardingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingStateSchema:
    state = db.query(OnboardingState).filter(OnboardingState.user_id == current_user.id).first()
    if not state:
        state = OnboardingState(user_id=current_user.id, step=0, dismissed=False)
        db.add(state)
    if payload.step is not None:
        state.step = payload.step
    if payload.dismissed is not None:
        state.dismissed = payload.dismissed
    db.commit()
    db.refresh(state)
    return OnboardingStateSchema(step=state.step, dismissed=state.dismissed)

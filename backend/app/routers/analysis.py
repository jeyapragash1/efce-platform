from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.analysis import AttributionBundle, CounterfactualBundle

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/attribution/{incident_id}")
def get_attribution(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    bundle = db.query(AttributionBundle).filter(AttributionBundle.incident_id == incident_id).first()
    if not bundle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attribution not found")
    return bundle.items


@router.get("/counterfactuals/{incident_id}")
def get_counterfactuals(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[dict]:
    bundle = db.query(CounterfactualBundle).filter(CounterfactualBundle.incident_id == incident_id).first()
    if not bundle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Counterfactuals not found")
    return bundle.items

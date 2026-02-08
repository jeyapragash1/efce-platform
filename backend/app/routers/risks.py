from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.risk import Risk
from app.schemas.risk import Risk as RiskSchema
from app.schemas.risk import RiskCreate

router = APIRouter(prefix="/risks", tags=["risks"])


@router.get("", response_model=list[RiskSchema])
def list_risks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[RiskSchema]:
    return db.query(Risk).order_by(Risk.id.asc()).all()


@router.post("", response_model=RiskSchema, status_code=status.HTTP_201_CREATED)
def create_risk(
    payload: RiskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RiskSchema:
    if db.query(Risk).filter(Risk.id == payload.id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Risk ID exists")
    risk = Risk(
        id=payload.id,
        risk=payload.risk,
        owner=payload.owner,
        level=payload.level,
        status=payload.status,
    )
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk

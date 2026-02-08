from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.control import Control
from app.schemas.control import Control as ControlSchema

router = APIRouter(prefix="/controls", tags=["controls"])


@router.get("", response_model=list[ControlSchema])
def list_controls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ControlSchema]:
    return db.query(Control).order_by(Control.name.asc()).all()

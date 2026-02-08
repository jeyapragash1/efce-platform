from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.incident import Incident
from app.schemas.incident import Incident as IncidentSchema
from app.schemas.incident import IncidentCreate

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("", response_model=list[IncidentSchema])
def list_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[IncidentSchema]:
    return db.query(Incident).order_by(Incident.started_at.desc()).all()


@router.get("/search", response_model=list[IncidentSchema])
def search_incidents(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[IncidentSchema]:
    query = f"%{q}%"
    return (
        db.query(Incident)
        .filter(
            or_(
                Incident.id.ilike(query),
                Incident.title.ilike(query),
                Incident.service.ilike(query),
            )
        )
        .order_by(Incident.started_at.desc())
        .all()
    )


@router.get("/{incident_id}", response_model=IncidentSchema)
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IncidentSchema:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")
    return incident


@router.post("", response_model=IncidentSchema, status_code=status.HTTP_201_CREATED)
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IncidentSchema:
    if db.query(Incident).filter(Incident.id == payload.id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incident ID exists")
    incident = Incident(
        id=payload.id,
        title=payload.title,
        service=payload.service,
        severity=payload.severity,
        status=payload.status,
        started_at=payload.started_at,
        duration_min=payload.duration_min,
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

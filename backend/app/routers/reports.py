from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.models.report import Report
from app.models.report_export import ReportExport
from app.schemas.report import Report as ReportSchema
from app.schemas.report import ReportCreate
from app.schemas.report_export import ReportExport as ReportExportSchema

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportSchema])
def list_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ReportSchema]:
    return db.query(Report).order_by(Report.date.desc()).all()


@router.post("", response_model=ReportSchema, status_code=status.HTTP_201_CREATED)
def create_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReportSchema:
    if db.query(Report).filter(Report.id == payload.id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Report ID exists")
    report = Report(
        id=payload.id,
        title=payload.title,
        type=payload.type,
        date=payload.date,
        tags=payload.tags,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.post("/incident/{incident_id}/export", response_model=ReportExportSchema, status_code=status.HTTP_201_CREATED)
def export_incident_report(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ReportExportSchema:
    export = ReportExport(user_id=current_user.id, incident_id=incident_id)
    db.add(export)
    db.commit()
    db.refresh(export)
    return export

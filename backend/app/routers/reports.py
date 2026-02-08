from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.models.report import Report
from app.schemas.report import Report as ReportSchema
from app.schemas.report import ReportCreate

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportSchema])
def list_reports(db: Session = Depends(get_db)) -> list[ReportSchema]:
    return db.query(Report).order_by(Report.date.desc()).all()


@router.post("", response_model=ReportSchema, status_code=status.HTTP_201_CREATED)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)) -> ReportSchema:
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

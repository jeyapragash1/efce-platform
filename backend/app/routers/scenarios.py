from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.scenario import Scenario
from app.models.user import User
from app.schemas.scenario import Scenario as ScenarioSchema
from app.schemas.scenario import ScenarioCreate, ScenarioUpdate

router = APIRouter(prefix="/scenarios", tags=["scenarios"])


@router.get("", response_model=list[ScenarioSchema])
def list_scenarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ScenarioSchema]:
    return (
        db.query(Scenario)
        .filter(Scenario.user_id == current_user.id)
        .order_by(Scenario.updated_at.desc())
        .all()
    )


@router.post("", response_model=ScenarioSchema, status_code=status.HTTP_201_CREATED)
def create_scenario(
    payload: ScenarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ScenarioSchema:
    scenario = Scenario(
        id=f"scn-{current_user.id}-{payload.name.lower().replace(' ', '-')}",
        user_id=current_user.id,
        name=payload.name,
        state=payload.state.model_dump(),
    )
    existing = (
        db.query(Scenario)
        .filter(Scenario.user_id == current_user.id, Scenario.id == scenario.id)
        .first()
    )
    if existing:
        existing.name = scenario.name
        existing.state = scenario.state
        db.commit()
        db.refresh(existing)
        return existing
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return scenario


@router.put("/{scenario_id}", response_model=ScenarioSchema)
def update_scenario(
    scenario_id: str,
    payload: ScenarioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ScenarioSchema:
    scenario = (
        db.query(Scenario)
        .filter(Scenario.user_id == current_user.id, Scenario.id == scenario_id)
        .first()
    )
    if not scenario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")
    if payload.name is not None:
        scenario.name = payload.name
    if payload.state is not None:
        scenario.state = payload.state.model_dump()
    db.commit()
    db.refresh(scenario)
    return scenario


@router.delete("/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scenario(
    scenario_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    scenario = (
        db.query(Scenario)
        .filter(Scenario.user_id == current_user.id, Scenario.id == scenario_id)
        .first()
    )
    if not scenario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scenario not found")
    db.delete(scenario)
    db.commit()

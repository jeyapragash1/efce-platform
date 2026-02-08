from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.graph_studio import GraphStudioState
from app.models.user import User
from app.schemas.graph_studio import GraphStudioState as GraphStudioSchema

router = APIRouter(prefix="/graphs", tags=["graphs"])


@router.get("/studio", response_model=GraphStudioSchema)
def get_studio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GraphStudioSchema:
    state = (
        db.query(GraphStudioState)
        .filter(GraphStudioState.user_id == current_user.id)
        .first()
    )
    if not state:
        state = GraphStudioState(user_id=current_user.id, nodes=[], edges=[], evidence=[], versions=[])
        db.add(state)
        db.commit()
        db.refresh(state)
    return GraphStudioSchema(
        nodes=state.nodes,
        edges=state.edges,
        evidence=state.evidence,
        versions=state.versions,
    )


@router.put("/studio", response_model=GraphStudioSchema)
def update_studio(
    payload: GraphStudioSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GraphStudioSchema:
    state = (
        db.query(GraphStudioState)
        .filter(GraphStudioState.user_id == current_user.id)
        .first()
    )
    if not state:
        state = GraphStudioState(user_id=current_user.id, nodes=[], edges=[], evidence=[], versions=[])
        db.add(state)
    state.nodes = payload.nodes
    state.edges = payload.edges
    state.evidence = payload.evidence
    state.versions = payload.versions
    db.commit()
    db.refresh(state)
    return GraphStudioSchema(
        nodes=state.nodes,
        edges=state.edges,
        evidence=state.evidence,
        versions=state.versions,
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.models.graph import CausalGraph
from app.schemas.graph import CausalGraph as CausalGraphSchema

router = APIRouter(prefix="/graphs", tags=["graphs"])


@router.get("/causal/{incident_id}", response_model=CausalGraphSchema)
def get_graph(incident_id: str, db: Session = Depends(get_db)) -> CausalGraphSchema:
    graph = db.query(CausalGraph).filter(CausalGraph.incident_id == incident_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    return CausalGraphSchema(nodes=graph.nodes, edges=graph.edges)

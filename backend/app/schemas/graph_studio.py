from pydantic import BaseModel


class GraphStudioState(BaseModel):
    nodes: list[dict]
    edges: list[dict]
    evidence: list[dict]
    versions: list[dict]

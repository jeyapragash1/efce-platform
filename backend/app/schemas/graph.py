from pydantic import BaseModel


class CausalGraph(BaseModel):
    nodes: list[dict]
    edges: list[dict]

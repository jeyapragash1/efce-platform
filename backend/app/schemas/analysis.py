from pydantic import BaseModel


class AttributionItem(BaseModel):
    factor: str
    contribution: int
    type: str


class CounterfactualItem(BaseModel):
    id: str
    label: str
    delta: int

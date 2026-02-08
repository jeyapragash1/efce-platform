from datetime import datetime
from pydantic import BaseModel


class ScenarioState(BaseModel):
    enabled: dict[str, bool]
    strength: dict[str, int]


class Scenario(BaseModel):
    id: str
    name: str
    updated_at: datetime
    state: ScenarioState

    class Config:
        from_attributes = True


class ScenarioCreate(BaseModel):
    name: str
    state: ScenarioState


class ScenarioUpdate(BaseModel):
    name: str | None = None
    state: ScenarioState | None = None

from pydantic import BaseModel


class RiskBase(BaseModel):
    risk: str
    owner: str
    level: str
    status: str


class RiskCreate(RiskBase):
    id: str


class Risk(RiskBase):
    id: str

    class Config:
        from_attributes = True

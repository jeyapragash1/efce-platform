from pydantic import BaseModel


class ReportBase(BaseModel):
    title: str
    type: str
    date: str
    tags: list[str]


class ReportCreate(ReportBase):
    id: str


class Report(ReportBase):
    id: str

    class Config:
        from_attributes = True

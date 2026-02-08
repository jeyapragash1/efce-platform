from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    name: str
    email: str
    org: str | None = None
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

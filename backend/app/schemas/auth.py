from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    org: str | None = None
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

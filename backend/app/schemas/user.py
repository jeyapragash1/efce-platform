from pydantic import BaseModel, EmailStr


class UserProfile(BaseModel):
    name: str
    email: EmailStr
    org: str | None = None
    avatar_url: str | None = None


class UserProfileUpdate(BaseModel):
    name: str | None = None
    org: str | None = None
    avatar_url: str | None = None

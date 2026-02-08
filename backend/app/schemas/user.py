from pydantic import BaseModel


class UserProfile(BaseModel):
    name: str
    email: str
    org: str | None = None
    avatar_url: str | None = None


class UserProfileUpdate(BaseModel):
    name: str | None = None
    org: str | None = None
    avatar_url: str | None = None

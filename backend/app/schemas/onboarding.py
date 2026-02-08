from pydantic import BaseModel


class OnboardingState(BaseModel):
    step: int
    dismissed: bool


class OnboardingUpdate(BaseModel):
    step: int | None = None
    dismissed: bool | None = None

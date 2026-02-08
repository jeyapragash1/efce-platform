from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: str = "local"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    database_url: str = "sqlite:///./efce.db"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:3000,http://localhost:6006"

    class Config:
        env_file = ".env"


settings = Settings()

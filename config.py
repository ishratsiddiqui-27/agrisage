from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Backend settings loaded from environment variables."""

    supabase_url: str = ""
    supabase_secret_key: str = ""
    frontend_url: str = "http://localhost:5173"

    openai_api_key: str = ""
    gemini_api_key: str = ""
    llm_provider: str = "openai"
    stt_provider: str = "openai"
    agent_timeout_seconds: float = 12.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

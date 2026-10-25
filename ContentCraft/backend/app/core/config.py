from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

_backend_dir = Path(__file__).resolve().parent.parent.parent
_project_dir = _backend_dir.parent
_env_files = [
    str(_project_dir / ".env"),
    str(_backend_dir / ".env"),
    ".env",
    "../.env",
]


class Settings(BaseSettings):
    APP_NAME: str = "ContentCraft"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "change-this-local-secret"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    UPLOAD_DIR: str = "uploads"

    # SQL Server parameters
    DB_SERVER: str = r".\SQLEXPRESS02"
    DB_NAME: str = "ContentCraftDB"
    DB_DRIVER: str = "ODBC Driver 18 for SQL Server"
    DB_TRUST_SERVER_CERTIFICATE: str = "yes"

    # Optional generic database URL (for Postgres/SQLite/Docker or Alembic)
    DATABASE_URL: str | None = None

    # Real Social Media Publishing API & Webhook Settings
    FACEBOOK_PAGE_ID: str | None = None
    FACEBOOK_PAGE_ACCESS_TOKEN: str | None = None
    PUBLISHING_WEBHOOK_URL: str | None = None

    # AI Configuration (OpenAI & Gemini)
    AI_PROVIDER: str = "gemini"
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.5-flash"

    model_config = SettingsConfigDict(
        env_file=_env_files,
        extra="ignore",
    )

    def get_connection_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        connection_string = (
            f"DRIVER={{{self.DB_DRIVER}}};"
            f"SERVER={self.DB_SERVER};"
            f"DATABASE={self.DB_NAME};"
            "Trusted_Connection=yes;"
            "Encrypt=yes;"
            f"TrustServerCertificate={self.DB_TRUST_SERVER_CERTIFICATE};"
            "Pooling=False;"
        )
        from urllib.parse import quote_plus
        return f"mssql+pyodbc:///?odbc_connect={quote_plus(connection_string)}"


settings = Settings()

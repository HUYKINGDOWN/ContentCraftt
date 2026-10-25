import warnings
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.exc import SAWarning
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# Filter out SQL Server 2025/v17 unrecognized version warning
warnings.filterwarnings("ignore", category=SAWarning, message=".*Unrecognized server version info.*")

if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
else:
    connection_string = (
        f"DRIVER={{{settings.DB_DRIVER}}};"
        f"SERVER={settings.DB_SERVER};"
        f"DATABASE={settings.DB_NAME};"
        "Trusted_Connection=yes;"
        "Encrypt=yes;"
        f"TrustServerCertificate={settings.DB_TRUST_SERVER_CERTIFICATE};"
        "Pooling=False;"
    )
    connection_url = URL.create(
        "mssql+pyodbc",
        query={"odbc_connect": connection_string},
    )
    engine = create_engine(
        connection_url,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

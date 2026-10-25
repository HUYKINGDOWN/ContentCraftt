from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Unicode, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class User(Base):
    __tablename__ = "Users"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "user_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    full_name: Mapped[str] = mapped_column(
        Unicode(100),
        nullable=False,
    )
    google_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="BrandOwner",
        server_default=text("'BrandOwner'"),
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Active",
        server_default=text("'Active'"),
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "role" not in kwargs or not kwargs["role"]:
            kwargs["role"] = "BrandOwner"
        if "status" not in kwargs or not kwargs["status"]:
            kwargs["status"] = "Active"
        super().__init__(**kwargs)

    @property
    def user_id(self) -> int:
        return self.id

from datetime import datetime
from sqlalchemy import DateTime, Integer, String, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "SystemLogs"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "log_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    action_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    tokens_used: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default=text("((0))"),
    )
    ip_address: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    details: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "action_type" not in kwargs and "action" in kwargs:
            kwargs["action_type"] = kwargs["action"]
        if "tokens_used" not in kwargs or kwargs["tokens_used"] is None:
            kwargs["tokens_used"] = 0
        super().__init__(**kwargs)

    @property
    def log_id(self) -> int:
        return self.id

    @property
    def action(self) -> str:
        return self.action_type

    @action.setter
    def action(self, value: str):
        self.action_type = value

    @property
    def entity_type(self) -> str:
        return "general"

    @property
    def entity_id(self) -> int | None:
        return None

from datetime import datetime
from sqlalchemy import DateTime, Integer, String, Unicode, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ContentRule(Base):
    __tablename__ = "ContentRules"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "rule_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    brand_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    category: Mapped[str | None] = mapped_column(
        Unicode(100),
        nullable=True,
    )
    restricted_words: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    warnings: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    language_preference: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="VI",
        server_default=text("('VI')"),
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
        if "brand_id" not in kwargs or kwargs["brand_id"] is None:
            kwargs["brand_id"] = 1
        if "language_preference" not in kwargs or not kwargs["language_preference"]:
            kwargs["language_preference"] = "VI"
        if not kwargs.get("category") and kwargs.get("name"):
            kwargs["category"] = kwargs.get("name")
        if not kwargs.get("restricted_words") and kwargs.get("rules"):
            kwargs["restricted_words"] = kwargs.get("rules")
        super().__init__(**kwargs)

    @property
    def rule_id(self) -> int:
        return self.id

    @property
    def name(self) -> str:
        return self.category or "General Rule"

    @name.setter
    def name(self, value: str):
        self.category = value

    @property
    def rules(self) -> str:
        return self.restricted_words or ""

    @rules.setter
    def rules(self, value: str):
        self.restricted_words = value

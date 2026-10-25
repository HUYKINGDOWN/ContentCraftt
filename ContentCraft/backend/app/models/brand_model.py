from datetime import datetime
from sqlalchemy import DateTime, Integer, Unicode, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Brand(Base):
    __tablename__ = "BrandProfiles"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "brand_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    name: Mapped[str] = mapped_column(
        "brand_name",
        Unicode(150),
        nullable=False,
    )
    industry: Mapped[str | None] = mapped_column(
        Unicode(100),
        nullable=True,
    )
    core_values: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    brand_voice: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    communication_style: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    marketing_preferences: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
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
        if "user_id" not in kwargs or kwargs["user_id"] is None:
            kwargs["user_id"] = 1
        if not kwargs.get("brand_voice") and kwargs.get("tone"):
            kwargs["brand_voice"] = kwargs.get("tone")
        if not kwargs.get("marketing_preferences") and kwargs.get("description"):
            kwargs["marketing_preferences"] = kwargs.get("description")
        super().__init__(**kwargs)

    @property
    def brand_id(self) -> int:
        return self.id

    @property
    def brand_name(self) -> str:
        return self.name

    @brand_name.setter
    def brand_name(self, value: str):
        self.name = value

    @property
    def tone(self) -> str:
        return self.brand_voice or "friendly"

    @tone.setter
    def tone(self, value: str):
        self.brand_voice = value

    @property
    def description(self) -> str:
        return self.marketing_preferences or self.core_values or ""

    @description.setter
    def description(self, value: str):
        self.marketing_preferences = value

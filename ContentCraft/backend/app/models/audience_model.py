from datetime import datetime
from sqlalchemy import DateTime, Integer, Unicode, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Audience(Base):
    __tablename__ = "TargetCustomers"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "target_customer_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    brand_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    name: Mapped[str] = mapped_column(
        "segment_name",
        Unicode(150),
        nullable=False,
    )
    age_min: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    age_max: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    gender: Mapped[str] = mapped_column(
        Unicode(20),
        nullable=False,
        default="All",
        server_default=text("('All')"),
    )
    interests: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    behaviors: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    notes: Mapped[str | None] = mapped_column(
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
        if "brand_id" not in kwargs or kwargs["brand_id"] is None:
            kwargs["brand_id"] = 1
        if "gender" not in kwargs or not kwargs["gender"]:
            kwargs["gender"] = "All"
        if not kwargs.get("notes") and kwargs.get("description"):
            kwargs["notes"] = kwargs.get("description")
        if not kwargs.get("segment_name") and kwargs.get("name"):
            kwargs["segment_name"] = kwargs.get("name")
        super().__init__(**kwargs)

    @property
    def target_customer_id(self) -> int:
        return self.id

    @property
    def segment_name(self) -> str:
        return self.name

    @segment_name.setter
    def segment_name(self, value: str):
        self.name = value

    @property
    def description(self) -> str:
        return self.notes or self.interests or ""

    @description.setter
    def description(self, value: str):
        self.notes = value

    @property
    def platform(self) -> str:
        return "general"

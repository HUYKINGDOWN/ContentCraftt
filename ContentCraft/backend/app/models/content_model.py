from datetime import datetime
from sqlalchemy import DateTime, Integer, String, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Content(Base):
    __tablename__ = "GeneratedContents"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "content_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    brand_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    product_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    target_customer_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    rule_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )
    target_platform: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Facebook",
    )
    content_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Caption",
    )
    language_preference: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="VI",
        server_default=text("('VI')"),
    )
    prompt_used: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    generated_text: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    generated_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Draft",
        server_default=text("('Draft')"),
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
        if "content_type" not in kwargs or not kwargs["content_type"]:
            kwargs["content_type"] = "Caption"
        if not kwargs.get("target_platform"):
            kwargs["target_platform"] = kwargs.get("platform", "Facebook")
        if "language_preference" not in kwargs or not kwargs["language_preference"]:
            kwargs["language_preference"] = "VI"
        if "status" not in kwargs or not kwargs["status"]:
            kwargs["status"] = "Draft"
        if not kwargs.get("prompt_used") and kwargs.get("title"):
            kwargs["prompt_used"] = kwargs.get("title")
        if not kwargs.get("generated_text") and kwargs.get("body"):
            kwargs["generated_text"] = kwargs.get("body")
        if not kwargs.get("generated_image_url") and kwargs.get("image"):
            kwargs["generated_image_url"] = kwargs.get("image")
        super().__init__(**kwargs)

    @property
    def content_id(self) -> int:
        return self.id

    @property
    def title(self) -> str:
        return self.prompt_used or "Bản nháp nội dung"

    @title.setter
    def title(self, value: str):
        self.prompt_used = value

    @property
    def body(self) -> str:
        return self.generated_text or ""

    @body.setter
    def body(self, value: str):
        self.generated_text = value

    @property
    def platform(self) -> str:
        return self.target_platform

    @platform.setter
    def platform(self, value: str):
        self.target_platform = value

    @property
    def image(self) -> str | None:
        return self.generated_image_url

    @image.setter
    def image(self, value: str | None):
        self.generated_image_url = value

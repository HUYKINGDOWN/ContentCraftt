from datetime import datetime
from sqlalchemy import DateTime, Integer, Unicode, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ContentVersion(Base):
    __tablename__ = "ContentVersions"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "version_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    content_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    version_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    content_text: Mapped[str] = mapped_column(
        UnicodeText,
        nullable=False,
    )
    edited_by_user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    change_summary: Mapped[str | None] = mapped_column(
        Unicode(255),
        nullable=True,
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "edited_by_user_id" not in kwargs or kwargs["edited_by_user_id"] is None:
            kwargs["edited_by_user_id"] = 1
        if "version_number" not in kwargs or kwargs["version_number"] is None:
            kwargs["version_number"] = 1
        if "content_text" not in kwargs and "body" in kwargs:
            kwargs["content_text"] = kwargs["body"]
        super().__init__(**kwargs)

    @property
    def version_id(self) -> int:
        return self.id

    @property
    def body(self) -> str:
        return self.content_text

    @body.setter
    def body(self, value: str):
        self.content_text = value

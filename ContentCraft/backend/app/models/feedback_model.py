from datetime import datetime
from sqlalchemy import DateTime, Integer, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Feedback(Base):
    __tablename__ = "UserFeedbacks"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "feedback_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    content_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=5,
    )
    feedback_notes: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "content_id" not in kwargs or kwargs["content_id"] is None:
            kwargs["content_id"] = 1
        if "rating" not in kwargs or kwargs["rating"] is None:
            kwargs["rating"] = 5
        if not kwargs.get("feedback_notes") and kwargs.get("comment"):
            kwargs["feedback_notes"] = kwargs.get("comment")
        super().__init__(**kwargs)

    @property
    def feedback_id(self) -> int:
        return self.id

    @property
    def comment(self) -> str:
        return self.feedback_notes or ""

    @comment.setter
    def comment(self, value: str):
        self.feedback_notes = value

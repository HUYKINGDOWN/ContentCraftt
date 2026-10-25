from datetime import datetime
from sqlalchemy import DateTime, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "PostPerformanceLogs"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "log_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    content_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    post_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    reach_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default=text("((0))"),
    )
    engagement_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default=text("((0))"),
    )
    click_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default=text("((0))"),
    )
    logged_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "content_id" not in kwargs or kwargs["content_id"] is None:
            kwargs["content_id"] = 1
        if "reach_count" not in kwargs or kwargs["reach_count"] is None:
            kwargs["reach_count"] = 0
        if "engagement_count" not in kwargs or kwargs["engagement_count"] is None:
            kwargs["engagement_count"] = kwargs.get("value", 0)
        if "click_count" not in kwargs or kwargs["click_count"] is None:
            kwargs["click_count"] = 0
        super().__init__(**kwargs)

    @property
    def log_id(self) -> int:
        return self.id

    @property
    def event_name(self) -> str:
        return "engagement"

    @property
    def value(self) -> int:
        return self.engagement_count

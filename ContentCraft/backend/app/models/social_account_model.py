from datetime import datetime
from sqlalchemy import DateTime, Integer, String, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class SocialAccount(Base):
    __tablename__ = "SocialIntegrations"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "integration_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    brand_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    platform_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    access_token: Mapped[str] = mapped_column(
        UnicodeText,
        nullable=False,
        default="mock_token",
    )
    refresh_token: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    token_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Connected",
        server_default=text("('Connected')"),
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "brand_id" not in kwargs or kwargs["brand_id"] is None:
            kwargs["brand_id"] = 1
        if "access_token" not in kwargs or not kwargs["access_token"]:
            kwargs["access_token"] = "mock_token"
        if "status" not in kwargs or not kwargs["status"]:
            kwargs["status"] = "Connected"
        if "platform_name" not in kwargs:
            kwargs["platform_name"] = kwargs.get("platform", kwargs.get("account_name", "Facebook"))
        super().__init__(**kwargs)

    @property
    def integration_id(self) -> int:
        return self.id

    @property
    def platform(self) -> str:
        return self.platform_name

    @platform.setter
    def platform(self, value: str):
        self.platform_name = value

    @property
    def account_name(self) -> str:
        return self.platform_name

    @account_name.setter
    def account_name(self, value: str):
        self.platform_name = value

    @property
    def connected(self) -> bool:
        return self.status == "Connected"

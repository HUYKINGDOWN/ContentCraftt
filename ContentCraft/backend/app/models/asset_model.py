from datetime import datetime
from sqlalchemy import DateTime, Integer, String, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Asset(Base):
    __tablename__ = "ProductAssets"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "asset_id",
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    product_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
    file_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    file_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="image/jpeg",
    )
    extracted_tags: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    color_palette: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    created_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=False,
        server_default=text("GETDATE()"),
    )

    def __init__(self, **kwargs):
        if "product_id" not in kwargs or kwargs["product_id"] is None:
            kwargs["product_id"] = 1
        if not kwargs.get("file_url") and kwargs.get("url"):
            kwargs["file_url"] = kwargs.get("url")
        if not kwargs.get("file_type") and kwargs.get("kind"):
            kwargs["file_type"] = kwargs.get("kind")
        if not kwargs.get("file_url"):
            kwargs["file_url"] = f"https://example.com/assets/{kwargs.get('name', 'asset.jpg')}"
        if not kwargs.get("file_type"):
            kwargs["file_type"] = "image/jpeg"
        super().__init__(**kwargs)

    @property
    def asset_id(self) -> int:
        return self.id

    @property
    def url(self) -> str:
        return self.file_url

    @url.setter
    def url(self, value: str):
        self.file_url = value

    @property
    def kind(self) -> str:
        return self.file_type

    @kind.setter
    def kind(self, value: str):
        self.file_type = value

    @property
    def name(self) -> str:
        return self.file_url.split("/")[-1] if self.file_url else "asset"

    @name.setter
    def name(self, value: str):
        pass

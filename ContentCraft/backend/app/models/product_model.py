from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, Unicode, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Product(Base):
    __tablename__ = "Products"
    __table_args__ = {"schema": "dbo"}

    id: Mapped[int] = mapped_column(
        "product_id",
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
        "product_name",
        Unicode(200),
        nullable=False,
    )
    category_name: Mapped[str | None] = mapped_column(
        Unicode(100),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    usp: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    key_features: Mapped[str | None] = mapped_column(
        UnicodeText,
        nullable=True,
    )
    status: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("1"),
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
        if "status" not in kwargs or kwargs["status"] is None:
            kwargs["status"] = True
        super().__init__(**kwargs)

    @property
    def product_id(self) -> int:
        return self.id

    @property
    def product_name(self) -> str:
        return self.name

    @product_name.setter
    def product_name(self, value: str):
        self.name = value

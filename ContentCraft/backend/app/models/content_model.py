from datetime import datetime
from sqlalchemy import DateTime, Integer, String, UnicodeText, text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


def normalize_content_data(data: dict) -> dict:
    data = data.copy()

    # 1. Image
    if data.get("image") and not data.get("generated_image_url"):
        data["generated_image_url"] = data.get("image")

    # 2. Normalize content_type: ('AIImage' | 'PromoIdea' | 'ProductDescription' | 'Caption')
    ct = str(data.get("content_type", "")).lower()
    if data.get("generated_image_url") or "image" in ct or "visual" in ct:
        data["content_type"] = "AIImage"
    elif "promo" in ct or "idea" in ct:
        data["content_type"] = "PromoIdea"
    elif "desc" in ct or "product" in ct:
        data["content_type"] = "ProductDescription"
    else:
        data["content_type"] = "Caption"

    # 3. Normalize status: ('Draft' | 'Reviewed' | 'Approved' | 'Published')
    st = str(data.get("status", "Draft"))
    if st.lower() in ("in review", "in_review", "review", "reviewed"):
        data["status"] = "Reviewed"
    elif st.lower() in ("approved", "approve"):
        data["status"] = "Approved"
    elif st.lower() in ("published", "publish"):
        data["status"] = "Published"
    else:
        data["status"] = "Draft"

    # 4. Normalize platform: ('Web' | 'Instagram' | 'TikTok' | 'Facebook')
    pf = str(data.get("target_platform") or data.get("platform") or "Facebook").lower()
    if "insta" in pf:
        data["target_platform"] = "Instagram"
    elif "tik" in pf:
        data["target_platform"] = "TikTok"
    elif "face" in pf:
        data["target_platform"] = "Facebook"
    else:
        data["target_platform"] = "Web"
    data.pop("platform", None)

    # 5. Normalize language: ('EN' | 'VI')
    lang = str(data.get("language_preference", "VI")).upper()
    data["language_preference"] = "EN" if "EN" in lang else "VI"

    # 6. Title and Body
    if not data.get("prompt_used") and data.get("title"):
        data["prompt_used"] = data.get("title")
    if not data.get("generated_text") and data.get("body"):
        data["generated_text"] = data.get("body")

    data.pop("title", None)
    data.pop("body", None)
    data.pop("image", None)
    return data


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
        norm = normalize_content_data(kwargs)
        super().__init__(**norm)

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

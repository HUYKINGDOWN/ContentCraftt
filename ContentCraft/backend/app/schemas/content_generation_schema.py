from typing import Optional
from pydantic import BaseModel


class ContentGenerationRequest(BaseModel):
    topic: str
    platform: str = "Facebook"
    tone: str = "friendly"
    audience: str = "general audience"
    provider: Optional[str] = None


class ContentGenerationResponse(BaseModel):
    title: str
    body: str
    platform: str
    prompt_preview: Optional[str] = None

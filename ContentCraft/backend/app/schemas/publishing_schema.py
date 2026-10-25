from pydantic import BaseModel, ConfigDict

class PublishingCreate(BaseModel):
    content_id: int
    platform: str = 'demo'

class PublishingRead(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)

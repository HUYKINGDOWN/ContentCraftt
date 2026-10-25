from pydantic import BaseModel, ConfigDict

class AdminCreate(BaseModel):
    action: str
    entity_type: str = 'general'

class AdminRead(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)

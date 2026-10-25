from pydantic import BaseModel
class ImageAnalysisRequest(BaseModel):
    image_url: str
    prompt: str = "Describe this asset"
class ImageAnalysisResponse(BaseModel):
    image_url: str
    description: str
    tags: list[str]

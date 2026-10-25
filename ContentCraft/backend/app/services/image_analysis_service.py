class ImageAnalysisService:
    def analyze(self, image_url: str, prompt: str = "Describe this asset"):
        return {"image_url": image_url, "description": f"Demo analysis for: {prompt}", "tags": ["demo", "marketing", "visual"]}

class MockVisionAdapter:
    def analyze(self, image_url: str) -> dict:
        return {"image_url": image_url, "labels": ["demo", "product", "marketing"]}

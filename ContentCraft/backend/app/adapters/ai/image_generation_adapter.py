class MockImageGenerationAdapter:
    def generate(self, prompt: str) -> dict:
        return {"prompt": prompt, "image_url": "https://placehold.co/1024x1024?text=Demo"}

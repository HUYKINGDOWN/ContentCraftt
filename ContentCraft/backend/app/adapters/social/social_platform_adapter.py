class MockSocialPlatformAdapter:
    def publish(self, platform: str, text: str) -> dict:
        return {"platform": platform, "status": "mock_published", "text": text}

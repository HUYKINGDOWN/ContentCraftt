class DemoStorageAdapter:
    def save(self, name: str, content: bytes) -> str:
        return f"local://{name}"

from abc import ABC, abstractmethod


class TextGenerationProvider(ABC):

    @abstractmethod
    def generate_text(self, prompt: str) -> str:
        raise NotImplementedError
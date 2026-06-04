"""Singleton embedding model — loaded once, shared across ingest and retrieval."""

from __future__ import annotations

import logging
from langchain_core.embeddings import Embeddings
from rag.config import GROQ_API_KEY

logger = logging.getLogger(__name__)

class GroqEmbeddings(Embeddings):
    """Custom LangChain Embeddings wrapper using Groq SDK's nomic-embed-text-v1.5."""

    def __init__(self, api_key: str, model_name: str = "nomic-embed-text-v1.5"):
        self.api_key = api_key
        self.model_name = model_name
        from groq import Groq
        self.client = Groq(api_key=api_key)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        embeddings = []
        batch_size = 16
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            response = self.client.embeddings.create(
                input=batch,
                model=self.model_name
            )
            embeddings.extend([d.embedding for d in response.data])
        return embeddings

    def embed_query(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            input=[text],
            model=self.model_name
        )
        return response.data[0].embedding


_embeddings: Embeddings | None = None


def get_embeddings() -> Embeddings:
    """Return the shared Embeddings instance."""
    global _embeddings
    if _embeddings is None:
        if GROQ_API_KEY:
            logger.info("Initializing Groq API-based Embeddings (nomic-embed-text-v1.5)")
            _embeddings = GroqEmbeddings(api_key=GROQ_API_KEY)
        else:
            logger.warning("GROQ_API_KEY not found. Attempting local HuggingFace embeddings fallback...")
            try:
                from langchain_community.embeddings import HuggingFaceEmbeddings
                from rag.config import EMBED_MODEL
                _embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
            except ImportError as exc:
                raise ImportError(
                    "GROQ_API_KEY is missing and local embeddings dependencies are not installed. "
                    "Please set GROQ_API_KEY in your environment, or run `pip install sentence-transformers torch`."
                ) from exc
    return _embeddings

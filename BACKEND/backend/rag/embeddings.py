"""Singleton embedding model — loaded once, shared across ingest and retrieval."""

from __future__ import annotations

import logging
from langchain_core.embeddings import Embeddings
from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2

logger = logging.getLogger(__name__)

class ChromaONNXEmbeddings(Embeddings):
    """Custom LangChain Embeddings wrapper using ChromaDB's built-in ONNXMiniLM_L6_V2."""

    def __init__(self) -> None:
        logger.info("Initializing lightweight Chroma ONNX embeddings (all-MiniLM-L6-v2)")
        self._ef = ONNXMiniLM_L6_V2()

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        # ONNXMiniLM_L6_V2 handles batching and returns a list of lists of floats
        return self._ef(texts)

    def embed_query(self, text: str) -> list[float]:
        # Return the embedding vector for a single query text
        return self._ef([text])[0]


_embeddings: Embeddings | None = None


def get_embeddings() -> Embeddings:
    """Return the shared Embeddings instance."""
    global _embeddings
    if _embeddings is None:
        _embeddings = ChromaONNXEmbeddings()
    return _embeddings

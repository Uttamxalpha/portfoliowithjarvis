"""ChromaDB retriever singleton for portfolio knowledge base queries."""

from __future__ import annotations

import logging

import chromadb

from rag.config import CHROMA_COLLECTION, CHROMA_PATH
from rag.embeddings import get_embeddings

logger = logging.getLogger(__name__)


class PortfolioRetriever:
    """Singleton ChromaDB retriever backed by local sentence-transformer embeddings."""

    _instance: PortfolioRetriever | None = None

    def __init__(self) -> None:
        self._embeddings = get_embeddings()
        self._client = chromadb.PersistentClient(path=CHROMA_PATH)
        self._collection = self._client.get_or_create_collection(name=CHROMA_COLLECTION)

    @classmethod
    def get_instance(cls) -> PortfolioRetriever:
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @property
    def is_ready(self) -> bool:
        try:
            return self._collection.count() > 0
        except Exception:
            return False

    def collection_count(self) -> int:
        try:
            return self._collection.count()
        except Exception:
            return 0

    def refresh(self) -> None:
        """Reload the ChromaDB collection handle after re-ingestion."""
        self._collection = self._client.get_or_create_collection(name=CHROMA_COLLECTION)

    def retrieve(self, query: str, top_k: int = 5) -> list[str]:
        """Embed the query and return the top-k most similar chunk texts."""
        if self.collection_count() == 0:
            raise RuntimeError(
                "ChromaDB collection is empty. Run: python -m rag.ingest"
            )

        query_vector = self._embeddings.embed_query(query)
        results = self._collection.query(
            query_embeddings=[query_vector],
            n_results=top_k,
        )

        documents = results.get("documents", [[]])[0]
        return [doc for doc in documents if doc]


def get_retriever() -> PortfolioRetriever:
    """Return the shared PortfolioRetriever instance."""
    return PortfolioRetriever.get_instance()

"""Singleton embedding model — loaded once, shared across ingest and retrieval."""

from __future__ import annotations

from typing import TYPE_CHECKING

from rag.config import EMBED_MODEL

if TYPE_CHECKING:
    from langchain_community.embeddings import HuggingFaceEmbeddings

_embeddings: HuggingFaceEmbeddings | None = None


def get_embeddings() -> HuggingFaceEmbeddings:
    """Return the shared HuggingFaceEmbeddings instance."""
    global _embeddings
    if _embeddings is None:
        from langchain_community.embeddings import HuggingFaceEmbeddings

        _embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    return _embeddings

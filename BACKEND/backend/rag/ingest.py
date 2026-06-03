"""Document ingestion pipeline using LangChain loaders and splitters."""

from __future__ import annotations

import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Iterator

import chromadb
from langchain_core.document_loaders import BaseLoader
from langchain_core.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from rag.config import CHROMA_COLLECTION, CHROMA_PATH, PDF_PATH, SCANNED_PDF_ERROR
from rag.embeddings import get_embeddings


class ODTLoader(BaseLoader):
    """LangChain custom document loader for ODT files."""

    def __init__(self, file_path: Path | str) -> None:
        self.file_path = Path(file_path)

    def lazy_load(self) -> Iterator[Document]:
        if not self.file_path.exists():
            raise FileNotFoundError(f"ODT file not found: {self.file_path}")

        try:
            with zipfile.ZipFile(self.file_path, 'r') as zip_ref:
                content_xml = zip_ref.read('content.xml')

            root = ET.fromstring(content_xml)
            text_elements: list[str] = []

            for elem in root.iter():
                tag = elem.tag
                if tag.endswith('}p') or tag.endswith('}h'):
                    parts = []
                    if elem.text:
                        parts.append(elem.text)
                    for child in elem:
                        if child.tail:
                            parts.append(child.tail)
                        if child.text:
                            parts.append(child.text)
                    text_content = "".join(parts).strip()
                    if text_content:
                        if tag.endswith('}h'):
                            outline_level = elem.get('{urn:oasis:names:tc:opendocument:xmlns:text:1.0}outline-level', '1')
                            level = int(outline_level) if outline_level.isdigit() else 1
                            text_elements.append(f"\n{'#' * level} {text_content}\n")
                        else:
                            text_elements.append(text_content)

            full_text = "\n".join(text_elements)
            yield Document(
                page_content=full_text,
                metadata={"source": self.file_path.name, "page": 1}
            )
        except Exception as exc:
            raise ValueError(f"Failed to parse ODT file: {exc}") from exc


def load_documents_with_langchain(kb_dir: Path) -> list[Document]:
    """Load all PDF, ODT, and DOCX documents in directory using LangChain loaders."""
    documents: list[Document] = []

    for file_path in kb_dir.iterdir():
        if file_path.name.startswith("."):
            continue

        suffix = file_path.suffix.lower()
        if suffix == ".pdf":
            loader = PyMuPDFLoader(str(file_path))
            docs = loader.load()
            for doc in docs:
                # Set metadata source to filename only for consistency
                doc.metadata["source"] = file_path.name
                if len(doc.page_content.strip()) < 20:
                    raise ValueError(SCANNED_PDF_ERROR)
            documents.extend(docs)
        elif suffix == ".docx":
            loader = Docx2txtLoader(str(file_path))
            docs = loader.load()
            for doc in docs:
                doc.metadata["source"] = file_path.name
                doc.metadata["page"] = 1
            documents.extend(docs)
        elif suffix == ".odt":
            loader = ODTLoader(file_path)
            documents.extend(loader.load())
        elif suffix == ".txt":
            from langchain_community.document_loaders import TextLoader
            loader = TextLoader(str(file_path), encoding="utf-8")
            docs = loader.load()
            for doc in docs:
                doc.metadata["source"] = file_path.name
                doc.metadata["page"] = 1
            documents.extend(docs)

    return documents


def split_documents_with_langchain(documents: list[Document]) -> list[Document]:
    """Split LangChain Document objects using RecursiveCharacterTextSplitter."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=80,
        separators=["\n\n", "\n", ". ", " "],
    )
    chunks = splitter.split_documents(documents)
    for chunk in chunks:
        chunk.page_content = f"Uttam Tiwari Portfolio Information: {chunk.page_content}"
    return chunks


def store_in_chroma(chunks: list[Document]) -> int:
    """Embed chunks and persist them in ChromaDB. Returns number of chunks stored."""
    embeddings = get_embeddings()
    client = chromadb.PersistentClient(path=CHROMA_PATH)

    try:
        client.delete_collection(CHROMA_COLLECTION)
    except ValueError:
        pass

    collection = client.get_or_create_collection(name=CHROMA_COLLECTION)

    texts = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]
    ids = [f"chunk_{index}" for index in range(len(chunks))]
    vectors = embeddings.embed_documents(texts)

    collection.add(ids=ids, documents=texts, metadatas=metadatas, embeddings=vectors)
    return collection.count()


def run_ingestion(kb_dir: Path | None = None) -> dict:
    """Run the full ingestion pipeline on the knowledge base directory and return a summary."""
    base_kb_dir = Path(kb_dir or Path(PDF_PATH).parent)
    if not base_kb_dir.exists():
        raise FileNotFoundError(f"Knowledge base directory not found: {base_kb_dir}")

    documents = load_documents_with_langchain(base_kb_dir)
    chunks = split_documents_with_langchain(documents)
    stored = store_in_chroma(chunks)

    # Calculate file details for the summary
    file_counts = {"pdf": 0, "odt": 0, "docx": 0, "txt": 0}
    for doc in documents:
        source = doc.metadata.get("source", "")
        if source.endswith(".pdf"):
            file_counts["pdf"] = file_counts.get("pdf", 0) + 1
        elif source.endswith(".odt"):
            file_counts["odt"] = file_counts.get("odt", 0) + 1
        elif source.endswith(".docx"):
            file_counts["docx"] = file_counts.get("docx", 0) + 1
        elif source.endswith(".txt"):
            file_counts["txt"] = file_counts.get("txt", 0) + 1

    return {
        "total_files": len(set(doc.metadata.get("source") for doc in documents)),
        "file_details": file_counts,
        "total_pages": len(documents),
        "total_chunks": len(chunks),
        "collection_size": stored,
    }


def main() -> None:
    """CLI entry point: python -m rag.ingest"""
    try:
        summary = run_ingestion()
        print("Ingestion complete.")
        print(f"  Total files       : {summary['total_files']} ({summary['file_details']})")
        print(f"  Total pages       : {summary['total_pages']}")
        print(f"  Total chunks      : {summary['total_chunks']}")
        print(f"  Collection size   : {summary['collection_size']}")
    except Exception as exc:
        print(f"Ingestion failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

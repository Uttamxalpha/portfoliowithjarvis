"""Centralized environment configuration for UTTAMBOT."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_CLASSIFIER_MODEL: str = os.getenv("GROQ_CLASSIFIER_MODEL", "llama-3.1-8b-instant")
EMBED_MODEL: str = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
CHROMA_PATH: str = os.getenv("CHROMA_PATH", str(BASE_DIR / "chroma_db"))
CHROMA_COLLECTION: str = os.getenv("CHROMA_COLLECTION", "uttam_portfolio")
PDF_PATH: str = os.getenv("PDF_PATH", str(BASE_DIR / "knowledge_base" / "resume.pdf"))
FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
INGEST_SECRET: str = os.getenv("INGEST_SECRET", "")

FALLBACK_ANSWER: str = (
    "I couldn't find verified information about that in Uttam's\n"
    "portfolio knowledge base.\n\n"
    "Please contact Uttam directly:\n"
    "📧 uttamt2006@gmail.com\n"
    "📱 +91 9074466065"
)

RATE_LIMIT_ANSWER: str = (
    "UttamBot is receiving too many requests right now. "
    "Please wait a moment and try again."
)

ERROR_ANSWER: str = "UttamBot encountered an error. Please try again."

SCANNED_PDF_ERROR: str = (
    "Scanned PDF not supported. Please provide a text-based PDF."
)

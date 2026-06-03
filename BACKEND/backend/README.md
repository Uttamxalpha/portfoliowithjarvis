# UTTAMBOT Backend

Production-ready FastAPI backend for a recruiter-focused AI portfolio chatbot powered by Groq, LangChain, LangGraph, and ChromaDB.

## Tech Stack

- **API:** FastAPI + Uvicorn
- **LLM:** Groq API (`groq` Python SDK)
- **Embeddings:** sentence-transformers (`all-MiniLM-L6-v2`, local)
- **Vector DB:** ChromaDB (persistent local storage)
- **RAG:** LangChain (chunking) + LangGraph (4-node workflow)
- **PDF Parsing:** PyMuPDF (primary), pdfplumber (fallback)

## Project Structure

```
backend/
├── main.py
├── requirements.txt
├── .env.example
├── rag/
│   ├── config.py
│   ├── embeddings.py
│   ├── ingest.py
│   ├── retriever.py
│   └── workflow.py
├── knowledge_base/
│   └── resume.pdf
└── chroma_db/          # auto-created on ingest
```

## Local Setup

### 1. Create and activate a virtual environment

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:

- `GROQ_API_KEY` — your Groq API key
- `INGEST_SECRET` — secret for the `/ingest` endpoint

### 4. Add resume PDF

Place a text-based PDF at:

```
knowledge_base/resume.pdf
```

Scanned/image-only PDFs are not supported.

### 5. Build the knowledge base

```bash
python -m rag.ingest
```

### 6. Start the API server

```bash
uvicorn main:app --reload
```

Server runs at `http://127.0.0.1:8000`.

## API Endpoints

### `GET /health`

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "ok",
  "chroma_ready": true,
  "model": "llama3-70b-8192"
}
```

### `POST /chat`

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are Uttam'\''s skills?"}'
```

Response:

```json
{
  "answer": "..."
}
```

### `POST /chat/stream` (SSE)

Streams tokens as Server-Sent Events:

```
data: {"token": "..."}

data: {"token": "[DONE]"}
```

```bash
curl -N -X POST http://localhost:8000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Uttam'\''s experience"}'
```

### `POST /ingest`

Protected re-ingestion endpoint for deployments:

```bash
curl -X POST http://localhost:8000/ingest \
  -H "X-Ingest-Key: your_ingest_secret"
```

## LangGraph Pipeline

1. **query_classifier** — Groq `llama3-8b-8192` decides if the question is portfolio-related
2. **retriever** — fetches top-5 ChromaDB chunks
3. **answer_generator** — Groq `GROQ_MODEL` generates a grounded answer
4. **fallback_handler** — returns verified contact details when context is missing

## Error Handling

- Route-level exception handling (no stack traces exposed)
- Groq rate limits (`429`) return a friendly retry message
- Empty ChromaDB returns the fallback contact message
- Missing PDF logs a warning at startup; server still starts

## Notes

- Never hardcode API keys — use `.env` only
- Embedding model loads once as a singleton (not per request)
- Answers are RAG-grounded from `resume.pdf` only

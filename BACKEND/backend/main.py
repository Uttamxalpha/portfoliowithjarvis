"""UTTAMBOT — FastAPI application entry point."""

from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from groq import RateLimitError
from pydantic import BaseModel, Field

from rag.config import (
    ERROR_ANSWER,
    FALLBACK_ANSWER,
    FRONTEND_ORIGIN,
    GROQ_MODEL,
    INGEST_SECRET,
    RATE_LIMIT_ANSWER,
)
from rag.ingest import run_ingestion
from rag.retriever import PortfolioRetriever, get_retriever
from rag.workflow import PortfolioState, build_workflow, query_classifier, retriever_node, stream_answer

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("uttambot")

retriever: PortfolioRetriever | None = None
workflow = None


def _log_error(exc: Exception, context: str) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    logger.error("%s | %s | %s", timestamp, type(exc).__name__, context)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global retriever, workflow

    retriever = get_retriever()
    workflow = build_workflow(retriever)

    if not retriever.is_ready:
        logger.warning("⚠️  ChromaDB is empty. Run: python -m rag.ingest")
    else:
        logger.info("ChromaDB ready with %d chunks.", retriever.collection_count())

    yield


app = FastAPI(
    title="UTTAMBOT",
    description="Recruiter-focused AI portfolio chatbot for Uttam Tiwari",
    version="1.0.0",
    lifespan=lifespan,
)

_cors_origins = list({FRONTEND_ORIGIN, "http://localhost:3000"})
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "UttamBot API is running. Visit /health for status or /docs for interactive documentation."
    }



class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)


class ChatResponse(BaseModel):
    answer: str


class IngestResponse(BaseModel):
    status: str
    chunks_created: int


class HealthResponse(BaseModel):
    status: str
    chroma_ready: bool
    model: str


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    ready = retriever.is_ready if retriever else False
    return HealthResponse(status="ok", chroma_ready=ready, model=GROQ_MODEL)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> JSONResponse:
    try:
        if not workflow:
            return JSONResponse(
                status_code=500,
                content={"answer": ERROR_ANSWER},
            )

        result: PortfolioState = workflow.invoke(
            {
                "query": request.message.strip(),
                "is_relevant": False,
                "chunks": [],
                "answer": "",
            }
        )
        return ChatResponse(answer=result.get("answer") or FALLBACK_ANSWER)
    except RateLimitError:
        _log_error(RateLimitError("429"), "POST /chat rate limited")
        return JSONResponse(status_code=429, content={"answer": RATE_LIMIT_ANSWER})
    except RuntimeError as exc:
        _log_error(exc, "POST /chat runtime error")
        return JSONResponse(status_code=500, content={"answer": FALLBACK_ANSWER})
    except Exception as exc:
        _log_error(exc, "POST /chat")
        return JSONResponse(status_code=500, content={"answer": ERROR_ANSWER})


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest) -> StreamingResponse:
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            if not retriever:
                payload = json.dumps({"token": ERROR_ANSWER})
                yield f"data: {payload}\n\n"
                yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"
                return

            state: PortfolioState = {
                "query": request.message.strip(),
                "is_relevant": False,
                "chunks": [],
                "answer": "",
            }

            classified = query_classifier(state)
            state.update(classified)

            if state.get("answer"):
                payload = json.dumps({"token": state["answer"]})
                yield f"data: {payload}\n\n"
                yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"
                return

            retrieved = retriever_node(state, retriever)
            state.update(retrieved)

            if state.get("answer") or not state.get("chunks"):
                fallback = state.get("answer") or FALLBACK_ANSWER
                payload = json.dumps({"token": fallback})
                yield f"data: {payload}\n\n"
                yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"
                return

            for token in stream_answer(state["query"], state["chunks"]):
                payload = json.dumps({"token": token})
                yield f"data: {payload}\n\n"

            yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"
        except RateLimitError:
            _log_error(RateLimitError("429"), "POST /chat/stream rate limited")
            payload = json.dumps({"token": RATE_LIMIT_ANSWER})
            yield f"data: {payload}\n\n"
            yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"
        except Exception as exc:
            _log_error(exc, "POST /chat/stream")
            payload = json.dumps({"token": ERROR_ANSWER})
            yield f"data: {payload}\n\n"
            yield f"data: {json.dumps({'token': '[DONE]'})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.post("/ingest", response_model=IngestResponse)
async def ingest(x_ingest_key: str | None = Header(default=None, alias="X-Ingest-Key")):
    if not INGEST_SECRET:
        raise HTTPException(status_code=503, detail="Ingest endpoint is not configured.")
    if x_ingest_key != INGEST_SECRET:
        raise HTTPException(status_code=401, detail="Invalid ingest key.")

    try:
        summary = run_ingestion()
        if retriever:
            retriever.refresh()
        return IngestResponse(status="success", chunks_created=summary["total_chunks"])
    except FileNotFoundError as exc:
        _log_error(exc, "POST /ingest PDF missing")
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        _log_error(exc, "POST /ingest PDF invalid")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        _log_error(exc, "POST /ingest")
        raise HTTPException(status_code=500, detail="Ingestion failed.") from exc

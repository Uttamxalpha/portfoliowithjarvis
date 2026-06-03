"""LangGraph 4-node pipeline: classify → retrieve → generate → fallback."""

from __future__ import annotations

import logging
from typing import Literal, TypedDict

from groq import Groq
from groq import RateLimitError
from langgraph.graph import END, START, StateGraph

from rag.config import (
    FALLBACK_ANSWER,
    GROQ_API_KEY,
    GROQ_CLASSIFIER_MODEL,
    GROQ_MODEL,
    RATE_LIMIT_ANSWER,
)
from rag.retriever import PortfolioRetriever

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = """You are UttamBot, the AI representative for Uttam Tiwari's
engineering portfolio. Your sole knowledge source is the
retrieved context below.

Rules:
- Answer ONLY from the provided context.
- Be professional, concise, and technically precise.
- Do NOT sound like a generic chatbot. Sound like a sharp,
  prepared professional assistant.
- Do NOT add disclaimers, apologies, or filler phrases.
- If the context doesn't contain the answer, respond with exactly: NO_ANSWER

Retrieved Context:
{context}"""


class PortfolioState(TypedDict):
    query: str
    is_relevant: bool
    chunks: list[str]
    answer: str


def _get_groq_client() -> Groq:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured.")
    return Groq(api_key=GROQ_API_KEY)


def query_classifier(state: PortfolioState) -> dict:
    """Node 1: classify whether the query is portfolio-related."""
    client = _get_groq_client()
    query = state["query"]

    try:
        response = client.chat.completions.create(
            model=GROQ_CLASSIFIER_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a classifier. Respond ONLY with 'yes' or 'no'.",
                },
                {
                    "role": "user",
                    "content": (
                        "You are filtering messages for Uttam Tiwari's portfolio chatbot. "
                        "Determine if the user is asking about projects, skills, education, experience, certificates, "
                        "professional background, or attempting to chat/introduce themselves. "
                        "Respond 'yes' if it is a normal portfolio question (including general project, skills, or resume questions), "
                        "and 'no' only if it is completely off-topic spam (like math questions, capital of countries, general weather, etc.).\n"
                        f"Question: {query}"
                    ),
                },
            ],
            temperature=0,
            max_tokens=5,
        )
        content = response.choices[0].message.content or ""
        is_relevant = content.strip().lower().startswith("yes")
    except RateLimitError:
        logger.warning("Groq rate limit hit during classification.")
        return {"is_relevant": False, "answer": RATE_LIMIT_ANSWER}
    except Exception as exc:
        logger.error("Classifier error: %s", type(exc).__name__)
        return {"is_relevant": False, "answer": FALLBACK_ANSWER}

    return {"is_relevant": is_relevant}


def retriever_node(state: PortfolioState, retriever: PortfolioRetriever) -> dict:
    """Node 2: fetch relevant chunks when the query is portfolio-related."""
    if state.get("answer"):
        return {"chunks": []}

    if not state.get("is_relevant"):
        return {"chunks": []}

    try:
        chunks = retriever.retrieve(state["query"], top_k=6)
    except RuntimeError:
        return {"chunks": [], "answer": FALLBACK_ANSWER}
    except Exception as exc:
        logger.error("Retriever error: %s", type(exc).__name__)
        return {"chunks": [], "answer": FALLBACK_ANSWER}

    return {"chunks": chunks}


def answer_generator(state: PortfolioState) -> dict:
    """Node 3: generate a grounded answer from retrieved context."""
    if state.get("answer"):
        return {}

    chunks = state.get("chunks", [])
    if not chunks:
        return {"answer": FALLBACK_ANSWER}

    client = _get_groq_client()
    context = "\n\n".join(chunks)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context)

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": state["query"]},
            ],
            temperature=0.2,
            max_tokens=1024,
        )
        answer = (response.choices[0].message.content or "").strip()
        if not answer or answer == "NO_ANSWER" or "NO_ANSWER" in answer:
            return {"answer": FALLBACK_ANSWER}
        return {"answer": answer}
    except RateLimitError:
        logger.warning("Groq rate limit hit during answer generation.")
        return {"answer": RATE_LIMIT_ANSWER}
    except Exception as exc:
        logger.error("Answer generation error: %s", type(exc).__name__)
        return {"answer": FALLBACK_ANSWER}


def fallback_handler(state: PortfolioState) -> dict:
    """Node 4: return verified contact details when context is unavailable."""
    if state.get("answer"):
        return {}
    return {"answer": FALLBACK_ANSWER}


def route_after_retriever(state: PortfolioState) -> Literal["answer_generator", "fallback_handler"]:
    """Route to generation only when query is relevant and chunks were found."""
    if state.get("answer"):
        return "fallback_handler"
    if state.get("is_relevant") and state.get("chunks"):
        return "answer_generator"
    return "fallback_handler"


def build_workflow(retriever: PortfolioRetriever):
    """Compile and return the LangGraph workflow singleton."""
    graph = StateGraph(PortfolioState)

    graph.add_node("query_classifier", query_classifier)
    graph.add_node("retriever", lambda state: retriever_node(state, retriever))
    graph.add_node("answer_generator", answer_generator)
    graph.add_node("fallback_handler", fallback_handler)

    graph.add_edge(START, "query_classifier")
    graph.add_edge("query_classifier", "retriever")
    graph.add_conditional_edges(
        "retriever",
        route_after_retriever,
        {
            "answer_generator": "answer_generator",
            "fallback_handler": "fallback_handler",
        },
    )
    graph.add_edge("answer_generator", END)
    graph.add_edge("fallback_handler", END)

    return graph.compile()


def stream_answer(query: str, chunks: list[str]):
    """Stream Groq tokens for SSE /chat/stream endpoint."""
    if not chunks:
        yield FALLBACK_ANSWER
        return

    client = _get_groq_client()
    context = "\n\n".join(chunks)
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(context=context)

    try:
        stream = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query},
            ],
            temperature=0.2,
            max_tokens=1024,
            stream=True,
        )
        for chunk in stream:
            token = chunk.choices[0].delta.content
            if token:
                yield token
    except RateLimitError:
        yield RATE_LIMIT_ANSWER
    except Exception as exc:
        logger.error("Streaming error: %s", type(exc).__name__)
        yield FALLBACK_ANSWER

# BACKEND Monorepo

Two projects in one workspace:

| Path | Purpose |
|------|---------|
| `.cursor/rules/karpathy-guidelines.mdc` | Cursor project rules (auto-applied) |
| `CLAUDE.md` | Same guidelines for Claude Code |
| `skills/karpathy-guidelines/SKILL.md` | Optional personal Agent Skill |
| `instruction .txt` | Source copy of the Karpathy guidelines |
| `backend/` | **UTTAMBOT** — FastAPI RAG chatbot API |

## Karpathy guidelines (Cursor)

1. Open this folder in Cursor.
2. Confirm **Settings → Rules** shows `karpathy-guidelines` (`alwaysApply: true`).
3. Edit `instruction .txt` when updating principles — keep `.cursor/rules/karpathy-guidelines.mdc`, `CLAUDE.md`, and `skills/karpathy-guidelines/SKILL.md` in sync.

## UTTAMBOT (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add GROQ_API_KEY
# place resume at knowledge_base/resume.pdf
python -m rag.ingest
uvicorn main:app --reload
```

Full API docs: [backend/README.md](backend/README.md)

"""
AgriSage AI - FastAPI Application Entry Point
Owner: Member 2 (Backend Lead)

Wires together all route modules, configures CORS for the Vite dev server,
loads environment variables, and exposes /api/health.

Run with:  cd backend && uvicorn main:app --reload
"""

import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Make both the backend dir and the repo root importable so that
#   from database import ...   (backend internal)
#   from shared.schemas import ...   (repo root)
#   from agents.orchestrator import ...   (repo root)
# all work regardless of the current working directory.
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.dirname(_BACKEND_DIR)
for _p in (_BACKEND_DIR, _REPO_ROOT):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from database import init_db  # noqa: E402
from routes import farmers, cases, voice, agents  # noqa: E402


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    print("[main] AgriSage AI backend starting up ...")
    init_db()  # Create tables if they don't exist
    yield
    print("[main] AgriSage AI backend shutting down.")


app = FastAPI(
    title="AgriSage AI API",
    description="Voice-first agricultural intelligence API for YUKTIK 2026 (PS14)",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS configuration for the Vite dev server (http://localhost:5173)
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
app.include_router(farmers.router)
app.include_router(cases.router)
app.include_router(voice.router)
app.include_router(agents.router)


@app.get("/api/health", tags=["health"])
async def health():
    """Service health check endpoint."""
    return {
        "status": "ok",
        "version": "0.1.0",
        "agents": [
            "disease", "weather", "irrigation", "yield", "market", "advisory", "crop"
        ],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
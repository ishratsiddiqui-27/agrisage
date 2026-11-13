from typing import Any

from fastapi import HTTPException, status
from supabase import Client, create_client

from config import settings


def get_supabase() -> Client:
    """Return a Supabase client that uses the backend secret key only."""
    if not settings.supabase_url or not settings.supabase_secret_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Supabase is not configured. Set SUPABASE_URL and "
                "SUPABASE_SECRET_KEY in backend/.env"
            ),
        )
    return create_client(settings.supabase_url, settings.supabase_secret_key)


def drop_none(payload: dict[str, Any]) -> dict[str, Any]:
    """Remove None values so existing columns are not overwritten with null accidentally."""
    return {key: value for key, value in payload.items() if value is not None}


def first_or_404(data: list[Any] | None, detail: str) -> dict[str, Any]:
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    return data[0]


def run_query(action: str, query):
    """Execute a Supabase query and convert database errors into HTTP errors."""
    try:
        result = query.execute()
        return result.data
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Database error while {action}: {exc}",
        ) from exc


def require_farmer(db: Client, farmer_id: str) -> dict[str, Any]:
    data = run_query(
        "loading farmer",
        db.table("farmers").select("*").eq("farmer_id", farmer_id).limit(1),
    )
    return first_or_404(data, f"Farmer '{farmer_id}' was not found")


def require_case(db: Client, case_id: str) -> dict[str, Any]:
    data = run_query(
        "loading case",
        db.table("cases").select("*").eq("case_id", case_id).limit(1),
    )
    return first_or_404(data, f"Case '{case_id}' was not found")


def require_conversation(db: Client, conversation_id: str) -> dict[str, Any]:
    data = run_query(
        "loading conversation",
        db.table("conversations").select("*").eq("conversation_id", conversation_id).limit(1),
    )
    return first_or_404(data, f"Conversation '{conversation_id}' was not found")

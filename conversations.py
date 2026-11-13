from uuid import uuid4

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from database import drop_none, first_or_404, get_supabase, require_conversation, require_farmer, run_query
from models import Conversation, ConversationCreate

router = APIRouter(prefix="/conversations", tags=["Conversations"])


@router.post("", response_model=Conversation, status_code=status.HTTP_201_CREATED)
def create_conversation(payload: ConversationCreate, db: Client = Depends(get_supabase)):
    farmer = require_farmer(db, payload.farmer_id)
    conversation_id = str(uuid4())
    row = drop_none(
        {
            "conversation_id": conversation_id,
            "farmer_id": payload.farmer_id,
            "language": payload.language or farmer.get("preferred_language"),
        }
    )
    data = run_query("creating conversation", db.table("conversations").insert(row))
    if data:
        return data[0]
    return require_conversation(db, conversation_id)


@router.get("", response_model=list[Conversation])
def list_conversations(
    farmer_id: str | None = Query(default=None),
    db: Client = Depends(get_supabase),
):
    query = db.table("conversations").select("*").order("created_at", desc=True)
    if farmer_id:
        query = query.eq("farmer_id", farmer_id)
    return run_query("listing conversations", query) or []


@router.get("/{conversation_id}", response_model=Conversation)
def get_conversation(conversation_id: str, db: Client = Depends(get_supabase)):
    data = run_query(
        "loading conversation",
        db.table("conversations").select("*").eq("conversation_id", conversation_id).limit(1),
    )
    return first_or_404(data, f"Conversation '{conversation_id}' was not found")

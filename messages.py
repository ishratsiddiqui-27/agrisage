from uuid import uuid4

from fastapi import APIRouter, Depends, status
from supabase import Client

from database import drop_none, get_supabase, require_conversation, run_query
from models import Message, MessageCreate

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("", response_model=Message, status_code=status.HTTP_201_CREATED)
def save_message(payload: MessageCreate, db: Client = Depends(get_supabase)):
    require_conversation(db, str(payload.conversation_id))
    message_id = str(uuid4())
    row = {
        "message_id": message_id,
        "conversation_id": str(payload.conversation_id),
        "role": payload.role,
        "content": payload.content,
    }
    data = run_query("saving message", db.table("messages").insert(row))
    if data:
        return data[0]
    saved = run_query(
        "loading message",
        db.table("messages").select("*").eq("message_id", message_id).limit(1),
    )
    return saved[0]


@router.get("/{conversation_id}", response_model=list[Message])
def list_messages(conversation_id: str, db: Client = Depends(get_supabase)):
    require_conversation(db, conversation_id)
    data = run_query(
        "listing messages",
        db.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at"),
    )
    return data or []

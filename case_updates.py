from uuid import uuid4

from fastapi import APIRouter, Depends, status
from supabase import Client

from database import drop_none, get_supabase, require_case, run_query
from models import CaseUpdateCreate, CaseUpdateRecord

router = APIRouter(prefix="/case-updates", tags=["Case updates"])


@router.post("", response_model=CaseUpdateRecord, status_code=status.HTTP_201_CREATED)
def add_case_update(payload: CaseUpdateCreate, db: Client = Depends(get_supabase)):
    case_id = str(payload.case_id)
    require_case(db, case_id)
    run_query(
        "updating case status",
        db.table("cases").update({"status": payload.status}).eq("case_id", case_id),
    )
    update_id = str(uuid4())
    row = drop_none(
        {
            "update_id": update_id,
            "case_id": case_id,
            "status": payload.status,
            "notes": payload.notes,
        }
    )
    data = run_query("saving case update", db.table("case_updates").insert(row))
    if data:
        return data[0]
    saved = run_query(
        "loading case update",
        db.table("case_updates").select("*").eq("update_id", update_id).limit(1),
    )
    return saved[0]


@router.get("/{case_id}", response_model=list[CaseUpdateRecord])
def list_case_updates(case_id: str, db: Client = Depends(get_supabase)):
    require_case(db, case_id)
    data = run_query(
        "listing case updates",
        db.table("case_updates").select("*").eq("case_id", case_id).order("created_at"),
    )
    return data or []

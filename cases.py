from uuid import uuid4

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from database import (
    drop_none,
    first_or_404,
    get_supabase,
    require_case,
    require_farmer,
    run_query,
)
from models import Case, CaseCreate, CaseStatusUpdate, CaseUpdate, CaseUpdateRecord

router = APIRouter(prefix="/cases", tags=["Cases"])


def _insert_case_update(db: Client, case_id: str, status_value: str, notes: str | None) -> None:
    run_query(
        "saving case update",
        db.table("case_updates").insert(
            drop_none(
                {
                    "update_id": str(uuid4()),
                    "case_id": case_id,
                    "status": status_value,
                    "notes": notes,
                }
            )
        ),
    )


@router.post("", response_model=Case, status_code=status.HTTP_201_CREATED)
def create_case(payload: CaseCreate, db: Client = Depends(get_supabase)):
    farmer = require_farmer(db, payload.farmer_id)
    case_id = str(uuid4())
    row = drop_none(
        {
            "case_id": case_id,
            "farmer_id": payload.farmer_id,
            "language": payload.language or farmer.get("preferred_language"),
            "crop": payload.crop,
            "growth_stage": payload.growth_stage,
            "problem": payload.problem,
            "severity": payload.severity,
            "status": payload.status or "open",
            "conversation_summary": payload.conversation_summary,
        }
    )
    data = run_query("creating case", db.table("cases").insert(row))
    created = data[0] if data else require_case(db, case_id)
    _insert_case_update(
        db,
        str(created["case_id"]),
        created.get("status") or "open",
        "Case created",
    )
    return created


@router.get("", response_model=list[Case])
def list_cases(
    farmer_id: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Client = Depends(get_supabase),
):
    query = db.table("cases").select("*").order("created_at", desc=True)
    if farmer_id:
        query = query.eq("farmer_id", farmer_id)
    if status_filter:
        query = query.eq("status", status_filter)
    return run_query("listing cases", query) or []


@router.get("/{case_id}", response_model=Case)
def get_case(case_id: str, db: Client = Depends(get_supabase)):
    data = run_query(
        "loading case",
        db.table("cases").select("*").eq("case_id", case_id).limit(1),
    )
    return first_or_404(data, f"Case '{case_id}' was not found")


@router.patch("/{case_id}", response_model=Case)
def update_case(case_id: str, payload: CaseUpdate, db: Client = Depends(get_supabase)):
    existing = require_case(db, case_id)
    changes = drop_none(payload.model_dump())
    if not changes:
        return existing

    data = run_query(
        "updating case",
        db.table("cases").update(changes).eq("case_id", case_id),
    )
    updated = data[0] if data else require_case(db, case_id)

    if "status" in changes and changes["status"] != existing.get("status"):
        _insert_case_update(db, case_id, changes["status"], "Case information updated")
    return updated


@router.patch("/{case_id}/status", response_model=CaseUpdateRecord)
def update_case_status(
    case_id: str,
    payload: CaseStatusUpdate,
    db: Client = Depends(get_supabase),
):
    require_case(db, case_id)
    run_query(
        "updating case status",
        db.table("cases").update({"status": payload.status}).eq("case_id", case_id),
    )
    notes = payload.notes or f"Status changed to {payload.status}"
    update_id = str(uuid4())
    data = run_query(
        "saving case update",
        db.table("case_updates").insert(
            drop_none(
                {
                    "update_id": update_id,
                    "case_id": case_id,
                    "status": payload.status,
                    "notes": notes,
                }
            )
        ),
    )
    if data:
        return data[0]
    updates = run_query(
        "loading case update",
        db.table("case_updates").select("*").eq("update_id", update_id).limit(1),
    )
    return first_or_404(updates, "Case update was not saved")

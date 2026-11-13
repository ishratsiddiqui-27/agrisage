from uuid import uuid4

from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from database import drop_none, first_or_404, get_supabase, require_farmer, run_query
from models import Farmer, FarmerCreate

router = APIRouter(prefix="/farmers", tags=["Farmers"])


@router.post("", response_model=Farmer, status_code=status.HTTP_201_CREATED)
def register_farmer(payload: FarmerCreate, db: Client = Depends(get_supabase)):
    farmer_id = payload.farmer_id or str(uuid4())
    row = drop_none(
        {
            "farmer_id": farmer_id,
            "farmer_name": payload.farmer_name,
            "phone": payload.phone,
            "preferred_language": payload.preferred_language,
            "location": payload.location,
            "auth_user_id": str(payload.auth_user_id) if payload.auth_user_id else None,
        }
    )
    data = run_query("registering farmer", db.table("farmers").insert(row))
    if data:
        return data[0]
    return require_farmer(db, farmer_id)


@router.get("", response_model=list[Farmer])
def list_farmers(
    location: str | None = Query(default=None),
    db: Client = Depends(get_supabase),
):
    query = db.table("farmers").select("*").order("created_at", desc=True)
    if location:
        query = query.eq("location", location)
    return run_query("listing farmers", query) or []


@router.get("/{farmer_id}", response_model=Farmer)
def get_farmer(farmer_id: str, db: Client = Depends(get_supabase)):
    data = run_query(
        "loading farmer",
        db.table("farmers").select("*").eq("farmer_id", farmer_id).limit(1),
    )
    return first_or_404(data, f"Farmer '{farmer_id}' was not found")

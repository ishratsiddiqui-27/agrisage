"""
AgriSage AI - Farmer Profile Routes
Owner: Member 2 (Backend Lead)

GET  /api/farmers  -> list all farmer profiles
POST /api/farmers  -> create a new farmer profile
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Farmer
from shared.schemas import FarmerProfile, FarmerProfileCreate

router = APIRouter(prefix="/api/farmers", tags=["farmers"])


@router.get("", response_model=list[FarmerProfile])
async def list_farmers(db: Session = Depends(get_db)):
    """Return all farmer profiles in the database."""
    return db.query(Farmer).all()


@router.post("", response_model=FarmerProfile, status_code=201)
async def create_farmer(payload: FarmerProfileCreate, db: Session = Depends(get_db)):
    """Create a new farmer profile. Returns the created record."""
    # Check for duplicate farmer_id
    existing = db.query(Farmer).filter(Farmer.farmer_id == payload.farmer_id).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Farmer {payload.farmer_id} already exists")

    farmer = Farmer(
        farmer_id=payload.farmer_id,
        name=payload.name,
        district=payload.district,
        language=payload.language,
        crop=payload.crop,
        phone=payload.phone,
    )
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer

"""
AgriSage AI - Case Management Routes
Owner: Member 2 (Backend Lead)

GET  /api/cases          -> list all cases (optional ?status= filter)
GET  /api/cases/{id}     -> get a single case by id
POST /api/cases          -> create a new case
PATCH /api/cases/{id}    -> update case status and/or expert reply

On first run (empty DB), 8 demo cases across Telangana districts are seeded
with is_demo=true so the expert dashboard has data to show.
"""

import json
import os
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Case as CaseModel
from shared.schemas import Case, CaseCreate, CaseUpdate, AgentResponse

router = APIRouter(prefix="/api/cases", tags=["cases"])


# ---------------------------------------------------------------------------
# Demo case seeding
# ---------------------------------------------------------------------------

def _seed_demo_cases(db: Session):
    """Seed 8 demo cases across Telangana districts on first run."""
    # Load the demo cases JSON from the mock/ directory
    mock_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "mock", "cases.json",
    )
    if not os.path.exists(mock_path):
        print("[cases] mock/cases.json not found, skipping demo seed")
        return

    with open(mock_path, "r", encoding="utf-8") as f:
        demo_cases = json.load(f)

    created = 0
    for item in demo_cases:
        # Skip if a case with the same farmer+crop+symptoms already exists
        existing = (
            db.query(CaseModel)
            .filter(CaseModel.farmer == item["farmer"])
            .filter(CaseModel.crop == item["crop"])
            .filter(CaseModel.symptoms == item["symptoms"])
            .first()
        )
        if existing:
            continue

        case = CaseModel(
            farmer=item["farmer"],
            crop=item["crop"],
            district=item["district"],
            symptoms=item["symptoms"],
            image_url=item.get("image_url"),
            summary=item.get("summary", ""),
            status=item.get("status", "New"),
            agent_findings=json.dumps(item.get("agent_findings", [])),
            created_at=datetime.fromisoformat(item.get("created_at", datetime.utcnow().isoformat())),
            expert_reply=item.get("expert_reply"),
            is_demo=True,
        )
        db.add(case)
        created += 1

    if created:
        db.commit()
        print(f"[cases] Seeded {created} demo cases")


@router.on_event("startup")
def _startup_seed():
    """Seed demo cases when the router starts (if the DB is empty)."""
    db = next(get_db())
    try:
        count = db.query(CaseModel).count()
        if count == 0:
            _seed_demo_cases(db)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("", response_model=list[Case])
async def list_cases(status: str = None, db: Session = Depends(get_db)):
    """List all cases, optionally filtered by status."""
    query = db.query(CaseModel)
    if status:
        query = query.filter(CaseModel.status == status)
    return query.order_by(CaseModel.created_at.desc()).all()


@router.get("/{case_id}", response_model=Case)
async def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get a single case by id."""
    case = db.query(CaseModel).filter(CaseModel.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return case


@router.post("", response_model=Case, status_code=201)
async def create_case(payload: CaseCreate, db: Session = Depends(get_db)):
    """Create a new case from a CaseCreate payload."""
    case = CaseModel(
        farmer=payload.farmer,
        crop=payload.crop,
        district=payload.district,
        symptoms=payload.symptoms,
        image_url=payload.image_url,
        summary=payload.summary or payload.symptoms,
        status="New",
        agent_findings=json.dumps([]),
        created_at=datetime.utcnow(),
        is_demo=False,
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    return case


@router.patch("/{case_id}", response_model=Case)
async def update_case(case_id: int, payload: CaseUpdate, db: Session = Depends(get_db)):
    """Update a case's status and/or expert reply."""
    case = db.query(CaseModel).filter(CaseModel.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    if payload.status is not None:
        case.status = payload.status
    if payload.expert_reply is not None:
        case.expert_reply = payload.expert_reply

    db.commit()
    db.refresh(case)
    return case
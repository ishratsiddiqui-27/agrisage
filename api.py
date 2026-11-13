from enum import Enum
from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Query, UploadFile
from pydantic import BaseModel, Field
from supabase import Client

from database import get_supabase
from services.agents import run_agent_pipeline, transcribe_audio
from services.case_mapper import case_object, farmer_response, image_response
from services.errors import ApiError
from services.media import read_upload
from services.persistence import (
    create_farmer_case,
    ensure_farmer,
    list_agent_steps,
    list_cases,
    load_case,
    patch_case,
)

router = APIRouter(prefix="/api", tags=["Frontend adapter"])


class CaseStatus(str, Enum):
    New = "New"
    Assigned = "Assigned"
    Resolved = "Resolved"


class TextQuery(BaseModel):
    query: str = Field(..., min_length=1)
    language: str = "en"
    farmer_id: str = "F101"
    crop: str | None = "Cotton"


class CasePatch(BaseModel):
    status: CaseStatus | None = None
    expert_reply: str | None = None
    reply: str | None = None
    notes: str | None = None
    expertReply: str | None = None

    def reply_text(self) -> str | None:
        for value in (self.expert_reply, self.reply, self.notes, self.expertReply):
            if value:
                return value
        return None


class HealthResponse(BaseModel):
    status: str


def _run_query_pipeline(
    db: Client,
    query: str,
    language: str,
    farmer_id: str,
    crop: str | None,
    image_bytes: bytes | None = None,
    image_mime: str | None = None,
) -> dict[str, Any]:
    farmer = ensure_farmer(db, farmer_id, language)
    pipeline = run_agent_pipeline(
        query=query,
        language=language,
        crop=crop,
        farmer=farmer,
        image_bytes=image_bytes,
        image_mime=image_mime,
    )
    answer = pipeline.get("answer") or pipeline.get("advisory") or ""
    case_row = create_farmer_case(db, farmer, language, crop, query, answer, pipeline)
    return farmer_response(query, language, farmer_id, crop, case_row, pipeline, farmer)


@router.get("/health", response_model=HealthResponse)
def api_health():
    return {"status": "ok"}


@router.post("/text")
def api_text(payload: TextQuery, db: Client = Depends(get_supabase)):
    return _run_query_pipeline(
        db,
        payload.query,
        payload.language or "en",
        payload.farmer_id or "F101",
        payload.crop,
    )


@router.post("/voice")
def api_voice(
    audio: UploadFile = File(...),
    language: str = Form("en"),
    farmer_id: str = Form("F101"),
    crop: str | None = Form("Cotton"),
    db: Client = Depends(get_supabase),
):
    audio_bytes, mime = read_upload(audio, "audio")
    try:
        transcript = transcribe_audio(audio_bytes, mime, language)
    except Exception as exc:
        transcript = f"[placeholder — STT failed: {exc}]"
    return _run_query_pipeline(db, transcript, language or "en", farmer_id or "F101", crop)


@router.post("/image")
def api_image(
    image: UploadFile = File(...),
    language: str = Form("en"),
    farmer_id: str = Form("F101"),
    crop: str | None = Form("Cotton"),
    db: Client = Depends(get_supabase),
):
    image_bytes, mime = read_upload(image, "image")
    query = f"Analyze this {crop or 'crop'} image for disease."
    base = _run_query_pipeline(
        db,
        query,
        language or "en",
        farmer_id or "F101",
        crop,
        image_bytes=image_bytes,
        image_mime=mime,
    )
    return image_response(base)


@router.get("/cases")
def api_list_cases(
    status: CaseStatus | None = Query(default=None),
    db: Client = Depends(get_supabase),
):
    status_value = status.value if status else None
    rows = list_cases(db, status_value)
    return [case_object(db, row) for row in rows]


@router.get("/cases/{case_id}")
def api_get_case(case_id: UUID, db: Client = Depends(get_supabase)):
    row = load_case(db, str(case_id))
    return case_object(db, row)


@router.patch("/cases/{case_id}")
def api_patch_case(case_id: UUID, payload: CasePatch, db: Client = Depends(get_supabase)):
    status_value = payload.status.value if payload.status else None
    if status_value is None and payload.reply_text() is None:
        raise ApiError(400, "Provide status and/or expert reply", "empty_patch")
    row = patch_case(db, str(case_id), status_value, payload.reply_text())
    return case_object(db, row)


@router.get("/agent-activity/{case_id}")
def api_agent_activity(case_id: UUID, db: Client = Depends(get_supabase)):
    load_case(db, str(case_id))
    return {"case_id": str(case_id), "steps": list_agent_steps(db, str(case_id))}

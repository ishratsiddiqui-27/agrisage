"""
AgriSage AI - Shared Pydantic Schemas
Owner: Member 2 (Backend Lead)

Central Pydantic models used by all agents and API routes.
Every agent response follows the AgentResponse format.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


# ---------------------------------------------------------------------------
# Farmer Input
# ---------------------------------------------------------------------------

class SoilProperties(BaseModel):
    """Soil test results for a farmer's field."""
    nitrogen: float = Field(..., description="N (kg/ha)")
    phosphorus: float = Field(..., description="P (kg/ha)")
    potassium: float = Field(..., description="K (kg/ha)")
    ph: float = Field(..., description="Soil pH")


class Location(BaseModel):
    """Geographic location with district name and lat/lon."""
    district: str
    lat: float
    lon: float


class FarmerInput(BaseModel):
    """Complete farmer query payload sent from the frontend."""
    farmer_id: str
    location: Location
    language: str = "en"
    crop: str
    sowing_date: Optional[str] = None
    growth_stage: Optional[str] = None
    soil: Optional[SoilProperties] = None
    query: Optional[str] = None
    image_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Agent Response
# ---------------------------------------------------------------------------

class AgentResponse(BaseModel):
    """
    Standard response format returned by every agent.

    Fields:
        agent:            Name of the agent (disease, weather, irrigation, ...)
        prediction:       Human-readable prediction string
        confidence:       Confidence score 0.0 - 1.0
        needs_expert_review: True if the agent is uncertain / ambiguous
        data:             Agent-specific structured payload
    """
    agent: str
    prediction: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    needs_expert_review: bool = False
    data: Dict[str, Any] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Voice API Response
# ---------------------------------------------------------------------------

class VoiceResponse(BaseModel):
    """Response returned by POST /api/voice."""
    transcript: str
    reply_text: str
    reply_audio_base64: Optional[str] = None
    agents: List[AgentResponse] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# Case Schema
# ---------------------------------------------------------------------------

class CaseCreate(BaseModel):
    """Payload to manually create a case."""
    farmer: str
    crop: str
    district: str
    symptoms: str
    image_url: Optional[str] = None
    summary: Optional[str] = None


class Case(BaseModel):
    """Full case record as stored in the database."""
    id: int
    farmer: str
    crop: str
    district: str
    symptoms: str
    image_url: Optional[str] = None
    summary: str
    status: str = "New"
    agent_findings: List[AgentResponse] = Field(default_factory=list)
    created_at: datetime
    expert_reply: Optional[str] = None
    is_demo: bool = False

    class Config:
        from_attributes = True


class CaseUpdate(BaseModel):
    """Payload to update a case (status and/or expert reply)."""
    status: Optional[str] = None
    expert_reply: Optional[str] = None


# ---------------------------------------------------------------------------
# Farmer Profile
# ---------------------------------------------------------------------------

class FarmerProfile(BaseModel):
    """Farmer profile record."""
    id: int
    farmer_id: str
    name: str
    district: str
    language: str = "en"
    crop: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class FarmerProfileCreate(BaseModel):
    """Payload to create a farmer profile."""
    farmer_id: str
    name: str
    district: str
    language: str = "en"
    crop: Optional[str] = None
    phone: Optional[str] = None


# ---------------------------------------------------------------------------
# Conversation Log
# ---------------------------------------------------------------------------

class Conversation(BaseModel):
    """A single conversation turn between farmer and system."""
    id: int
    farmer_id: str
    language: str
    input_type: str  # voice | text | image
    transcript: str
    response: VoiceResponse
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    """Service health check response."""
    status: str = "ok"
    version: str = "0.1.0"
    agents: List[str] = Field(default_factory=lambda: [
        "disease", "weather", "irrigation", "yield", "market", "advisory", "crop"
    ])


# ---------------------------------------------------------------------------
# Agent Activity
# ---------------------------------------------------------------------------

class AgentActivityStep(BaseModel):
    """One step in the agent activity feed for a case."""
    agent: str
    prediction: str
    confidence: float
    needs_expert_review: bool
    data: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime


class AgentActivityResponse(BaseModel):
    """Full activity feed for a case."""
    case_id: int
    steps: List[AgentActivityStep] = Field(default_factory=list)

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FarmerCreate(BaseModel):
    farmer_id: str | None = Field(
        default=None,
        description="Optional. A unique id is generated if this is omitted.",
    )
    farmer_name: str = Field(..., min_length=1, max_length=200)
    phone: str | None = Field(default=None, max_length=30)
    preferred_language: str | None = Field(default=None, max_length=50)
    location: str | None = Field(default=None, max_length=200)
    auth_user_id: UUID | None = None


class Farmer(BaseModel):
    farmer_id: str
    farmer_name: str | None = None
    phone: str | None = None
    preferred_language: str | None = None
    location: str | None = None
    created_at: datetime | None = None
    auth_user_id: UUID | None = None

    model_config = ConfigDict(from_attributes=True)


class CaseCreate(BaseModel):
    farmer_id: str = Field(..., min_length=1)
    language: str | None = None
    crop: str | None = None
    growth_stage: str | None = None
    problem: str | None = None
    severity: str | None = None
    status: str | None = Field(
        default="open",
        description="Application default is 'open'. Stored as text in the existing status column.",
    )
    conversation_summary: str | None = None


class CaseUpdate(BaseModel):
    language: str | None = None
    crop: str | None = None
    growth_stage: str | None = None
    problem: str | None = None
    severity: str | None = None
    status: str | None = None
    conversation_summary: str | None = None


class CaseStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1, max_length=100)
    notes: str | None = Field(
        default=None,
        description="Saved in case_updates.notes when the status changes.",
    )


class Case(BaseModel):
    case_id: UUID
    farmer_id: str
    language: str | None = None
    crop: str | None = None
    growth_stage: str | None = None
    problem: str | None = None
    severity: str | None = None
    status: str | None = None
    conversation_summary: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ConversationCreate(BaseModel):
    farmer_id: str = Field(..., min_length=1)
    language: str | None = None


class Conversation(BaseModel):
    conversation_id: UUID
    farmer_id: str
    language: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class MessageCreate(BaseModel):
    conversation_id: UUID
    role: str = Field(..., min_length=1, max_length=50)
    content: str = Field(..., min_length=1)


class Message(BaseModel):
    message_id: UUID
    conversation_id: UUID
    role: str | None = None
    content: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class CaseUpdateCreate(BaseModel):
    case_id: UUID
    status: str = Field(..., min_length=1, max_length=100)
    notes: str | None = None


class CaseUpdateRecord(BaseModel):
    update_id: UUID
    case_id: UUID
    status: str | None = None
    notes: str | None = None
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

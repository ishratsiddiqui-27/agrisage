# AgriSage AI Shared Schemas

## 1. Farmer Input JSON
Sent from frontend to backend on every query (voice/text/image).

```json
{
  "farmer_id": "F101",
  "location": {
    "district": "Nizamabad",
    "lat": 18.6725,
    "lon": 78.1023
  },
  "language": "te",
  "crop": "cotton",
  "sowing_date": "2026-06-15",
  "growth_stage": "flowering",
  "soil": {
    "nitrogen": 28,
    "phosphorus": 14,
    "potassium": 240,
    "ph": 6.4
  },
  "query": "My cotton leaves have yellow spots, what should I do?",
  "image_url": null
}
```

## 2. Agent Response Format
Every agent returns this exact structure.

```json
{
  "agent": "disease",
  "prediction": "Early blight detected on tomato leaves",
  "confidence": 0.87,
  "needs_expert_review": false,
  "data": {
    "label": "early_blight",
    "top_k": [
      {"label": "early_blight", "confidence": 0.87},
      {"label": "healthy", "confidence": 0.08}
    ]
  }
}
```

**Fields:**
- `agent` (str): One of `disease`, `weather`, `irrigation`, `yield`, `market`, `advisory`, `crop`
- `prediction` (str): Human-readable summary
- `confidence` (float): 0.0 to 1.0
- `needs_expert_review` (bool): True if confidence < 0.6 or symptoms are ambiguous
- `data` (dict): Agent-specific structured output

## 3. Voice API Response
Returned by `POST /api/voice`.

```json
{
  "transcript": "my cotton leaves have yellow spots",
  "reply_text": "Your cotton shows early blight symptoms. Apply copper fungicide.",
  "reply_audio_base64": "UklGRiQ...",
  "agents": [
    {"agent": "disease", "prediction": "...", "confidence": 0.87, "needs_expert_review": false, "data": {}},
    {"agent": "advisory", "prediction": "...", "confidence": 0.9, "needs_expert_review": false, "data": {}}
  ]
}
```

## 4. Case Schema
Created when `needs_expert_review=true` from any agent.

```json
{
  "id": 1,
  "farmer": "F101",
  "crop": "cotton",
  "district": "Nizamabad",
  "symptoms": "yellow spots on leaves",
  "image_url": null,
  "summary": "Farmer reports yellow spots on cotton leaves; agent flagged possible early blight",
  "status": "New",
  "agent_findings": [
    {"agent": "disease", "prediction": "Early blight", "confidence": 0.55, "needs_expert_review": true, "data": {}}
  ],
  "created_at": "2026-11-13T10:30:00Z",
  "expert_reply": null
}
```

Status values: `New` â†’ `Assigned` â†’ `Resolved`

## 5. API Endpoints

| Method | Path | Description | Owner |
|---|---|---|---|
| GET | `/api/health` | Service health check | M2 |
| GET | `/api/farmers` | List all farmers | M2 |
| POST | `/api/farmers` | Create farmer profile | M2 |
| GET | `/api/cases` | List cases (filters optional) | M2 |
| GET | `/api/cases/{id}` | Get single case | M2 |
| POST | `/api/cases` | Create case manually | M2 |
| PATCH | `/api/cases/{id}` | Update case status + expert reply | M2 |
| POST | `/api/voice` | Voice query (audio + lang + farmer_id) | M2/M5 |
| POST | `/api/text` | Text query | M2/M5 |
| POST | `/api/image` | Image query | M2/M4 |
| POST | `/api/vision/predict` | Plant disease inference | M4 |
| GET | `/api/agent-activity/{case_id}` | Agent activity feed for a case | M2/M5 |

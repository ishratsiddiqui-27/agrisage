# KisanConnect – AgriSage AI Backend

FastAPI backend for KisanConnect. It uses the existing Supabase tables:

- `farmers`
- `cases`
- `conversations`
- `messages`
- `case_updates`

Existing CRUD routes (`/farmers`, `/cases`, `/conversations`, `/messages`, `/case-updates`) are unchanged. The React Live-mode client uses the `/api` adapter.

Map coordinates and a dedicated `agent_steps` table are **not** in production. See `migrations/001_agrisage.sql` (do not auto-apply). The adapter geocodes `farmers.location` at read time and stores agent steps as JSON in `case_updates.notes`.

## 1. Install dependencies

From the `backend` folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 2. Configure `.env`

Copy `.env.example` to `.env`. Required:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Backend-only service role / secret key |
| `FRONTEND_URL` | CORS origin, for example `http://localhost:5173` |

Optional LLM / STT:

| Variable | Purpose |
| --- | --- |
| `LLM_PROVIDER` | `openai` (default) or `gemini` |
| `STT_PROVIDER` | `openai` (default) |
| `OPENAI_API_KEY` | Chat, vision, and Whisper |
| `GEMINI_API_KEY` | Gemini chat / vision |
| `AGENT_TIMEOUT_SECONDS` | Per-agent timeout (default 12) |

Keep `SUPABASE_SECRET_KEY` in `backend/.env` only. Never send it to the frontend.

If no LLM/STT key is set, agents still run and return **clearly labelled** `[placeholder — no API key configured]` results.

## 3. Start the backend

From the `backend` folder:

```powershell
uvicorn main:app --reload --port 8000
```

- API: http://127.0.0.1:8000
- Health: http://127.0.0.1:8000/health
- Frontend health: http://127.0.0.1:8000/api/health
- Supabase TLS check: http://127.0.0.1:8000/health/supabase
- Swagger: http://127.0.0.1:8000/docs

CORS allows `http://localhost:5173`, `http://127.0.0.1:5173`, and `FRONTEND_URL`.

Set the Vite app to live mode: `VITE_USE_MOCK=false` and `VITE_API_URL=http://localhost:8000`.

## 4. Frontend `/api` endpoints

### `GET /api/health`

```json
{"status":"ok"}
```

### `POST /api/text`

```json
{
  "query": "Why are my cotton leaves turning yellow?",
  "language": "en",
  "farmer_id": "F101",
  "crop": "Cotton"
}
```

Example response (fields the Farmer page uses):

```json
{
  "case_id": "uuid",
  "id": "uuid",
  "farmer_id": "F101",
  "crop": "Cotton",
  "language": "en",
  "transcript": "Why are my cotton leaves turning yellow?",
  "answer": "Monitor the crop and follow the irrigation advice.",
  "advisory": "Monitor the crop and follow the irrigation advice.",
  "disease": {
    "name": "Leaf spot",
    "confidence": 0.81,
    "confidence_pct": 81,
    "symptoms": "...",
    "treatment": "...",
    "prevention": "...",
    "severity": "medium"
  },
  "weather": {"current": {"temperature_c": 29, "condition": "Clear"}, "forecast": []},
  "irrigation": {"recommendation": "...", "timing": "Early morning", "water_mm": 15},
  "yield": {"outlook": "stable", "estimate": "...", "risk": "low"},
  "status": "New",
  "lat": 19.9975,
  "lng": 73.7898
}
```

### `POST /api/voice`

`multipart/form-data` fields: `audio`, `language`, `farmer_id`, `crop`. Audio: webm/wav/mp3/m4a, max 15 MB. Same response as `/api/text`, with `transcript` from STT (or a labelled placeholder).

### `POST /api/image`

`multipart/form-data` fields: `image`, `language`, `farmer_id`, `crop`. Images: jpg/png/webp, max 10 MB. Returns the Farmer/disease-card object (`disease_name`, `confidence` 0–1, `confidence_pct` 0–100, symptoms, treatment, prevention).

### `GET /api/cases` and `GET /api/cases?status=New|Assigned|Resolved`

Array of case objects (`id`, `status`, `farmer_id`, `farmer_name`, `crop`, `query`, `location`, `lat`/`lng`, `expert_reply`, `created_at`). Missing coordinates are `null`.

### `GET /api/cases/{id}`

One case object. `404` `{ "detail": "...", "code": "not_found" }`.

### `PATCH /api/cases/{id}`

```json
{"status": "Assigned", "expert_reply": "Visit the field and confirm leaf curl."}
```

Status must be exactly `New`, `Assigned`, or `Resolved` (422 otherwise). Reply is stored in `messages` (role `expert`) and `case_updates`.

### `GET /api/agent-activity/{case_id}`

```json
{
  "case_id": "uuid",
  "steps": [
    {"agent": "Disease Agent", "status": "completed", "summary": "...", "timestamp": "2026-11-13T08:00:00+00:00"}
  ]
}
```

### `GET /health/supabase`

Authenticated GET to `{SUPABASE_URL}/rest/v1/`. Certificate verification is never disabled.

```json
{"ok": true, "status_code": 200}
```

or `{"ok": false, "error_type": "...", "error": "..."}`.

Errors use `{"detail": "...", "code": "..."}`.

## 5. Original table routes

Still available: `/farmers`, `/cases`, `/conversations`, `/messages`, `/case-updates`, `GET /health`. See Swagger.

## 6. Tests

```powershell
pytest -q
```

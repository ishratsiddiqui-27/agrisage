# AgriSage AI - Hackathon Project Context

## Project Overview
AgriSage AI is a multilingual, voice-first agricultural advisory platform for the YUKTIK 2026 Hackathon (PS14). It uses a team of cooperating AI agents to diagnose diseases, forecast weather, plan irrigation, estimate yields, and provide market intelligence â€” all in regional Indian languages.

## Tech Stack
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic, SQLite (local) / Supabase (prod)
- **ML**: scikit-learn, pandas, numpy, joblib, torch/torchvision (lazy-loaded)
- **Vision**: MobileNetV2 (torchvision), Pillow
- **LLM**: Google Gemini (google-genai), Groq, Sarvam AI (voice + translation)
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Recharts, Leaflet
- **Voice**: Sarvam AI STT/TTS, Web Audio API

## Folder Ownership
| Member | Name | Directory | Scope |
|---|---|---|---|
| 1 |  | `frontend/` | Farmer UI, Voice UI, Chat, all cards, CaseTable, RegionMap |
| 2 | Backend Lead | `backend/`, `shared/` | FastAPI app, DB, routes, schemas |
| 3 | ML Lead | `ml/` | Crop, yield, market models + training scripts |
| 4 | Vision Lead | `vision/` | Plant disease classification (MobileNetV2) |
| 5 | Agent Lead | `agents/` + `frontend/src/pages/ExpertDashboard.jsx` | Agent orchestrator, ETc engine, voice integration, expert dashboard |

## Critical Rules
1. **Directory Isolation**: Only edit files in your own assigned directory. Do not modify another member's files without explicit coordination.
2. **Never commit secrets**: No `.env` files, no API keys in frontend code. All keys live in backend `.env` and are loaded via `python-dotenv`.
3. **Shared response format**: Every agent response MUST follow this structure:
```json
{
  "agent": "disease",
  "prediction": "Leaf spot detected",
  "confidence": 0.87,
  "needs_expert_review": false,
  "data": { "label": "bacterial_leaf_spot", "top_k": [...] }
}
```
4. **End-to-end stubs**: All Python files must be runnable stubs with dummy data so the system works from day one.
5. **Git workflow**: Own a feature branch, PR into `main` at checkpoints. Commit message format:
```
feat: <description>
Co-Authored-By: Claude Code <noreply@anthropic.com>
```

## Shared Agent Response Format
```json
{
  "agent": "disease|weather|irrigation|yield|market|advisory|crop",
  "prediction": "<human-readable prediction>",
  "confidence": 0.0-1.0,
  "needs_expert_review": true|false,
  "data": { ...agent-specific fields... }
}
```

## API Endpoints
| Method | Path | Description | Owner |
|---|---|---|---|
| GET | `/api/health` | Service health check | M2 |
| GET | `/api/farmers` | List farmers | M2 |
| POST | `/api/farmers` | Create farmer profile | M2 |
| GET | `/api/cases` | List cases | M2 |
| GET | `/api/cases/{id}` | Get case detail | M2 |
| POST | `/api/cases` | Create case | M2 |
| PATCH | `/api/cases/{id}` | Update case status/reply | M2 |
| POST | `/api/voice` | Voice input (audio + lang + farmer_id) | M2/M5 |
| POST | `/api/text` | Text input | M2/M5 |
| POST | `/api/image` | Image input | M2/M4 |
| POST | `/api/vision/predict` | Plant disease inference | M4 |
| GET | `/api/agent-activity/{case_id}` | Agent activity feed | M2/M5 |

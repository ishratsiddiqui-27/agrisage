# AgriSage AI - Multilingual Voice-First Agricultural Intelligence Platform

**YUKTIK 2026 Hackathon | Problem Statement PS14**

AgriSage AI is a voice-first, agent-driven advisory and diagnostic platform designed for smallholder farmers. Powered by specialized multi-agent systems, AgriSage AI provides real-time crop disease diagnosis, weather insights, precision irrigation planning, yield forecasting, and market intelligence in native regional languages.

---

## ðŸ‘¥ Hackathon Team & Directory Ownership

| Member | Name | Role / Directory | Key Responsibilities |
|---|---|---|---|
| **Member 1** |  (Lead) | `frontend/` (Farmer UI) | Voice UI, Chat interface, Image upload, Weather & Advisory UI cards |
| **Member 2** | Backend Lead | `backend/` & `shared/` | FastAPI backend, SQLite/Supabase DB, Case management routes, API schemas |
| **Member 3** | ML Lead | `ml/` | Crop recommendation, yield prediction, mandi price forecasting models |
| **Member 4** | Vision Lead | `vision/` | Plant disease classification (MobileNetV2), leaf image preprocessing |
| **Member 5** | Agent & Expert Lead | `agents/` & Expert Dashboard | Multi-agent orchestrator, Irrigation ETc engine, Voice integration, Expert Dashboard (`frontend/src/pages/ExpertDashboard.jsx`) |

*Note: Members 1 and 5 share ownership of the Dashboard UI.*

---

## ðŸ“ Repository Structure Map

```
agrisage/
â”œâ”€â”€ README.md                   # Project overview, team map, setup guide
â”œâ”€â”€ .gitignore                  # Git ignore definitions
â”œâ”€â”€ .env.example                # Sample environment variables
â”œâ”€â”€ CLAUDE.md                   # Project guidelines & AI context
â”œâ”€â”€ shared/                     # Shared Pydantic schemas & API specifications (Member 2)
â”‚   â”œâ”€â”€ schemas.md              # JSON schemas & API specifications
â”‚   â””â”€â”€ schemas.py              # Shared Pydantic data models
â”œâ”€â”€ backend/                    # FastAPI app, SQLite database, routes (Member 2)
â”‚   â”œâ”€â”€ requirements.txt        # Full Python dependencies
â”‚   â”œâ”€â”€ main.py                 # FastAPI application entrypoint
â”‚   â”œâ”€â”€ database.py             # SQLAlchemy configuration
â”‚   â”œâ”€â”€ models.py               # ORM Database models
â”‚   â””â”€â”€ routes/                 # Endpoint routers (farmers, cases, voice, agents)
â”œâ”€â”€ agents/                     # Multi-agent system & domain agents (Member 5)
â”‚   â”œâ”€â”€ orchestrator.py         # Multi-agent workflow runner & escalation logic
â”‚   â”œâ”€â”€ disease_agent.py        # Vision model wrapper agent
â”‚   â”œâ”€â”€ crop_agent.py           # ML crop recommendation wrapper agent
â”‚   â”œâ”€â”€ yield_agent.py          # ML yield prediction wrapper agent
â”‚   â”œâ”€â”€ market_agent.py         # ML market price wrapper agent
â”‚   â”œâ”€â”€ weather_agent.py        # Open-Meteo live weather agent
â”‚   â”œâ”€â”€ irrigation_agent.py     # ETc FAO-56 irrigation math engine
â”‚   â”œâ”€â”€ advisory_agent.py       # LLM synthesis advisory agent
â”‚   â”œâ”€â”€ language_agent.py       # Sarvam AI STT/TTS & translation agent
â”‚   â””â”€â”€ data/                   # Crop calendar & Telangana district coordinates
â”œâ”€â”€ ml/                         # ML models & training scripts (Member 3)
â”‚   â”œâ”€â”€ preprocess.py           # Feature engineering & tabular data cleaning
â”‚   â”œâ”€â”€ crop_model.py           # Crop recommendation model trainer/predictor
â”‚   â”œâ”€â”€ yield_model.py          # Yield estimation model trainer/predictor
â”‚   â”œâ”€â”€ market_model.py         # Price trend model trainer/predictor
â”‚   â”œâ”€â”€ predict.py              # ML inference helper routines
â”‚   â”œâ”€â”€ data/raw/               # Raw datasets (Kaggle, Data.gov.in)
â”‚   â””â”€â”€ models/                 # Saved joblib (.pkl) models
â”œâ”€â”€ vision/                     # Deep learning plant disease diagnosis (Member 4)
â”‚   â”œâ”€â”€ model.py                # MobileNetV2 architecture & weights loader
â”‚   â”œâ”€â”€ preprocess.py           # Image transformation & normalization
â”‚   â”œâ”€â”€ predict.py              # Plant disease inference & confidence scoring
â”‚   â”œâ”€â”€ routes.py               # Vision API router
â”‚   â””â”€â”€ samples/                # Sample leaf diagnostic images
â”œâ”€â”€ mock/                       # Dummy JSON data for offline development & tests
â””â”€â”€ frontend/                   # React + Vite + Tailwind CSS app (Member 1 & 5)
    â”œâ”€â”€ package.json            # Node.js dependencies
    â”œâ”€â”€ vite.config.js          # Vite configuration
    â”œâ”€â”€ .env.example            # Frontend environment variables
    â””â”€â”€ src/
        â”œâ”€â”€ api/                # API client helper functions
        â”œâ”€â”€ components/         # Reusable UI components
        â”œâ”€â”€ pages/              # Main view pages (Farmer UI, Expert Dashboard, Case Detail)
        â”œâ”€â”€ hooks/              # Custom React hooks (e.g. voice recorder)
        â””â”€â”€ mock/               # Local mock fallback datasets
```

---

## ðŸš€ How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
Backend interactive docs: `http://localhost:8000/docs`  
Health check: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend Web App: `http://localhost:5173`

---

## ðŸŒ¿ Git Workflow & Rules

1. **Branching Strategy**:
   - `main`: Production-ready checkpoint branch.
   - Feature branches: `feature/member1-voice-ui`, `feature/member2-cases-api`, `feature/member3-ml-models`, `feature/member4-vision-model`, `feature/member5-agent-orchestrator`.
2. **Directory Isolation Rule**:
   - **ONLY edit files in your assigned directory.**
   - Do NOT edit code in another member's directory without prior coordination.
3. **Secrets Management**:
   - **NEVER** commit `.env` files or API keys into git.
   - Always copy `.env.example` to `.env` locally.
4. **Pull Requests & Code Reviews**:
   - Push your feature branch and open a PR into `main` at every scheduled hackathon checkpoint.

---

## â±ï¸ Hackathon Checkpoint Timeline

- **Checkpoint 1 (Hour 0 - 4)**: Project Scaffolding & End-to-End Stub Verification (Done!)
- **Checkpoint 2 (Hour 4 - 10)**: Core Domain Implementation (ML models trained, Vision model hooked up, Open-Meteo & ETc active, DB tables populated)
- **Checkpoint 3 (Hour 10 - 16)**: Multi-Agent Orchestration & Voice API Integration (Sarvam AI / Gemini LLM connection)
- **Checkpoint 4 (Hour 16 - 20)**: UI/UX Polish, Expert Dashboard escalation flow, Real-time feed testing
- **Checkpoint 5 (Hour 20 - 24)**: Final end-to-end demo testing, slides preparation, video submission

try:
    import truststore

    truststore.inject_into_ssl()
except ImportError:
    import os

    import certifi

    ca_file = certifi.where()
    os.environ.setdefault("SSL_CERT_FILE", ca_file)
    os.environ.setdefault("REQUESTS_CA_BUNDLE", ca_file)

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx

from config import settings
from routes import api, case_updates, cases, conversations, farmers, messages
from services.errors import ApiError

app = FastAPI(
    title="KisanConnect – AgriSage AI",
    description=(
        "Backend API for KisanConnect. Uses the existing Supabase tables "
        "farmers, cases, conversations, messages, and case_updates."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

allowed_origins = {
    settings.frontend_url,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(origin for origin in allowed_origins if origin),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farmers.router)
app.include_router(cases.router)
app.include_router(conversations.router)
app.include_router(messages.router)
app.include_router(case_updates.router)
app.include_router(api.router)


@app.exception_handler(ApiError)
def api_error_handler(_request: Request, exc: ApiError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "code": exc.code},
    )


@app.exception_handler(RequestValidationError)
def validation_handler(_request: Request, exc: RequestValidationError):
    messages = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", []) if part != "body")
        messages.append(f"{location}: {error.get('msg')}" if location else str(error.get("msg")))
    detail = "; ".join(messages) or "Validation error"
    return JSONResponse(
        status_code=422,
        content={"detail": detail, "code": "validation_error"},
    )


@app.get("/health", tags=["Health"])
def health():
    supabase_configured = bool(settings.supabase_url and settings.supabase_secret_key)
    return {
        "status": "ok",
        "service": "KisanConnect AgriSage AI",
        "supabase_configured": supabase_configured,
    }


@app.get("/health/supabase", tags=["Health"])
def health_supabase():
    if not settings.supabase_url or not settings.supabase_secret_key:
        return {
            "ok": False,
            "error_type": "config",
            "error": "SUPABASE_URL or SUPABASE_SECRET_KEY is missing",
        }
    url = settings.supabase_url.rstrip("/") + "/rest/v1/"
    headers = {
        "apikey": settings.supabase_secret_key,
        "Authorization": f"Bearer {settings.supabase_secret_key}",
    }
    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.get(url, headers=headers)
        return {"ok": response.is_success, "status_code": response.status_code}
    except Exception as exc:
        return {
            "ok": False,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }

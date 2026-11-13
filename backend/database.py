"""
AgriSage AI - SQLAlchemy Database Setup
Owner: Member 2 (Backend Lead)

Configures a SQLite engine and creates all tables on startup.
Uses SQLite for local development; swap to Supabase/Postgres via DATABASE_URL.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read database URL from environment (defaults to local SQLite file)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agrisage.db")

# SQLite needs check_same_thread=False for FastAPI's threaded request handling
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    """Create all tables defined in backend.models. Safe to call repeatedly."""
    # Import models so their tables are registered on Base.metadata
    from backend import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    print(f"[database] Tables ensured for {DATABASE_URL}")


def get_db():
    """FastAPI dependency that yields a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

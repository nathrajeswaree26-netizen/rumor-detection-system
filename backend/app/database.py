import os

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)


# ============================================================
# Load environment variables
# ============================================================

load_dotenv()


# ============================================================
# Database configuration
# ============================================================

DB_HOST = os.getenv(
    "DB_HOST",
    "localhost"
)

DB_PORT = os.getenv(
    "DB_PORT",
    "3306"
)

DB_NAME = os.getenv(
    "DB_NAME",
    "rumor_detection_db"
)

DB_USER = os.getenv(
    "DB_USER",
    "root"
)

DB_PASSWORD = os.getenv(
    "DB_PASSWORD",
    ""
)


# ============================================================
# MySQL connection URL
# ============================================================

DATABASE_URL = (
    f"mysql+pymysql://"
    f"{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}"
    f"/{DB_NAME}"
)


# ============================================================
# SQLAlchemy engine
# ============================================================

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True
)


# ============================================================
# Database session
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ============================================================
# Base class
# ============================================================

Base = declarative_base()


# ============================================================
# Database dependency
# ============================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
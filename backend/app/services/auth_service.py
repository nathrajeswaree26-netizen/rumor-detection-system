import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.models.user import User


load_dotenv()


# ============================================================
# Password hashing
# ============================================================

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        password,
        hashed_password
    )


# ============================================================
# JWT configuration
# ============================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "change-this-secret-key-in-production"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)


def create_access_token(
    user_id: int,
    username: str,
    role: str
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(hours=24)
    )

    payload = {
        "sub": str(user_id),
        "username": username,
        "role": role,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# ============================================================
# Register user
# ============================================================

def register_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    role: str = "USER"
):
    # Check username
    existing_username = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_username:
        raise ValueError(
            "Username already exists"
        )

    # Check email
    existing_email = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_email:
        raise ValueError(
            "Email already exists"
        )

    # Validate role
    allowed_roles = {
        "USER"
    }

    role = role.upper()

    if role not in allowed_roles:
        role = "USER"

    # Create user
    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


# ============================================================
# Authenticate user
# ============================================================

def authenticate_user(
    db: Session,
    username: str,
    password: str
):
    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user
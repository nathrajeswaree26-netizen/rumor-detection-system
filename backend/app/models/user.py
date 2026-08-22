from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String
)

from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):

    __tablename__ = "users"

    # ========================================================
    # ID
    # ========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ========================================================
    # Username
    # ========================================================

    username = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    # ========================================================
    # Email
    # ========================================================

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    # ========================================================
    # Password
    # ========================================================

    password_hash = Column(
        String(255),
        nullable=False
    )

    # ========================================================
    # Role
    # ========================================================

    role = Column(
        String(50),
        nullable=False,
        default="USER"
    )

    # ========================================================
    # Created time
    # ========================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ========================================================
    # Prediction relationship
    # ========================================================

    predictions = relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete-orphan"
    )
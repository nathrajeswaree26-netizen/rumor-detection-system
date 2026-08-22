from sqlalchemy import (
    Column,
    Integer,
    Text,
    Float,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database import Base


class Prediction(Base):

    __tablename__ = "predictions"

    # ========================================================
    # ID
    # ========================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # ========================================================
    # Input text
    # ========================================================

    text = Column(
        Text,
        nullable=False
    )

    # ========================================================
    # Prediction result
    # ========================================================

    predicted_label = Column(
        String(50),
        nullable=False
    )

    # ========================================================
    # Confidence
    # ========================================================

    confidence = Column(
        Float,
        nullable=False
    )

    # ========================================================
    # Model name
    # ========================================================

    model_name = Column(
        String(100),
        nullable=False
    )

    # ========================================================
    # Created time
    # ========================================================

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # ========================================================
    # User ID
    # ========================================================

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    # ========================================================
    # Relationship with User
    # ========================================================

    user = relationship(
        "User",
        back_populates="predictions"
    )
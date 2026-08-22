from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Text
)
from sqlalchemy.orm import relationship

from app.database import Base


class MLModel(Base):
    __tablename__ = "models"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    algorithm = Column(
        String(100),
        nullable=False
    )

    version = Column(
        String(50),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    is_active = Column(
        Integer,
        default=1,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    metrics = relationship(
        "ModelMetric",
        back_populates="model",
        cascade="all, delete-orphan"
    )
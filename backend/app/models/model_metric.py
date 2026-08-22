from sqlalchemy import (
    Column,
    Float,
    ForeignKey,
    Integer
)
from sqlalchemy.orm import relationship

from app.database import Base


class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    model_id = Column(
        Integer,
        ForeignKey("models.id"),
        nullable=False
    )

    accuracy = Column(
        Float,
        nullable=True
    )

    precision = Column(
        Float,
        nullable=True
    )

    recall = Column(
        Float,
        nullable=True
    )

    f1_score = Column(
        Float,
        nullable=True
    )

    model = relationship(
        "MLModel",
        back_populates="metrics"
    )
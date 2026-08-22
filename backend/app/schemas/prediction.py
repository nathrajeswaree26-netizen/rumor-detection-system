from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1
    )


class PredictionResponse(BaseModel):
    predicted_label: str
    confidence: float
    model_name: str
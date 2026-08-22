from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies.auth import (
    get_current_user
)

from app.ml.predictor import (
    predict_rumor
)

from app.models.prediction import (
    Prediction
)

from app.models.user import (
    User
)

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse
)


# ============================================================
# Router
# ============================================================

router = APIRouter(
    prefix="/api",
    tags=["Prediction"]
)


# ============================================================
# PREDICT
# ============================================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(

    request: PredictionRequest,

    db: Session = Depends(
        get_db
    ),

    current_user: User = Depends(
        get_current_user
    )
):

    try:

        # ====================================================
        # Run ML model
        # ====================================================

        result = predict_rumor(
            request.text
        )

        # ====================================================
        # Save prediction
        # ====================================================

        prediction = Prediction(

            text=request.text,

            predicted_label=result[
                "predicted_label"
            ],

            confidence=result[
                "confidence"
            ],

            model_name=result[
                "model_name"
            ],

            # IMPORTANT:
            # Save the logged-in user's ID
            user_id=current_user.id
        )

        # ====================================================
        # Save to database
        # ====================================================

        db.add(prediction)

        db.commit()

        db.refresh(prediction)

        # ====================================================
        # Return result
        # ====================================================

        return {

            "predicted_label":
                result["predicted_label"],

            "confidence":
                result["confidence"],

            "model_name":
                result["model_name"]
        }

    except ValueError as e:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
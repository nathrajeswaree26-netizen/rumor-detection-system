import os
import joblib


# ============================================================
# ML directory
# ============================================================

ML_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ============================================================
# Model and vectorizer paths
# ============================================================

MODEL_PATH = os.path.join(
    ML_DIR,
    "rumor_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    ML_DIR,
    "tfidf_vectorizer.pkl"
)


# ============================================================
# Check model files
# ============================================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )


if not os.path.exists(VECTORIZER_PATH):
    raise FileNotFoundError(
        f"Vectorizer file not found: {VECTORIZER_PATH}"
    )


# ============================================================
# Load model and TF-IDF vectorizer
# ============================================================

model = joblib.load(
    MODEL_PATH
)

vectorizer = joblib.load(
    VECTORIZER_PATH
)


# ============================================================
# Prediction function
# ============================================================

def predict_rumor(text: str) -> dict:

    if not isinstance(text, str):
        raise ValueError(
            "Text must be a string."
        )

    if not text.strip():
        raise ValueError(
            "Text must not be empty."
        )

    # Clean input
    cleaned_text = text.strip()

    # Convert text into TF-IDF features
    text_vector = vectorizer.transform(
        [cleaned_text]
    )

    # Predict label
    predicted_label = model.predict(
        text_vector
    )[0]

    # Get confidence
    if hasattr(model, "predict_proba"):

        probabilities = model.predict_proba(
            text_vector
        )[0]

        class_probabilities = dict(
            zip(
                model.classes_,
                probabilities
            )
        )

        confidence = float(
            class_probabilities[
                predicted_label
            ]
        )

    else:
        confidence = 1.0

    return {
        "predicted_label": str(
            predicted_label
        ),
        "confidence": round(
            confidence,
            4
        ),
        "model_name": "TF-IDF + Logistic Regression"
    }
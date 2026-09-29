# ============================================================
# ADD NOW — Load Trained Model
# ============================================================

import joblib
from pathlib import Path


# Path to the trained model
MODEL_PATH = (
    Path(__file__).resolve().parent
    / "artifacts"
    / "model.pkl"
)


# Load the complete trained pipeline
model = joblib.load(MODEL_PATH)


# ============================================================
# ADD NOW — Expense Category Prediction
# ============================================================

def predict_expense_category(description: str) -> str:
    """
    Predict the expense category from a transaction description.
    """

    prediction = model.predict([description])

    return prediction[0]

import numpy as np

def predict_expense_category_with_confidence(description: str):
    """
    Predict the expense category and calculate a confidence score.
    Returns (category, confidence).
    """
    prediction = model.predict([description])[0]
    
    # LinearSVC usually doesn't have predict_proba, but has decision_function
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba([description])[0]
        confidence = float(np.max(probs))
    elif hasattr(model, "decision_function"):
        scores = model.decision_function([description])[0]
        # Softmax conversion to get pseudo-probabilities
        exp_scores = np.exp(scores - np.max(scores))
        probs = exp_scores / exp_scores.sum()
        confidence = float(np.max(probs))
    else:
        confidence = 0.85 # Fallback
        
    return prediction, confidence
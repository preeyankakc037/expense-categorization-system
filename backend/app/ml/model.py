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
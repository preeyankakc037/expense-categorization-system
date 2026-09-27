# ============================================================
# ML Prediction Routes
# ============================================================

from fastapi import APIRouter

from schemas.ml_schemas import (
    ExpensePredictionRequest,
    ExpensePredictionResponse,
)

from services.ml_service import classify_expense


# ============================================================
# Router Configuration
# ============================================================

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"],
)


# ============================================================
# Predict Expense Category
# ============================================================

@router.post(
    "/predict",
    response_model=ExpensePredictionResponse,
)
def predict_category(
    request: ExpensePredictionRequest,
):
    """
    Predict the expense category from a description.
    """
    predicted_category = classify_expense(
        request.description
    )

    return ExpensePredictionResponse(
        description=request.description,
        predicted_category=predicted_category,
    )
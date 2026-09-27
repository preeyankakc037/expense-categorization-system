# ============================================================
# ML Prediction Schemas
# ============================================================

from pydantic import BaseModel


# ============================================================
# Prediction Request
# ============================================================

class ExpensePredictionRequest(BaseModel):
    """
    Data sent to the ML prediction endpoint.
    """

    description: str


# ============================================================
# Prediction Response
# ============================================================

class ExpensePredictionResponse(BaseModel):
    """
    Prediction returned by the ML prediction endpoint.
    """

    description: str
    predicted_category: str
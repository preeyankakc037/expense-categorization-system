# ============================================================
# Expense Classification Service
# ============================================================

from ml.model import predict_expense_category, predict_expense_category_with_confidence

# ============================================================
# Predict Expense Category
# ============================================================

def classify_expense(description: str) -> str:
    """
    Classify an expense description using the trained ML model.
    """

    return predict_expense_category(description)

def classify_expense_with_confidence(description: str):
    """
    Classify an expense and return (category, confidence).
    """
    return predict_expense_category_with_confidence(description)
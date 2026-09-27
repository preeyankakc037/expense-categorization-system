# ============================================================
# Expense Classification Service
# ============================================================

from ml.model import predict_expense_category


# ============================================================
# Predict Expense Category
# ============================================================

def classify_expense(description: str) -> str:
    """
    Classify an expense description using the trained ML model.
    """

    return predict_expense_category(description)
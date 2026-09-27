# ============================================================
# Test Saved Expense Classification Model
# ============================================================

from app.ml.model import predict_expense_category


# ============================================================
# Test Known Transaction Descriptions
# ============================================================

test_descriptions = [
    "ihop #99575 columbus",
    "foreign transaction fee",
    "sprouts 4966 newark",
    "entergy",
    "bart 101531",
    "walmart pharmacy.com",
    "Bought a pant",
    "Pasta in resturant"
]


# ============================================================
# Generate Predictions
# ============================================================

for description in test_descriptions:
    category = predict_expense_category(description)

    print(f"Description: {description}")
    print(f"Predicted category: {category}")
    print("-" * 60)
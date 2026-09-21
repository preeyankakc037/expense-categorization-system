from sqlalchemy.orm import Session

from database.models import Transaction
from schemas.expense_schemas import ExpenseCreate


def create_expense(db: Session, expense: ExpenseCreate) -> Transaction:
    transaction = Transaction(
        description=expense.description,
        amount=expense.amount,
        category=expense.category,
        transaction_type="expense",
        transaction_date=expense.transaction_date,
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return transaction
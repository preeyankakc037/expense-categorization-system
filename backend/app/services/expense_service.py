from sqlalchemy.orm import Session

from database.models import Transaction
from schemas.expense_schemas import ExpenseCreate, ExpenseUpdate


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


def get_expenses(db: Session) -> list[Transaction]:
    return (
        db.query(Transaction)
        .filter(Transaction.transaction_type == "expense")
        .order_by(Transaction.transaction_date.desc())
        .all()
    )


from schemas.expense_schemas import ExpenseCreate, ExpenseUpdate


def update_expense(
    db: Session,
    expense_id: int,
    expense: ExpenseUpdate,
) -> Transaction | None:
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == expense_id,
            Transaction.transaction_type == "expense",
        )
        .first()
    )

    if transaction is None:
        return None

    update_data = expense.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)

    return transaction

def delete_expense(db: Session, expense_id: int) -> bool:
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == expense_id,
            Transaction.transaction_type == "expense",
        )
        .first()
    )

    if transaction is None:
        return False

    db.delete(transaction)
    db.commit()

    return True
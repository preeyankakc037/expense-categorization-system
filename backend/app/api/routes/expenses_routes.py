from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.expense_schemas import ExpenseCreate, ExpenseResponse
from services.expense_service import create_expense

router = APIRouter()


@router.post("/expenses", response_model=ExpenseResponse, status_code=201)
def create_expense_route(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
):
    return create_expense(db, expense)
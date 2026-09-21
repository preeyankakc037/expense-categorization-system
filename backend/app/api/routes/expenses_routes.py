from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.expense_schemas import ExpenseCreate, ExpenseResponse
from services.expense_service import create_expense
from services.expense_service import create_expense, get_expenses

router = APIRouter()

# POST EXPENSE
@router.post("/expenses", response_model=ExpenseResponse, status_code=201)
def create_expense_route(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
):
    return create_expense(db, expense)


# GET EXPENSE 
@router.get("/expenses", response_model=list[ExpenseResponse])
def get_expenses_route(
    db: Session = Depends(get_db),
):
    return get_expenses(db)
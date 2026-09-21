from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.expense_schemas import ExpenseCreate, ExpenseResponse,ExpenseUpdate
from fastapi import APIRouter, Depends, HTTPException
from services.expense_service import (
    create_expense,
    get_expenses,
    update_expense,
    delete_expense,
)

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

# PUT EXPENSE
@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense_route(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
):
    updated_expense = update_expense(db, expense_id, expense)

    if updated_expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return updated_expense


# DELETE Expense 

@router.delete("/expenses/{expense_id}")
def delete_expense_route(
    expense_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_expense(db, expense_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Expense not found",
        )

    return {
        "message": "Expense deleted successfully"
    }
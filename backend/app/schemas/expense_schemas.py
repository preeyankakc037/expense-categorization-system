from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ExpenseCreate(BaseModel):
    description: str
    amount: float
    category: str
    transaction_date: date


class ExpenseUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    category: str | None = None
    transaction_date: date | None = None


class ExpenseResponse(BaseModel):
    id: int
    description: str
    amount: float
    category: str
    transaction_type: str
    transaction_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str

class ExtractedExpense(BaseModel):
    amount: float
    description: str
    date: Optional[str] = None
    predicted_category: Optional[str] = None
    confidence: Optional[float] = None

class ChatResponse(BaseModel):
    message: str
    intent: str
    status: str
    expense: Optional[ExtractedExpense] = None

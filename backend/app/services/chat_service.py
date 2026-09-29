from schemas.chat import ChatResponse, ExtractedExpense
from services.gemini_service import extract_expense_intent
from services.ml_service import classify_expense_with_confidence
import datetime

def process_chat_message(message: str) -> ChatResponse:
    # 1. Ask Gemini to extract intent and structured data
    gemini_data = extract_expense_intent(message)
    
    intent = gemini_data.get("intent", "CLARIFY")
    
    # 2. If it needs clarification (e.g. missing amount or description)
    if intent == "CLARIFY" or not gemini_data.get("amount") or not gemini_data.get("description"):
        clarify_msg = gemini_data.get("clarification_message") 
        if not clarify_msg:
            clarify_msg = "Could you provide the amount and description for the expense?"
            
        return ChatResponse(
            message=clarify_msg,
            intent="CLARIFY",
            status="CONVERSATIONAL"
        )
    
    # 3. We have ADD_EXPENSE with details. Call ML.
    description = gemini_data["description"]
    amount = float(gemini_data["amount"])
    date_str = gemini_data.get("date") 
    if not date_str:
        date_str = datetime.date.today().isoformat()
    
    # 4. Use existing ML classification with confidence
    predicted_category, confidence = classify_expense_with_confidence(description)
    
    # 5. Return structured response requiring user confirmation
    extracted_expense = ExtractedExpense(
        amount=amount,
        description=description,
        date=date_str,
        predicted_category=predicted_category,
        confidence=confidence
    )
    
    return ChatResponse(
        message=f"I found an expense for Rs. {amount} for {description}.",
        intent="ADD_EXPENSE",
        status="PENDING_CONFIRMATION",
        expense=extracted_expense
    )

from fastapi import APIRouter
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import process_chat_message

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def handle_chat(request: ChatRequest):
    return process_chat_message(request.message)

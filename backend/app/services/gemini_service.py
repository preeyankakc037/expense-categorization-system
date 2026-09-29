import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use JSON mime type to guarantee structured output
model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"response_mime_type": "application/json"})

def extract_expense_intent(message: str) -> dict:
    prompt = f"""
You are an AI expense assistant. The user will provide a message about an expense.
Determine their intent: ADD_EXPENSE or CLARIFY.
If they want to add an expense, extract the amount, description, and date (YYYY-MM-DD format). If no date is given, leave it null.
If essential information (amount or description) is missing, set intent to CLARIFY and ask for the missing information.
Do NOT categorize the expense, just extract the description exactly or slightly summarized.

Return JSON ONLY matching this schema:
{{
    "intent": "ADD_EXPENSE" | "CLARIFY",
    "amount": float or null,
    "description": string or null,
    "date": string or null,
    "clarification_message": string or null (if CLARIFY, the question to ask the user)
}}

User message: "{message}"
"""
    try:
        response = model.generate_content(prompt)
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return {
            "intent": "CLARIFY", 
            "clarification_message": "I didn't quite catch that. Could you tell me the amount and what the expense was for?"
        }

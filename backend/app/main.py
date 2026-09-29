from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from api.routes.expenses_routes import router as expense_router
from api.routes.ml_routes import router as ml_router
from api.routes.chat import router as chat_router

app=FastAPI()
# ==================================================
# ADD NOW — CORS CONFIGURATION
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.get("/")
def root():
    return{"message":"Expense API is running"}

app.include_router(expense_router)
app.include_router(ml_router)
app.include_router(chat_router)
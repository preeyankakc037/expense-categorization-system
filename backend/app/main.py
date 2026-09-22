from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from api.routes.expenses_routes import router as expense_router


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
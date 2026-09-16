# AI-Powered Personal Expense Categorization System

An AI-powered personal expense management system developed as part of **Project II** under the **Advanced FastAPI and Django** module.

The system is designed to help users record, manage, and categorize personal expenses through both traditional expense management and natural-language interaction. It combines a React-based frontend, FastAPI backend services, and supervised machine learning for expense categorization.

---

## Academic Context

**Module:** Advanced FastAPI and Django
**Assessment:** Project II
**Project:** AI-Powered Personal Expense Categorization System

---

## Project Overview

Managing personal expenses manually can make it difficult to maintain consistent records and understand spending patterns.

This project explores a web-based expense management system that automatically categorizes transaction descriptions using machine learning while also providing a conversational interface for interacting with expense records.

The system supports two primary interaction methods:

* **Manual expense management** — users can add, view, update, and delete expenses.
* **AI-assisted interaction** — users can interact with their expenses using natural language.

The application is designed with a separated frontend and backend architecture, allowing the React interface and FastAPI services to be developed and maintained independently.

---

## Key Features

* Personal expense management
* Manual expense creation, editing, and deletion
* Automatic expense categorization using machine learning
* Dashboard with spending overview
* Category-based spending visualization
* Expense search and filtering
* Natural-language AI assistant
* Confirmation flow for AI-initiated data modifications
* REST API-based frontend/backend communication
* PostgreSQL database integration

---

## System Architecture

```text
┌─────────────────────┐
│    React Frontend   │
│                     │
│ Dashboard           │
│ Expenses            │
│ AI Assistant        │
└──────────┬──────────┘
           │
        REST API
           │
           ▼
┌─────────────────────┐
│   FastAPI Backend   │
│                     │
│ API Services        │
│ ML Classification   │
│ AI Intent Handling  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│      Database       │
└─────────────────────┘
```

The frontend does not communicate directly with the database. All application operations are handled through the FastAPI backend.

---

## Machine Learning

The project uses supervised text classification to categorize expense descriptions.

The selected dataset is:

**US Bank Transaction Categories — v1**

The dataset contains **16,000 synthetic transaction descriptions** across multiple transaction categories.

The initial modelling workflow includes:

```text
Transaction Description
          ↓
Text Preprocessing
          ↓
TF-IDF Feature Extraction
          ↓
Machine Learning Classifier
          ↓
Predicted Category
```

The project evaluates multiple classical machine-learning approaches, including:

* Logistic Regression
* Linear Support Vector Machine
* Multinomial Naive Bayes

Model performance will be evaluated using appropriate classification metrics before selecting the model for integration into the application.

---

## Technology Stack

### Frontend

* React
* Tailwind CSS
* JavaScript
* REST API integration

### Backend

* FastAPI
* Python
* SQLAlchemy

### Database

* PostgreSQL

### Machine Learning

* Scikit-learn
* Pandas
* NumPy
* TF-IDF

### Development

* Git
* GitHub
* Google Colab
* VS Code

---

## Project Structure

```text
expense-categorization-system/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database/
│   │   └── ml/
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── data/
│
├── .gitignore
└── README.md
```

---

## Development Approach

The project is being developed incrementally:

1. Dataset analysis and preparation
2. Machine-learning model development and evaluation
3. Frontend development
4. FastAPI backend development
5. Database integration
6. ML model integration
7. AI assistant integration
8. Frontend-backend integration
9. Testing and evaluation

This approach allows each major component to be developed and evaluated independently before full system integration.

---

## Future Scope

The system can be extended with:

* Voice-based expense management
* Multilingual expense descriptions
* Receipt OCR
* Spending prediction
* Anomaly detection
* Personalized financial insights
* More advanced conversational operations

---
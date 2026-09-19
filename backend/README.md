# AccessGov – FastAPI Backend Service

This directory contains the Python FastAPI backend for **AccessGov: Government Accessibility Intelligence Platform**.

## Architecture

```text
Government URL (.gov.in / .nic.in)
        ↓
FastAPI (/api/scan)
        ↓
Playwright (Async Chromium Headless)
        ↓
axe-core (Injected DOM Audit)
        ↓
GIGW 3.0 & WCAG 2.2 Mapping Engine (gigw_mapper.py)
        ↓
Citizen Journey Intelligence Layer (citizen_journey.py)
        ↓
Task-Aware Priority Engine (severity & blocker scoring)
        ↓
Gemini AI Explanation Engine (plain-language summaries & developer fixes)
        ↓
PostgreSQL Database (database.py)
        ↓
React / Vite Dashboard & Audit Reports
```

## Quick Start (Local Python Development)

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Install Playwright Chromium Browser
```bash
playwright install chromium
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/accessgov
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the FastAPI Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Interactive API docs will be accessible at: `http://localhost:8000/docs`.

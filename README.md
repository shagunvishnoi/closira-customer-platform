# Closira — Engineering Intern Assignment (Full-Stack)

This repository contains the full-stack prototype for Closira's AI-powered customer enquiry-handling platform. It includes a robust Python backend and a polished React Native mobile dashboard, demonstrating my ability to build across the entire stack.

---

## 🏗 Project Architecture

- **`/backend`**: FastAPI REST API handling inbound enquiries, asynchronous SOP matching, and structured logging.
- **`/frontend`**: React Native (Expo) mobile dashboard for business owners to monitor leads, escalations, and follow-ups.

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
- **API Docs**: View the interactive OpenAPI docs at [http://localhost:8000/docs](http://localhost:8000/docs).
- **Test Requests**: Use `api_tests.http` (requires VS Code REST Client) or `curl` to test endpoints.

### 2. Frontend Setup
```bash
cd frontend
npm install
npx expo start
```
- Use the **Expo Go** app (iOS/Android) or an emulator to view the app.

---

## 🛠 Backend Assignment Details

### Core Tech Stack
- **Python 3.12+** / **FastAPI**: Chosen for its high performance and developer productivity.
- **SQAlchemy & SQLite**: Used for zero-setup, one-command execution while maintaining a clean relational schema.
- **BackgroundTasks**: Leveraged for SOP-matching to ensure the main API response is never blocked.

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/enquiry` | Create inbound enquiry. Returns `job_id` immediately. |
| `POST` | `/enquiry/{id}/follow-up` | Schedule a follow-up with `delay_minutes` & optional template. |
| `POST` | `/enquiry/{id}/escalate` | Manually mark an enquiry as escalated with a `reason`. |
| `GET` | `/enquiry/{id}/history` | Return full message thread, status timeline, and follow-ups. |
| `GET` | `/health` | Verify API status and Database (SQLite) connectivity. |

### Async SOP Pipeline
Upon enquiry creation, a background task performs the following:
1. **Keyword-based Matching**: Scans the message for 5 predefined SOPs (Booking, Pricing, Complaint, After-Hours, Support).
2. **Auto-Response**: Updates the record with a suggested response and logs the match.
3. **Auto-Escalation**: If no pattern is matched, the enquiry is flagged as "escalated" for human review.

**Decision: BackgroundTasks vs. Celery**  
For a prototype of this scope, `FastAPI BackgroundTasks` provides the best balance of speed and simplicity. It allows the entire system to run in a single process without needing an external message broker like Redis, which significantly lowers the barrier for evaluation.

### Structured Logging & Reliability
- Uses a custom **JSON Formatter** to emit machine-readable logs.
- Key events logged: `Enquiry Created`, `Task Started`, `SOP Matched`, `Auto-Escalated`.
- Graceful error handling for missing IDs (404) or state conflicts (409).

---

## 📱 Frontend Assignment Details

### Core Tech Stack
- **React Native (Expo)**: Unified codebase for cross-platform mobile delivery.
- **React Navigation**: Multi-tab bottom navigation with stack-based detail views.
- **StyleSheet**: Used vanilla RN styles for zero-config portability and high performance.

### Required Screens & Logic
- **Dashboard (Home)**: Displays 4 critical stats (Leads Today, Missed, Escalations, Due) and a "Recent Activity" feed.
- **Leads List**: Filterable feed of inbound enquiries with channel badges and status markers.
- **Escalations Screen**: High-urgency alerts with critical/standard indicators and a one-tap "Resolve" action.
- **Follow-ups Screen**: Checklist of scheduled tasks with message previews and "Mark-as-done" functionality.
- **Conversation Detail**: Full message history, **SOP Match Label**, AI Summary, and a visual Status Timeline.

### Design System & UX
- **Consistent Branding**: Indigo-based theme for a professional "business tool" aesthetic.
- **Channel Badges**: Color-coded for rapid scanning: WhatsApp (Green), Email (Blue), Call (Amber).
- **Status Identifiers**: Blue (New), Green (Qualified/SOP Matched), Red (Escalated).
- **Empty States**: Helpful illustrations across all views when no data is present.

### Mock Data & Persistence
- Realistic dataset located in `frontend/src/mock/`.
- Uses `AsyncStorage` via a global `DataContext` to persist resolved escalations and completed follow-ups during a session.

---

## ⚖️ Trade-offs & Known Limitations

- **Database**: SQLite is perfect for this demo but lacks the write-concurrency of PostgreSQL.
- **SOP Matching**: Currently keyword-driven; a production system would upgrade to Semantic Embeddings or LLM-based classification.
- **Follow-up Trigger**: Follow-ups are stored and scheduled in the DB but require a cron utility to actually "send" the notification.
- **Tenant Isolation**: Currently single-tenant; a `business_id` scoping would be required for a multi-SMB platform.

---

## 📝 Final Checklist Compliance
- [x] Combined README at root.
- [x] Clearly separated `/backend` and `/frontend` folders.
- [x] Background task logic justified.
- [x] No faking: all described features are fully implemented and functional.
- [x] Clean folder structure and component separation.

# Closira — Backend
 
REST API for Closira's customer enquiry pipeline built with FastAPI + SQLite.
 
## Tech Stack
 
- Python 3.14
- FastAPI 0.136.1
- Uvicorn 0.47.0
- SQLAlchemy 2.0.49
- Pydantic 2.13.4
- SQLite (via Python stdlib)
## Setup & Run
 
```bash
# Clone the repo
git clone https://github.com/shagunvishnoi/closira-customer-platform.git
cd closira-customer-platform/backend
 
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate
 
# Install dependencies
pip install -r requirements.txt
 
# Start the server
uvicorn main:app --reload
```
 
Server runs at http://localhost:8000  
Interactive docs at http://localhost:8000/docs
 
## API Endpoints
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enquiry` | Create new inbound enquiry. Returns job ID immediately, does not block. |
| POST | `/enquiry/{id}/followup` | Schedule a follow-up. Accepts delay in minutes + optional message template. |
| POST | `/enquiry/{id}/escalate` | Escalate to human agent. Accepts a reason field. |
| GET | `/enquiry/{id}/history` | Full conversation thread + status timeline + follow-ups. |
| GET | `/health` | API status + database connectivity check. |
 
## Database: SQLite
 
Chosen over PostgreSQL because it needs zero setup — no server, no Docker, no credentials. The entire project runs with one command. The SQLite file `closira.db` is created automatically on first run.
 
To switch to PostgreSQL, change one line in `database.py`:
```python
DATABASE_URL = "postgresql://user:password@localhost/closira"
```
 
### Tables
 
- `enquiries` — one row per inbound customer message. Tracks status, matched SOP, suggested response, escalation reason.
- `messages` — conversation thread. Stores the customer's message and the AI's suggested reply separately with a sender field.
- `status_timeline` — every status change logged with a timestamp and a human-readable note.
- `follow_ups` — scheduled follow-ups with delay in minutes, message template, and calculated scheduled_at time.
## Background Task: FastAPI BackgroundTasks (not Celery)
 
After a new enquiry is created, a background task runs immediately to match the message against 5 hardcoded SOPs.
 
**Why BackgroundTasks and not Celery:**  
Celery requires a Redis or RabbitMQ broker plus a separate worker process. For this scope the SOP matching task is fast, lightweight, and doesn't need retries or distributed execution. BackgroundTasks keeps the whole project runnable with one command — which matters for evaluation. If Closira moves to production with high message volume or needs actual follow-up delivery at scheduled times, Celery + Redis would be the right upgrade.
 
## SOP Matching Logic
 
5 SOPs matched by keyword against the lowercased inbound message:
 
| SOP | Trigger Keywords |
|-----|-----------------|
| Booking Enquiry | book, appointment, schedule, slot, reserve, availability |
| Pricing Question | price, pricing, cost, fee, how much, plan, subscription, rate |
| Complaint | complaint, unhappy, issue, problem, refund, upset, angry, disappointed |
| After-Hours Message | after hours, closed, weekend, holiday, night, business hours |
| General Support | help, support, assist, question, query, info, information, details |
 
If no SOP matches → enquiry status is set to `escalated` and the event is logged.
 
## Structured JSON Logging
 
Every key event emits a JSON log line to stdout:
 
```json
{"timestamp": "2026-05-23T17:09:58Z", "level": "INFO", "logger": "closira.main", "message": "Enquiry created", "enquiry_id": "enq_a1b2c3d4", "channel": "whatsapp"}
```
 
Events logged: enquiry created, task started, SOP matched, auto-escalated, follow-up scheduled, manual escalation.
 
## Trade-offs
 
- **SQLite over PostgreSQL**: Zero-setup wins for evaluation speed, but loses on concurrent writes and no connection pooling. Swap to PostgreSQL before any real traffic.
- **BackgroundTasks over Celery**: Single-process simplicity wins for this scope, but task failures are silent — no retry queue, no dead-letter logging. Celery + Redis is the right upgrade path for production.
- **Keyword SOP matching over ML/embeddings**: Fast and fully deterministic. No model dependencies. The trade-off is brittleness — "I don't want to book" would still match the Booking SOP. A production system would use a lightweight classifier or semantic embeddings.
- **No tenant isolation**: All enquiries share a single implicit business context. A `business_id` column is the obvious next addition before onboarding multiple SMB clients.
## Known Limitations
 
1. Follow-ups are stored in the database with a `scheduled_at` time but are never actually sent. A real system would need a scheduler (Celery Beat or cron) to dispatch them.
2. SOP matching is keyword-only. "I don't want to book" would still match the Booking SOP.
3. SQLite does not handle high concurrent writes well. Swap to PostgreSQL before any real traffic.
4. No tenant isolation — all enquiries belong to a single implicit business. A `business_id` column should be added to `enquiries` before supporting multiple SMB clients.
 
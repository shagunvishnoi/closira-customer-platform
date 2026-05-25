from datetime import datetime, timedelta
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import engine, SessionLocal, get_db, Base
from models import Enquiry, StatusTimeline, Message, FollowUp
from schemas import (
    EnquiryCreate, EnquiryCreatedResponse,
    FollowUpCreate, FollowUpResponse,
    EscalateCreate, EscalateResponse,
    EnquiryHistory, TimelineEntry, MessageEntry, FollowUpEntry,
    HealthResponse,
)
from tasks import process_enquiry
from logging_config import get_logger

logger = get_logger("closira.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    logger.info("Closira API started — database tables ensured")
    yield
    logger.info("Closira API shutting down")


from fastapi.responses import RedirectResponse

app = FastAPI(
    title="Closira Enquiry API",
    description=(
        "REST API powering Closira's inbound customer enquiry pipeline. "
        "Handles enquiry creation, SOP-based auto-responses, follow-up scheduling, "
        "human escalation, and full conversation history."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/", include_in_schema=False)
async def root_redirect():
    return RedirectResponse(url="/docs")


@app.post(
    "/enquiry",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a new inbound enquiry",
    description="Accepts an inbound customer enquiry. Returns a job ID immediately — SOP matching runs in the background.",
    tags=["Enquiries"],
)
def create_enquiry(
    body: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    enquiry = Enquiry(
        channel=body.channel,
        customer_name=body.customer_name,
        message=body.message,
        status="pending",
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    customer_msg = Message(
        enquiry_id=enquiry.id,
        sender="customer",
        content=body.message,
    )
    db.add(customer_msg)

    timeline_entry = StatusTimeline(
        enquiry_id=enquiry.id,
        status="pending",
        note=f"Enquiry received via {body.channel}",
    )
    db.add(timeline_entry)
    db.commit()

    background_tasks.add_task(process_enquiry, enquiry.id, SessionLocal)

    logger.info(
        "Enquiry created",
        extra={"enquiry_id": enquiry.id, "channel": body.channel, "customer": body.customer_name},
    )

    return EnquiryCreatedResponse(
        job_id=enquiry.id,
        message="Enquiry received. Processing in background.",
        status=enquiry.status,
    )


@app.post(
    "/enquiry/{id}/follow-up",
    response_model=FollowUpResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a follow-up for an enquiry",
    description="Schedules a follow-up for an open enquiry. Accepts delay in minutes and an optional message template.",
    tags=["Enquiries"],
)
def schedule_followup(
    id: str,
    body: FollowUpCreate,
    db: Session = Depends(get_db),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{id}' not found.")

    if enquiry.status == "resolved":
        raise HTTPException(status_code=409, detail="Cannot schedule a follow-up for a resolved enquiry.")

    scheduled_at = datetime.utcnow() + timedelta(minutes=body.delay_minutes)
    template = body.message_template or f"Hi {enquiry.customer_name}, just following up on your enquiry!"

    follow_up = FollowUp(
        enquiry_id=id,
        delay_minutes=str(body.delay_minutes),
        message_template=template,
        scheduled_at=scheduled_at,
    )
    db.add(follow_up)

    enquiry.status = "follow_up_scheduled"
    enquiry.updated_at = datetime.utcnow()

    timeline_entry = StatusTimeline(
        enquiry_id=id,
        status="follow_up_scheduled",
        note=f"Follow-up scheduled in {body.delay_minutes} minutes.",
    )
    db.add(timeline_entry)
    db.commit()
    db.refresh(follow_up)

    logger.info("Follow-up scheduled", extra={"enquiry_id": id, "delay_minutes": body.delay_minutes})

    return FollowUpResponse(
        follow_up_id=follow_up.id,
        enquiry_id=id,
        scheduled_at=scheduled_at,
        message_template=template,
    )


@app.post(
    "/enquiry/{id}/escalate",
    response_model=EscalateResponse,
    status_code=status.HTTP_200_OK,
    summary="Escalate an enquiry to a human agent",
    description="Marks an enquiry as escalated. Accepts a reason field and updates the status timeline.",
    tags=["Enquiries"],
)
def escalate_enquiry(
    id: str,
    body: EscalateCreate,
    db: Session = Depends(get_db),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{id}' not found.")

    if enquiry.status == "escalated":
        raise HTTPException(status_code=409, detail="Enquiry is already escalated.")

    enquiry.status = "escalated"
    enquiry.escalation_reason = body.reason
    enquiry.updated_at = datetime.utcnow()

    timeline_entry = StatusTimeline(
        enquiry_id=id,
        status="escalated",
        note=f"Manually escalated. Reason: {body.reason}",
    )
    db.add(timeline_entry)
    db.commit()

    logger.warning("Enquiry escalated", extra={"enquiry_id": id, "reason": body.reason})

    return EscalateResponse(
        enquiry_id=id,
        status="escalated",
        reason=body.reason,
        message="Enquiry has been escalated to a human agent.",
    )


@app.get(
    "/enquiry/{id}/history",
    response_model=EnquiryHistory,
    status_code=status.HTTP_200_OK,
    summary="Get full conversation history and status timeline",
    description="Returns the full conversation thread, status timeline, and follow-ups for a given enquiry.",
    tags=["Enquiries"],
)
def get_enquiry_history(
    id: str,
    db: Session = Depends(get_db),
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == id).first()
    if not enquiry:
        raise HTTPException(status_code=404, detail=f"Enquiry '{id}' not found.")

    return EnquiryHistory(
        enquiry_id=enquiry.id,
        customer_name=enquiry.customer_name,
        channel=enquiry.channel,
        status=enquiry.status,
        sop_matched=enquiry.sop_matched,
        suggested_response=enquiry.suggested_response,
        escalation_reason=enquiry.escalation_reason,
        created_at=enquiry.created_at,
        messages=[
            MessageEntry(sender=m.sender, content=m.content, timestamp=m.created_at)
            for m in sorted(enquiry.messages, key=lambda m: m.created_at)
        ],
        timeline=[
            TimelineEntry(status=t.status, note=t.note, timestamp=t.created_at)
            for t in sorted(enquiry.timeline, key=lambda t: t.created_at)
        ],
        follow_ups=[
            FollowUpEntry(
                delay_minutes=f.delay_minutes,
                message_template=f.message_template,
                scheduled_at=f.scheduled_at,
            )
            for f in enquiry.follow_ups
        ],
    )


@app.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Returns API status and database connectivity. Use for uptime monitoring.",
    tags=["System"],
)
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        logger.error("Database health check failed", extra={"error": str(exc)})
        db_status = "unavailable"

    return HealthResponse(
        status="ok" if db_status == "connected" else "degraded",
        database=db_status,
        version="1.0.0",
    )
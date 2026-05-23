from datetime import datetime
from sqlalchemy.orm import Session
from logging_config import get_logger
from models import Enquiry, StatusTimeline, Message

logger = get_logger("closira.tasks")

SOPS = [
    {
        "name": "Booking Enquiry",
        "keywords": ["book", "appointment", "schedule", "slot", "reserve", "availability"],
        "response": (
            "Thanks for reaching out! We'd love to help you book an appointment. "
            "Please share your preferred date and time and we'll confirm within 24 hours."
        ),
    },
    {
        "name": "Pricing Question",
        "keywords": ["price", "pricing", "cost", "fee", "how much", "plan", "subscription", "rate"],
        "response": (
            "Great question! Our pricing starts from ₹999/month for the Starter plan. "
            "Reply here and we'll send you a tailored proposal."
        ),
    },
    {
        "name": "Complaint",
        "keywords": ["complaint", "unhappy", "issue", "problem", "refund", "upset", "angry", "disappointed", "terrible"],
        "response": (
            "We're really sorry to hear about your experience. "
            "A senior team member will personally review your case and contact you within 2 hours."
        ),
    },
    {
        "name": "After-Hours Message",
        "keywords": ["after hours", "closed", "weekend", "holiday", "night", "business hours", "working hours"],
        "response": (
            "Thank you for your message! Our team is currently outside business hours (Mon–Fri, 9 AM–6 PM). "
            "We'll get back to you first thing on the next business day."
        ),
    },
    {
        "name": "General Support",
        "keywords": ["help", "support", "assist", "question", "query", "info", "information", "details"],
        "response": (
            "Thanks for getting in touch! Our support team is here to help. "
            "Could you share a bit more detail? We'll get back to you shortly."
        ),
    },
]


def _match_sop(message: str):
    msg_lower = message.lower()
    for sop in SOPS:
        if any(kw in msg_lower for kw in sop["keywords"]):
            return sop
    return None


def _add_timeline(db: Session, enquiry_id: str, status: str, note: str):
    entry = StatusTimeline(enquiry_id=enquiry_id, status=status, note=note)
    db.add(entry)
    db.commit()


def process_enquiry(enquiry_id: str, db_factory) -> None:
    db: Session = db_factory()
    try:
        enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
        if not enquiry:
            logger.error("Enquiry not found", extra={"enquiry_id": enquiry_id})
            return

        enquiry.status = "processing"
        _add_timeline(db, enquiry_id, "processing", "Background task started")
        logger.info("Processing enquiry", extra={"enquiry_id": enquiry_id})

        sop = _match_sop(enquiry.message)

        if sop:
            enquiry.status = "sop_matched"
            enquiry.sop_matched = sop["name"]
            enquiry.suggested_response = sop["response"]
            enquiry.updated_at = datetime.utcnow()
            db.commit()

            ai_msg = Message(
                enquiry_id=enquiry_id,
                sender="ai",
                content=sop["response"],
            )
            db.add(ai_msg)
            db.commit()

            _add_timeline(db, enquiry_id, "sop_matched", f"SOP matched: {sop['name']}")
            logger.info("SOP matched", extra={"enquiry_id": enquiry_id, "sop": sop["name"]})

        else:
            enquiry.status = "escalated"
            enquiry.escalation_reason = "No SOP matched. Flagged for human review."
            enquiry.updated_at = datetime.utcnow()
            db.commit()

            _add_timeline(db, enquiry_id, "escalated", "Auto-escalated: no SOP matched.")
            logger.warning("No SOP matched — auto-escalated", extra={"enquiry_id": enquiry_id})

    except Exception as exc:
        logger.error("Error in background task", extra={"enquiry_id": enquiry_id, "error": str(exc)})
        db.rollback()
    finally:
        db.close()
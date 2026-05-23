import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(String, primary_key=True, default=lambda: f"enq_{uuid.uuid4().hex[:8]}")
    customer_name = Column(String(120), nullable=False)
    channel = Column(String(20), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="pending")
    sop_matched = Column(String(80), nullable=True)
    suggested_response = Column(Text, nullable=True)
    escalation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    timeline = relationship("StatusTimeline", back_populates="enquiry", cascade="all, delete-orphan")
    messages = relationship("Message", back_populates="enquiry", cascade="all, delete-orphan")
    follow_ups = relationship("FollowUp", back_populates="enquiry", cascade="all, delete-orphan")


class StatusTimeline(Base):
    __tablename__ = "status_timeline"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(String, ForeignKey("enquiries.id"), nullable=False)
    status = Column(String(30), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    enquiry = relationship("Enquiry", back_populates="timeline")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(String, ForeignKey("enquiries.id"), nullable=False)
    sender = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    enquiry = relationship("Enquiry", back_populates="messages")


class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    enquiry_id = Column(String, ForeignKey("enquiries.id"), nullable=False)
    delay_minutes = Column(String(10), nullable=False)
    message_template = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    enquiry = relationship("Enquiry", back_populates="follow_ups")
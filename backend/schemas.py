from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class EnquiryCreate(BaseModel):
    channel: str = Field(
        ...,
        description="Inbound channel. One of: whatsapp, email, call",
        example="whatsapp",
        pattern="^(whatsapp|email|call)$",
    )
    customer_name: str = Field(
        ...,
        description="Full name of the customer",
        example="Sarah Mitchell",
        min_length=1,
        max_length=120,
    )
    message: str = Field(
        ...,
        description="The customer's raw inbound message",
        example="Hi I want to know your pricing for the premium plan",
        min_length=1,
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "channel": "whatsapp",
                "customer_name": "Sarah Mitchell",
                "message": "Hi I want to know your pricing for the premium plan"
            }]
        }
    }


class EnquiryCreatedResponse(BaseModel):
    job_id: str
    message: str
    status: str


class FollowUpCreate(BaseModel):
    delay_minutes: int = Field(
        ...,
        description="Delay in minutes before the follow-up is sent",
        example=30,
        ge=1,
        le=10080,
    )
    message_template: Optional[str] = Field(
        None,
        description="Optional follow-up message template",
        example="Hi {customer_name}, just following up on your enquiry!",
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "delay_minutes": 30,
                "message_template": "Hi {customer_name}, just following up on your enquiry!"
            }]
        }
    }


class FollowUpResponse(BaseModel):
    follow_up_id: str
    enquiry_id: str
    scheduled_at: datetime
    message_template: Optional[str]


class EscalateCreate(BaseModel):
    reason: str = Field(
        ...,
        description="Reason for escalating to a human agent",
        example="Customer called back and is very upset, requesting immediate refund.",
        min_length=1,
    )

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "reason": "Customer called back and is very upset, requesting immediate refund."
            }]
        }
    }


class EscalateResponse(BaseModel):
    enquiry_id: str
    status: str
    reason: str
    message: str


class TimelineEntry(BaseModel):
    status: str
    note: Optional[str]
    timestamp: datetime

    model_config = {"from_attributes": True}


class MessageEntry(BaseModel):
    sender: str
    content: str
    timestamp: datetime

    model_config = {"from_attributes": True}


class FollowUpEntry(BaseModel):
    delay_minutes: str
    message_template: Optional[str]
    scheduled_at: datetime

    model_config = {"from_attributes": True}


class EnquiryHistory(BaseModel):
    enquiry_id: str
    customer_name: str
    channel: str
    status: str
    sop_matched: Optional[str]
    suggested_response: Optional[str]
    escalation_reason: Optional[str]
    created_at: datetime
    messages: List[MessageEntry]
    timeline: List[TimelineEntry]
    follow_ups: List[FollowUpEntry]


class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
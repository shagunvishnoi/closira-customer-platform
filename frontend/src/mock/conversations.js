export const conversations = {
    enq_001: {
      messages: [
        { id: "m1", sender: "customer", content: "Hi I want to know your pricing for the premium plan", timestamp: "2025-05-20T09:14:00Z" },
        { id: "m2", sender: "ai", content: "Great question! Our pricing starts from ₹999/month for the Starter plan. Reply here and we'll send you a tailored proposal.", timestamp: "2025-05-20T09:14:05Z" },
        { id: "m3", sender: "customer", content: "That's too expensive. I want to speak to a manager.", timestamp: "2025-05-20T09:15:00Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via whatsapp", timestamp: "2025-05-20T09:14:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-20T09:14:01Z" },
        { status: "sop_matched", note: "SOP matched: Pricing Question", timestamp: "2025-05-20T09:14:03Z" },
        { status: "escalated", note: "Manually escalated: Customer unhappy with quote", timestamp: "2025-05-20T09:15:30Z" },
      ],
    },
    enq_002: {
      messages: [
        { id: "m1", sender: "customer", content: "I want to book an appointment for next Monday", timestamp: "2025-05-20T08:30:00Z" },
        { id: "m2", sender: "ai", content: "Thanks for reaching out! We'd love to help you book an appointment. Please share your preferred date and time and we'll confirm within 24 hours.", timestamp: "2025-05-20T08:30:04Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via email", timestamp: "2025-05-20T08:30:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-20T08:30:01Z" },
        { status: "sop_matched", note: "SOP matched: Booking Enquiry", timestamp: "2025-05-20T08:30:03Z" },
        { status: "qualified", note: "Lead qualified automatically", timestamp: "2025-05-20T08:31:00Z" },
      ],
    },
    enq_003: {
      messages: [
        { id: "m1", sender: "customer", content: "I am very upset and want a refund immediately", timestamp: "2025-05-20T07:55:00Z" },
        { id: "m2", sender: "ai", content: "We're really sorry to hear about your experience. A senior team member will personally review your case and contact you within 2 hours.", timestamp: "2025-05-20T07:55:04Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via call", timestamp: "2025-05-20T07:55:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-20T07:55:01Z" },
        { status: "sop_matched", note: "SOP matched: Complaint", timestamp: "2025-05-20T07:55:03Z" },
        { status: "escalated", note: "Auto-escalated: Complaint detected", timestamp: "2025-05-20T07:56:00Z" },
      ],
    },
    enq_004: {
      messages: [
        { id: "m1", sender: "customer", content: "Hey I need some help with my account", timestamp: "2025-05-20T10:02:00Z" },
        { id: "m2", sender: "ai", content: "Thanks for getting in touch! Our support team is here to help. Could you share a bit more detail? We'll get back to you shortly.", timestamp: "2025-05-20T10:02:04Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via whatsapp", timestamp: "2025-05-20T10:02:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-20T10:02:01Z" },
        { status: "sop_matched", note: "SOP matched: General Support", timestamp: "2025-05-20T10:02:03Z" },
      ],
    },
    enq_005: {
      messages: [
        { id: "m1", sender: "customer", content: "zvxqpqr random gibberish test", timestamp: "2025-05-20T10:45:00Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via email", timestamp: "2025-05-20T10:45:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-20T10:45:01Z" },
        { status: "escalated", note: "Auto-escalated: No SOP matched. Flagged for human review.", timestamp: "2025-05-20T10:45:30Z" },
      ],
    },
    enq_006: {
      messages: [
        { id: "m1", sender: "customer", content: "Calling after hours about my subscription renewal", timestamp: "2025-05-19T22:10:00Z" },
        { id: "m2", sender: "ai", content: "We've received your message! Our team is currently outside business hours (9 AM – 6 PM). We'll get back to you first thing on the next business day.", timestamp: "2025-05-19T22:10:04Z" },
      ],
      timeline: [
        { status: "pending", note: "Enquiry received via call", timestamp: "2025-05-19T22:10:00Z" },
        { status: "processing", note: "Background task started", timestamp: "2025-05-19T22:10:01Z" },
        { status: "sop_matched", note: "SOP matched: After-Hours Message", timestamp: "2025-05-19T22:10:03Z" },
        { status: "qualified", note: "After-hours response sent", timestamp: "2025-05-19T22:10:45Z" },
      ],
    },
  };
  
  export const getConversation = (id) => conversations[id] || { messages: [], timeline: [] };
  
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_WELCOME_TEMPLATE_ID,
  EMAILJS_BOOKING_TEMPLATE_ID,
} from "../config/emailConfig";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

async function sendEmail(templateId: string, templateParams: Record<string, string>) {
  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.warn(`Email send failed (${response.status}): ${text}`);
    }
  } catch (err: any) {
    // Emailing is a nice-to-have — never let a failed send block
    // registration or booking from completing.
    console.warn("Email send error:", err.message);
  }
}

export function sendWelcomeEmail(toEmail: string, toName: string) {
  return sendEmail(EMAILJS_WELCOME_TEMPLATE_ID, {
    to_email: toEmail,
    to_name: toName || "there",
  });
}

export function sendBookingConfirmationEmail(params: {
  toEmail: string;
  toName: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  return sendEmail(EMAILJS_BOOKING_TEMPLATE_ID, {
    to_email: params.toEmail,
    to_name: params.toName || "there",
    car_name: params.carName,
    start_date: new Date(params.startDate).toDateString(),
    end_date: new Date(params.endDate).toDateString(),
    total_price: String(params.totalPrice),
  });
}

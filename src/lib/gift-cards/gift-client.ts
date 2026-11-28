import { BLACK_FRIDAY_2026 } from "./config";
import type { GiftSubmit } from "@/components/gift-cards/GiftingForm";

async function post(operation: "gift" | "later", body: unknown) {
  const response = await fetch(`/api/black-friday/${operation}`, { method: "POST", credentials: "same-origin", cache: "no-store",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { response, data: await response.json() as Record<string, unknown> };
}
const uncertain = "We couldn't confirm delivery. Please don't resend. Call Rella at 707.358.2928 so we can check it.";
export function giftSubmitFor(token: string): GiftSubmit {
  return async values => {
    try {
      const { response, data } = await post("gift", { token, ...values });
      if (response.ok && data.status === "sent" && typeof data.recipientFirstName === "string") return { status: "sent", recipientFirstName: data.recipientFirstName };
      if (data.status === "invalid-input" && data.errors && typeof data.errors === "object") return { status: "invalid-input", errors: data.errors as Record<string, string> };
      return { status: "error", retryable: data.status === "send-failed", message: data.status === "send-failed" ? "The email provider did not accept the message. You can try again or call Rella." : uncertain };
    } catch { return { status: "error", message: uncertain }; }
  };
}
export function sendLaterFor(token: string) {
  return async () => {
    try {
      const { response, data } = await post("later", { token });
      return response.ok && data.status === "awaiting_recipient"
        ? { ok: true, message: data.emailSent === true ? "Your private gifting link is in your purchase confirmation email. Send your pass whenever the moment is right."
          : "Your pass is saved. Email delivery has not been confirmed; keep your private gifting link below.",
          recoveryUrl: new URL(`/gift-cards/gift/${encodeURIComponent(token)}`, BLACK_FRIDAY_2026.bookingUrl).href }
        : { ok: false, message: "We couldn't confirm that the send-later choice was saved. Please keep this page and call Rella." };
    } catch { return { ok: false, message: "We couldn't confirm that the send-later choice was saved. Please keep this page and call Rella." }; }
  };
}

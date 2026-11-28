import { createHmac } from "node:crypto";
import type { LeadChannelMatches, LeadConsent, LeadInquiry, LeadReplyContact, VerifiedLeadReceipt } from "./lead-consent";

// Fixed server destination: a form value or redirect can never select a host.
export const HQ_WEBSITE_INQUIRY_ENDPOINT = "https://rella-hq.vercel.app/api/integrations/lead-inbox/website";

export class LeadHqDeliveryError extends Error {
  constructor(readonly stage: "hq_configuration" | "hq_delivery" | "hq_readback") {
    super(`${stage} unverified`);
    this.name = "LeadHqDeliveryError";
  }
}

export function leadHqConfigured(): boolean {
  const secret = process.env.LEAD_INBOX_WEBSITE_WEBHOOK_SECRET ?? "";
  return secret.length >= 32 && secret === secret.trim();
}

/** Called only after exact GHL receipt readback. Never automatically replays. */
export async function deliverLeadToHq(input: {
  receipt: VerifiedLeadReceipt;
  contactId: string;
  locationId: string;
  choice: LeadConsent;
  replyContact: LeadReplyContact;
  channelMatches: LeadChannelMatches;
  inquiry: LeadInquiry;
}): Promise<void> {
  if (!leadHqConfigured()) throw new LeadHqDeliveryError("hq_configuration");
  const rawBody = JSON.stringify({
    receiptVersion: 3,
    receiptId: input.receipt.receiptId,
    recordedAt: input.receipt.recordedAt,
    ghlContactId: input.contactId,
    ghlLocationId: input.locationId,
    ghlNoteId: input.receipt.noteId,
    operational: input.choice.operational,
    marketing: input.choice.marketing,
    replyContact: input.replyContact,
    channelMatches: input.channelMatches,
    inquiry: input.inquiry,
  });
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  const signature = createHmac("sha256", process.env.LEAD_INBOX_WEBSITE_WEBHOOK_SECRET!)
    .update(`${timestamp}.${rawBody}`, "utf8").digest("hex");
  let response: Response;
  try {
    response = await fetch(HQ_WEBSITE_INQUIRY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rella-lead-timestamp": timestamp,
        "x-rella-lead-signature": `v1=${signature}`,
      },
      body: rawBody,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new LeadHqDeliveryError("hq_delivery");
  }
  if (response.status !== 200) throw new LeadHqDeliveryError("hq_delivery");
  const rawResult: unknown = await response.json().catch(() => null);
  const result = rawResult && typeof rawResult === "object" ? rawResult as Record<string, unknown> : null;
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!result || result.ok !== true || result.receiptId !== input.receipt.receiptId
    || result.recipient !== "ayano"
    || (result.outcome !== "processed" && result.outcome !== "duplicate")
    || !["threadId", "eventId", "notificationId"].every(key => typeof result[key] === "string"
      && uuid.test(result[key] as string))) {
    throw new LeadHqDeliveryError("hq_readback");
  }
}

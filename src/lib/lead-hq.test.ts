import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverLeadToHq, HQ_WEBSITE_INQUIRY_ENDPOINT, leadHqConfigured } from "./lead-hq";

const secret = "synthetic-only-webhook-secret-at-least-32-characters";
const id = "87a29220-d242-4970-bef2-db8ae986bd92";
const input = {
  receipt: { receiptId: "a".repeat(64), noteId: "verified-note", recordedAt: "2026-10-19T16:39:20.640Z" },
  contactId: "c".repeat(20), locationId: "l".repeat(20),
  choice: { policyVersion: "rella-booking-consent-2026-10-19-v2" as const, operational: false, marketing: false },
  replyContact: { email: "synthetic@example.test", phone: null },
  channelMatches: { email: true, phone: false },
  inquiry: { name: "Synthetic Test", serviceInterest: "Membership Questions", clinicPreference: "Napa", message: "Synthetic inquiry only." },
};
const accepted = { ok: true, receiptId: input.receipt.receiptId, recipient: "ayano", outcome: "processed",
  threadId: id, eventId: id, notificationId: id };

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("verified website inquiry delivery to HQ", () => {
  it.each(["", "short", ` ${secret}`, `${secret}\n`])("rejects unavailable or malformed configuration before delivery", async value => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", value);
    const transport = vi.fn(); vi.stubGlobal("fetch", transport);
    expect(leadHqConfigured()).toBe(false);
    await expect(deliverLeadToHq(input)).rejects.toMatchObject({ stage: "hq_configuration" });
    expect(transport).not.toHaveBeenCalled();
  });

  it("signs the exact immutable receipt, uses only the fixed HTTPS endpoint and verifies Ayano's persisted event", async () => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", secret);
    vi.spyOn(Date, "now").mockReturnValue(1792427960640);
    const transport = vi.fn().mockResolvedValue(Response.json(accepted)); vi.stubGlobal("fetch", transport);
    await deliverLeadToHq(input);
    expect(transport).toHaveBeenCalledTimes(1);
    const [url, request] = transport.mock.calls[0];
    expect(url).toBe(HQ_WEBSITE_INQUIRY_ENDPOINT);
    expect(request).toMatchObject({ method: "POST", redirect: "manual", cache: "no-store" });
    const body = JSON.parse(request.body);
    expect(body).toEqual({ receiptVersion: 3, receiptId: input.receipt.receiptId, recordedAt: input.receipt.recordedAt,
      ghlContactId: input.contactId, ghlLocationId: input.locationId, ghlNoteId: input.receipt.noteId,
      operational: false, marketing: false, replyContact: input.replyContact, channelMatches: input.channelMatches, inquiry: input.inquiry });
    const timestamp = request.headers["x-rella-lead-timestamp"];
    expect(request.headers["x-rella-lead-signature"]).toBe(`v1=${createHmac("sha256", secret).update(`${timestamp}.${request.body}`).digest("hex")}`);
    expect(Object.values(request.headers)).not.toContain(secret);
    expect(body).not.toHaveProperty("contactOwner");
  });

  it("accepts the same persisted event on an explicit duplicate submission", async () => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", secret);
    const transport = vi.fn().mockResolvedValue(Response.json({ ...accepted, outcome: "duplicate" })); vi.stubGlobal("fetch", transport);
    await expect(deliverLeadToHq(input)).resolves.toBeUndefined();
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it.each([
    {}, { ...accepted, receiptId: "b".repeat(64) }, { ...accepted, recipient: "sandra" },
    { ...accepted, notificationId: null }, { ...accepted, eventId: "queued" },
    { ...accepted, outcome: "queued" }, { ...accepted, ok: false },
  ])("does not claim delivery for an unverified HQ acknowledgement", async result => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", secret);
    const transport = vi.fn().mockResolvedValue(Response.json(result)); vi.stubGlobal("fetch", transport);
    await expect(deliverLeadToHq(input)).rejects.toMatchObject({ stage: "hq_readback" });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it.each([202, 301, 400, 401, 409, 503])("keeps HTTP %s pending without redirecting or replaying", async status => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", secret);
    const transport = vi.fn().mockResolvedValue(Response.json(accepted, { status })); vi.stubGlobal("fetch", transport);
    await expect(deliverLeadToHq(input)).rejects.toMatchObject({ stage: "hq_delivery" });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("does not replay a lost response or expose the transport error", async () => {
    vi.stubEnv("LEAD_INBOX_WEBSITE_WEBHOOK_SECRET", secret);
    const transport = vi.fn().mockRejectedValue(new Error("private payload / secret")); vi.stubGlobal("fetch", transport);
    await expect(deliverLeadToHq(input)).rejects.toMatchObject({ name: "LeadHqDeliveryError", message: "hq_delivery unverified" });
    expect(transport).toHaveBeenCalledTimes(1);
  });
});

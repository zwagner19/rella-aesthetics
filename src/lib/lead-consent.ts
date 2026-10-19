import { createHash } from "node:crypto";
import { GHL_API_BASE } from "./ghl";
import { CONTACT_CONSENT_POLICIES } from "./guided-booking/policies";

export interface LeadConsent {
  policyVersion: keyof typeof CONTACT_CONSENT_POLICIES;
  operational: boolean;
  marketing: boolean;
}

export interface LeadReplyContact {
  email: string | null;
  phone: string | null;
}

export interface LeadChannelMatches {
  email: boolean;
  phone: boolean;
}

export interface LeadInquiry {
  name: string;
  serviceInterest: string;
  clinicPreference: string;
  message: string;
}

export interface VerifiedLeadReceipt {
  receiptId: string;
  noteId: string;
}

export class LeadReceiptSignalError extends Error {
  constructor(readonly stage: "receipt_marker_input" | "receipt_marker_lookup" | "receipt_marker_update" | "receipt_marker_readback") {
    super(`${stage} unverified`);
    this.name = "LeadReceiptSignalError";
  }
}

export function validLeadReceiptField(fieldId: string, otherFieldIds: string[]): boolean {
  return /^[A-Za-z0-9]{20}$/.test(fieldId) && !otherFieldIds.includes(fieldId);
}

/** New submission tags do not revoke or overwrite an existing patient's consent. */
export function leadConsentTags(choice: LeadConsent): string[] {
  return ["website-contact-request",
    ...(choice.operational ? ["website-contact-operational-consent"] : []),
    ...(choice.marketing ? ["website-contact-marketing-opt-in"] : [])];
}

export function readLeadConsent(value: unknown, phoneProvided: boolean): LeadConsent | null {
  const choice = value as Partial<LeadConsent> | null;
  if (!choice || typeof choice.policyVersion !== "string" || !Object.hasOwn(CONTACT_CONSENT_POLICIES, choice.policyVersion) || typeof choice.operational !== "boolean"
    || typeof choice.marketing !== "boolean" || (phoneProvided && !choice.operational)
    || (!phoneProvided && choice.marketing)) return null;
  return { policyVersion: choice.policyVersion, operational: choice.operational, marketing: choice.marketing };
}

/**
 * Called only with the contact identity returned by a verified server upsert.
 * Note lookup/create is not atomic across instances and makes no exactly-once
 * guarantee. Staff routing uses a separate marker only after exact readback.
 */
export async function persistLeadConsent(input: {
  contactId: string; submissionId: string; choice: LeadConsent; phoneProvided: boolean; headers: Record<string, string>;
  replyContact: LeadReplyContact; channelMatches: LeadChannelMatches;
  inquiry: LeadInquiry;
}): Promise<VerifiedLeadReceipt> {
  const policy = CONTACT_CONSENT_POLICIES[input.choice.policyVersion];
  if (!policy) throw new Error("Unknown consent policy");
  const policyHash = createHash("sha256").update(JSON.stringify([policy.operational, policy.marketing])).digest("hex");
  const receiptId = createHash("sha256").update(`${input.contactId}/${input.submissionId}`).digest("hex");
  const base = `${GHL_API_BASE}/contacts/${encodeURIComponent(input.contactId)}/notes`;
  const request = (url: string, init?: RequestInit) => fetch(url, {
    ...init, headers: input.headers, cache: "no-store", signal: AbortSignal.timeout(8_000),
  });
  const list = await request(base);
  const listed = await list.json();
  if (!list.ok || !Array.isArray(listed.notes)) throw new Error("Consent note lookup unavailable");

  function matches(body: unknown): body is string {
    if (typeof body !== "string") return false;
    try {
      const receipt = JSON.parse(body);
      return receipt.type === "rella-contact-consent" && receipt.receiptId === receiptId
        && receipt.receiptVersion === 3
        && receipt.source === "/contact"
        && receipt.policyVersion === input.choice.policyVersion && receipt.operational === input.choice.operational
        && receipt.marketing === input.choice.marketing && receipt.phoneProvided === input.phoneProvided
        && receipt.replyContact?.email === input.replyContact.email && receipt.replyContact?.phone === input.replyContact.phone
        && receipt.channelMatches?.email === input.channelMatches.email && receipt.channelMatches?.phone === input.channelMatches.phone
        && receipt.inquiry?.name === input.inquiry.name && receipt.inquiry?.serviceInterest === input.inquiry.serviceInterest
        && receipt.inquiry?.clinicPreference === input.inquiry.clinicPreference && receipt.inquiry?.message === input.inquiry.message
        && receipt.policyHash === policyHash && typeof receipt.recordedAt === "string" && Number.isFinite(Date.parse(receipt.recordedAt));
    } catch { return false; }
  }
  const existing = listed.notes.find((note: { body?: unknown }) => {
    if (typeof note?.body !== "string") return false;
    try { return JSON.parse(note.body).receiptId === receiptId; } catch { return false; }
  });
  let body: string;
  let id: string;
  if (existing) {
    if (typeof existing.id !== "string" || !existing.id) throw new Error("Consent note identity unverified");
    if (!matches(existing.body)) throw new Error("Consent retry differs from saved receipt");
    body = existing.body;
    id = existing.id;
  } else {
    body = JSON.stringify({ type: "rella-contact-consent", receiptVersion: 3, receiptId, ...input.choice,
      phoneProvided: input.phoneProvided, replyContact: input.replyContact, channelMatches: input.channelMatches,
      inquiry: input.inquiry,
      policyHash, recordedAt: new Date().toISOString(), source: "/contact" });
    const created = await request(base, { method: "POST", body: JSON.stringify({ body }) });
    const saved = await created.json();
    if (!created.ok || typeof saved.note?.id !== "string" || !saved.note.id) throw new Error("Consent note creation unverified");
    id = saved.note.id;
  }
  const readback = await request(`${base}/${encodeURIComponent(id)}`);
  const saved = await readback.json();
  if (!readback.ok || saved.note?.id !== id || saved.note?.contactId !== input.contactId
    || saved.note?.body !== body || !matches(saved.note.body)) throw new Error("Consent note readback unverified");
  return { receiptId, noteId: id };
}

/**
 * The dedicated field signals an internal review of immutable receipt notes.
 * It is deliberately excluded from upsert, which runs before receipt readback.
 * Workflow re-entry cannot guarantee every rapid request while a contact is
 * already active. The mutable marker is never the inquiry content itself.
 */
export async function signalLeadReceipt(input: {
  contactId: string; locationId: string; fieldId: string;
  receipt: VerifiedLeadReceipt; headers: Record<string, string>;
}): Promise<void> {
  if (!validLeadReceiptField(input.fieldId, []) || !/^[a-f0-9]{64}$/.test(input.receipt.receiptId)
    || !input.receipt.noteId) throw new LeadReceiptSignalError("receipt_marker_input");
  const url = `${GHL_API_BASE}/contacts/${encodeURIComponent(input.contactId)}`;
  const request = (init?: RequestInit) => fetch(url, {
    ...init, headers: input.headers, cache: "no-store", signal: AbortSignal.timeout(8_000),
  });
  function marker(result: unknown, stage: "receipt_marker_lookup" | "receipt_marker_readback"): string | null {
    if (!result || typeof result !== "object" || !("contact" in result)) throw new LeadReceiptSignalError(stage);
    const contact = result.contact;
    if (!contact || typeof contact !== "object" || !("id" in contact) || contact.id !== input.contactId
      || !("locationId" in contact) || contact.locationId !== input.locationId
      || !("customFields" in contact) || !Array.isArray(contact.customFields)) throw new LeadReceiptSignalError(stage);
    const fields = contact.customFields.filter(field => field && typeof field === "object" && field.id === input.fieldId);
    if (fields.length > 1) throw new LeadReceiptSignalError(stage);
    if (!fields.length || fields[0].value == null) return null;
    if (typeof fields[0].value !== "string") throw new LeadReceiptSignalError(stage);
    return fields[0].value;
  }
  const current = await request();
  if (!current.ok) throw new LeadReceiptSignalError("receipt_marker_lookup");
  if (marker(await current.json(), "receipt_marker_lookup") === input.receipt.receiptId) return;

  // Do not resend a timed-out write. A later explicit retry reads the marker
  // first and can verify a completed write without repeating it.
  const updated = await request({ method: "PUT", body: JSON.stringify({
    customFields: [{ id: input.fieldId, fieldValue: input.receipt.receiptId }],
  }) });
  const result = await updated.json();
  if (!updated.ok || result.contact?.id !== input.contactId || result.contact?.locationId !== input.locationId
    || !(result.succeeded === true || (result.succeeded === undefined && result.succeded === true))) {
    throw new LeadReceiptSignalError("receipt_marker_update");
  }
  const readback = await request();
  if (!readback.ok || marker(await readback.json(), "receipt_marker_readback") !== input.receipt.receiptId) throw new LeadReceiptSignalError("receipt_marker_readback");
}

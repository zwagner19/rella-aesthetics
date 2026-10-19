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
 * A native Note Added staff alert can run before our readback: it must request
 * review rather than claim verification or contact the patient automatically.
 * Note lookup/create is not atomic across instances and makes no exactly-once
 * or rapid workflow re-entry guarantee.
 */
export async function persistLeadConsent(input: {
  contactId: string; submissionId: string; choice: LeadConsent; phoneProvided: boolean; headers: Record<string, string>;
  replyContact: LeadReplyContact; channelMatches: LeadChannelMatches;
  inquiry: LeadInquiry;
}) {
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
}

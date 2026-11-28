import { CONTACT_CONSENT_POLICY_VERSION } from "./policies";

export interface ContactConsentChoice {
  assessmentContactConsent: boolean;
  marketingConsent: boolean;
}

export function consentPayload(choice: ContactConsentChoice) {
  if (choice.assessmentContactConsent !== true || typeof choice.marketingConsent !== "boolean") {
    throw new Error("Please confirm the required contact consent before continuing.");
  }
  return { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: true as const, marketing: choice.marketingConsent };
}

/** A successful HTTP response alone does not establish a stored receipt. */
export function verifyConsentReceipt(value: unknown, choice: ContactConsentChoice) {
  const receipt = value as Record<string, unknown> | null;
  const expected = consentPayload(choice);
  if (!receipt || receipt.policyVersion !== expected.policyVersion || receipt.operational !== true
    || receipt.marketing !== expected.marketing || typeof receipt.recordedAt !== "string"
    || !Number.isFinite(Date.parse(receipt.recordedAt))) {
    throw new Error("Your contact consent could not be saved. Please try again before continuing.");
  }
  return JSON.stringify(expected);
}

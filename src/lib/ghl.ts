/**
 * GoHighLevel (LeadConnector) API v2 helpers.
 * @see https://marketplace.gohighlevel.com/docs/ghl/contacts/create-contact
 */

export const GHL_API_BASE = "https://services.leadconnectorhq.com";
export const GHL_API_VERSION = "2021-07-28";

export interface GhlContactInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  locationId: string;
  tags: string[];
  source: string;
  /** Optional: map GHL custom field UUID → value (create fields in GHL → Settings → Custom Fields) */
  customFields?: { id: string; value: string }[];
}

export function buildGhlContactBody(input: GhlContactInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    locationId: input.locationId,
    firstName: input.firstName || "Website",
    lastName: input.lastName || "Lead",
    source: input.source,
    tags: input.tags,
  };
  if (input.email) body.email = input.email;
  if (input.phone) body.phone = normalizePhone(input.phone);
  if (input.customFields?.length) {
    body.customFields = input.customFields.map((f) => ({
      id: f.id,
      value: f.value,
    }));
  }
  return body;
}

/** Basic US phone normalization for GHL */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phone.trim().startsWith("+")) return phone.trim();
  return phone.trim();
}

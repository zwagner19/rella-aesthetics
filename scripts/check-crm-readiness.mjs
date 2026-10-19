/**
 * Read-only CRM preflight. Runs only on the canonical website Preview branch.
 * Never prints credential values, native identifiers, response bodies or contacts.
 * A successful metadata check is not evidence of notes-write or workflow safety.
 */
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

export const CANONICAL_PROJECT = "prj_3ppAinB6Uzy0i0WA1OxB81rubmnD";
const BRANCH = "codex/amie-shared-booking";
const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const SYNTHETIC_CONTACT = "__rella_readiness_no_patient__";
const FIELD_ENV = {
  service: "GHL_CUSTOM_FIELD_SERVICE_ID",
  clinic: "GHL_CUSTOM_FIELD_LOCATION_ID",
  message: "GHL_CUSTOM_FIELD_MESSAGE_ID",
  receipt: "GHL_CUSTOM_FIELD_RECEIPT_ID",
};
const APPROVED_FIELDS = {
  service: "sKdonP3enW4FefPCVuUD",
  clinic: "HqLMdCYtaiRCcLenwe9V",
  message: "e3NvXYXNv8QNVqMqXGDr",
  receipt: "fgqFVClK8ZWn7S1l1aCI",
};
const FIELD_ID = /^[A-Za-z0-9]{20}$/;
const EXPECTED_NAMES = new Set(["rella aesthetics", "rella aesthetics napa", "rella aesthetics vacaville"]);
// The business account was verified in the authenticated GHL integration UI.
// Log only a match boolean, never the configured location identifier.
const APPROVED_ACCOUNT_HASH = createHash("sha256").update("AN9PD7sVxQPYWh1Jv6ji").digest("hex");

function scopeClaims(token, now) {
  const unknown = { present: false, verified: false, contactsRead: null, contactsWrite: null, expired: null };
  try {
    if (token.split(".").length !== 3) return unknown;
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    const raw = payload.scope ?? payload.scopes;
    const scopes = Array.isArray(raw) ? raw.filter(value => typeof value === "string") : typeof raw === "string" ? raw.split(/\s+/) : null;
    return { present: true, verified: false,
      contactsRead: scopes ? scopes.includes("contacts.readonly") : null,
      contactsWrite: scopes ? scopes.includes("contacts.write") : null,
      expired: typeof payload.exp === "number" ? payload.exp * 1000 <= now : null };
  } catch { return unknown; }
}

function failure(status) {
  if (status === 401) return "auth_or_scope_denied";
  if (status === 403) return "metadata_scope_denied";
  if (status === 404) return "not_found";
  return "unknown";
}

function httpStatus(status) {
  return Number.isInteger(status) && status >= 100 && status <= 599 ? status : null;
}

function metadataFailure(status) {
  const reason = failure(status);
  return { state: status === 404 ? "invalid" : "unknown", reason, httpStatus: httpStatus(status) };
}

export async function checkCrmReadiness({ env = process.env, fetcher = fetch, explicit = false, now = Date.now() } = {}) {
  // An explicit invocation may override the branch, never the project/Preview gate.
  if (env.VERCEL_PROJECT_ID !== CANONICAL_PROJECT || env.VERCEL_ENV !== "preview"
    || (!explicit && env.VERCEL_GIT_COMMIT_REF !== BRANCH)) {
    return { check: "rella-crm-readiness-v1", state: "skipped", reason: "outside_canonical_preview_scope", launchReady: false };
  }
  const configuration = {
    credential: Boolean(env.GHL_API_KEY), location: Boolean(env.GHL_LOCATION_ID),
    approvedAccountLocationMatches: Boolean(env.GHL_LOCATION_ID) && createHash("sha256").update(env.GHL_LOCATION_ID).digest("hex") === APPROVED_ACCOUNT_HASH,
    approvedFieldIdsMatch: Object.fromEntries(Object.entries(FIELD_ENV).map(([label, key]) => [label, env[key] === APPROVED_FIELDS[label]])),
    serviceField: Boolean(env[FIELD_ENV.service]), clinicField: Boolean(env[FIELD_ENV.clinic]), messageField: Boolean(env[FIELD_ENV.message]),
    receiptField: Boolean(env[FIELD_ENV.receipt]),
    fieldIdsValid: Object.values(FIELD_ENV).every(key => typeof env[key] === "string" && FIELD_ID.test(env[key])),
    fieldIdsDistinct: new Set(Object.values(FIELD_ENV).map(key => env[key])).size === Object.keys(FIELD_ENV).length,
    requiredCount: 2 + Object.keys(FIELD_ENV).length,
    configuredCount: [env.GHL_API_KEY, env.GHL_LOCATION_ID, ...Object.values(FIELD_ENV).map(key => env[key])].filter(Boolean).length,
  };
  const report = { check: "rella-crm-readiness-v1", state: "unknown", launchReady: false,
    configuration, business: { state: "unknown" }, customFields: {}, notesRead: { state: "unknown", proof: "synthetic_probe_is_not_scope_proof" },
    notesWrite: "requires_supervised_synthetic_test", staffRouting: "requires_workflow_readback",
    unverifiedTokenClaims: scopeClaims(env.GHL_API_KEY ?? "", now) };
  if (configuration.configuredCount !== configuration.requiredCount) {
    report.state = "invalid";
    report.business = { state: "not_checked", reason: "missing_required_configuration" };
    return report;
  }
  if (!configuration.fieldIdsValid || !configuration.fieldIdsDistinct
    || !Object.values(configuration.approvedFieldIdsMatch).every(Boolean)) {
    report.state = "invalid";
    report.business = { state: "not_checked", reason: "invalid_required_configuration" };
    return report;
  }
  const headers = { Authorization: `Bearer ${env.GHL_API_KEY}`, Version: VERSION, Accept: "application/json" };
  async function get(path) {
    let status = null;
    try {
      const response = await fetcher(`${API}${path}`, { method: "GET", headers, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8_000) });
      status = httpStatus(response.status);
      if (!response.ok) return { status };
      const raw = await response.text();
      if (raw.length > 262_144) return { status };
      return { status, data: JSON.parse(raw) };
    } catch { return { status }; }
  }
  const encodedLocation = encodeURIComponent(env.GHL_LOCATION_ID);
  const location = await get(`/locations/${encodedLocation}`);
  if (location.status !== 200 || !location.data?.location) {
    report.business = metadataFailure(location.status);
    // GHL can return 401 for a missing scope as well as invalid authentication.
    // Metadata permissions are independent of the approved contact permissions.
    // Inspect independent read-only capabilities without requesting more scopes.
  } else {
    const metadata = location.data.location;
    const names = [metadata.name, metadata.business?.name].filter(value => typeof value === "string")
      .map(value => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
    const identityMatches = metadata.id === env.GHL_LOCATION_ID && names.some(name => EXPECTED_NAMES.has(name));
    report.business = { state: identityMatches ? "verified" : "invalid", configuredIdentityMatches: identityMatches, httpStatus: 200 };
    if (!identityMatches) { report.state = "invalid"; return report; }
  }

  const checks = await Promise.all(Object.entries(FIELD_ENV).map(async ([label, key]) => {
    if (!env[key]) return [label, { state: "not_configured" }];
    const response = await get(`/locations/${encodedLocation}/customFields/${encodeURIComponent(env[key])}`);
    const field = response.data?.customField;
    if (response.status !== 200 || !field) {
      return [label, metadataFailure(response.status)];
    }
    const valid = field.id === env[key] && field.locationId === env.GHL_LOCATION_ID && field.model === "contact"
      && (label !== "receipt" || field.fieldKey === "contact.website_inquiry_receipt_id");
    // GHL's TEXT type corresponds to the UI's Single Line field. A different
    // metadata representation cannot prove the UI-verified type is wrong.
    // https://marketplace.gohighlevel.com/docs/ghl/locations/get-custom-fields/
    if (valid && label === "receipt" && field.dataType !== "TEXT") {
      return [label, { state: "unknown", reason: "receipt_field_type_unverified", httpStatus: 200 }];
    }
    return [label, { state: valid ? "verified" : "invalid", configuredIdentityMatches: valid, httpStatus: 200 }];
  }));
  report.customFields = Object.fromEntries(checks);

  // This identifier cannot address a native contact. Do not list/search patients.
  const notes = await get(`/contacts/${SYNTHETIC_CONTACT}/notes`);
  report.notesRead = { state: "unknown", httpStatus: httpStatus(notes.status), proof: "synthetic_probe_is_not_scope_proof", outcome:
    notes.status === 401 ? "auth_or_scope_denied" : notes.status === 403 ? "scope_or_resource_denied"
      : notes.status === 200 && Array.isArray(notes.data?.notes) && notes.data.notes.length === 0 ? "empty_probe_accepted"
        : notes.status === 404 ? "synthetic_contact_not_found" : "unverified" };
  // JWT claims are informational only; positive API readback is required above.
  report.state = report.business.state === "invalid" || checks.some(([, check]) => check.state === "invalid") || report.notesRead.state === "invalid" ? "invalid" : "unknown";
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = await checkCrmReadiness({ explicit: process.argv.includes("--check") });
    console.log(`[rella-crm-readiness] ${JSON.stringify(report)}`);
  } catch {
    // Never stringify upstream errors: they may contain URLs or credential data.
    console.log('[rella-crm-readiness] {"check":"rella-crm-readiness-v1","state":"unknown","launchReady":false,"reason":"internal_check_unavailable"}');
  }
  // An unknown optional preflight never breaks builds in other environments.
}

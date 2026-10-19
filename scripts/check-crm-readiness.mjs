/**
 * Read-only CRM preflight. Runs only on the canonical website Preview branch.
 * Never prints credential values, native identifiers, response bodies or contacts.
 * A successful metadata check is not evidence of notes-write or workflow safety.
 */
import { pathToFileURL } from "node:url";

export const CANONICAL_PROJECT = "prj_3ppAinB6Uzy0i0WA1OxB81rubmnD";
const BRANCH = "codex/amie-shared-booking";
const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const SYNTHETIC_CONTACT = "__rella_readiness_no_patient__";
const FIELD_ENV = {
  service: "GHL_CUSTOM_FIELD_SERVICE_ID",
  clinic: "GHL_CUSTOM_FIELD_LOCATION_ID",
  message: "GHL_CUSTOM_FIELD_MESSAGE_ID",
};
const EXPECTED_NAMES = new Set(["rella aesthetics", "rella aesthetics napa", "rella aesthetics vacaville"]);

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
  if (status === 401 || status === 403) return "access_denied";
  if (status === 404) return "not_found";
  return "unknown";
}

export async function checkCrmReadiness({ env = process.env, fetcher = fetch, explicit = false, now = Date.now() } = {}) {
  // An explicit invocation may override the branch, never the project/Preview gate.
  if (env.VERCEL_PROJECT_ID !== CANONICAL_PROJECT || env.VERCEL_ENV !== "preview"
    || (!explicit && env.VERCEL_GIT_COMMIT_REF !== BRANCH)) {
    return { check: "rella-crm-readiness-v1", state: "skipped", reason: "outside_canonical_preview_scope", launchReady: false };
  }
  const configuration = {
    credential: Boolean(env.GHL_API_KEY), location: Boolean(env.GHL_LOCATION_ID),
    serviceField: Boolean(env[FIELD_ENV.service]), clinicField: Boolean(env[FIELD_ENV.clinic]), messageField: Boolean(env[FIELD_ENV.message]),
  };
  const report = { check: "rella-crm-readiness-v1", state: "unknown", launchReady: false,
    configuration, business: { state: "unknown" }, customFields: {}, notesRead: { state: "unknown", proof: "synthetic_probe_is_not_scope_proof" },
    notesWrite: "requires_supervised_synthetic_test", staffRouting: "requires_workflow_readback",
    unverifiedTokenClaims: scopeClaims(env.GHL_API_KEY ?? "", now) };
  if (!configuration.credential || !configuration.location || !configuration.messageField) {
    report.state = "invalid";
    report.business = { state: "not_checked", reason: "missing_required_configuration" };
    return report;
  }
  const headers = { Authorization: `Bearer ${env.GHL_API_KEY}`, Version: VERSION, Accept: "application/json" };
  async function get(path) {
    try {
      const response = await fetcher(`${API}${path}`, { method: "GET", headers, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8_000) });
      if (!response.ok) return { status: response.status };
      const raw = await response.text();
      if (raw.length > 262_144) return { status: response.status };
      return { status: response.status, data: JSON.parse(raw) };
    } catch { return { status: null }; }
  }
  const encodedLocation = encodeURIComponent(env.GHL_LOCATION_ID);
  const location = await get(`/locations/${encodedLocation}`);
  if (location.status !== 200 || !location.data?.location) {
    const reason = failure(location.status);
    report.business = { state: reason === "unknown" ? "unknown" : "invalid", reason };
    report.state = report.business.state === "invalid" ? "invalid" : "unknown";
    return report;
  }
  const metadata = location.data.location;
  const names = [metadata.name, metadata.business?.name].filter(value => typeof value === "string")
    .map(value => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());
  const identityMatches = metadata.id === env.GHL_LOCATION_ID && names.some(name => EXPECTED_NAMES.has(name));
  report.business = { state: identityMatches ? "verified" : "invalid", configuredIdentityMatches: identityMatches };
  if (!identityMatches) { report.state = "invalid"; return report; }

  const checks = await Promise.all(Object.entries(FIELD_ENV).map(async ([label, key]) => {
    if (!env[key]) return [label, { state: "not_configured" }];
    const response = await get(`/locations/${encodedLocation}/customFields/${encodeURIComponent(env[key])}`);
    const field = response.data?.customField;
    if (response.status !== 200 || !field) {
      const reason = failure(response.status);
      return [label, { state: reason === "unknown" ? "unknown" : "invalid", reason }];
    }
    const valid = field.id === env[key] && field.locationId === env.GHL_LOCATION_ID && field.model === "contact";
    return [label, { state: valid ? "verified" : "invalid", configuredIdentityMatches: valid }];
  }));
  report.customFields = Object.fromEntries(checks);

  // This identifier cannot address a native contact. Do not list/search patients.
  const notes = await get(`/contacts/${SYNTHETIC_CONTACT}/notes`);
  report.notesRead = { state: "unknown", proof: "synthetic_probe_is_not_scope_proof", outcome:
    notes.status === 401 || notes.status === 403 ? "access_denied"
      : notes.status === 200 && Array.isArray(notes.data?.notes) && notes.data.notes.length === 0 ? "empty_probe_accepted"
        : notes.status === 404 ? "synthetic_contact_not_found" : "unverified" };
  // JWT claims are informational only; positive API readback is required above.
  report.state = checks.some(([, check]) => check.state === "invalid") || report.notesRead.outcome === "access_denied" ? "invalid" : "unknown";
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

import { test } from "node:test";
import assert from "node:assert/strict";
import { CANONICAL_PROJECT, checkCrmReadiness } from "./check-crm-readiness.mjs";

const env = { VERCEL_PROJECT_ID: CANONICAL_PROJECT, VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "codex/amie-shared-booking",
  GHL_API_KEY: "sensitive-do-not-print", GHL_LOCATION_ID: "sensitive-location", GHL_CUSTOM_FIELD_SERVICE_ID: "service-id",
  GHL_CUSTOM_FIELD_LOCATION_ID: "clinic-id", GHL_CUSTOM_FIELD_MESSAGE_ID: "message-id" };
function adapter(overrides = {}) {
  const calls = [];
  return { calls, fetcher: async (url, init) => {
    calls.push([url, init]);
    if (url.includes("customFields")) {
      const id = url.split("/").at(-1);
      return Response.json({ customField: { id, locationId: env.GHL_LOCATION_ID, model: "contact" } });
    }
    if (url.includes("/notes")) return Response.json({ message: "private-message-not-logged" }, { status: 404 });
    return Response.json({ location: { id: env.GHL_LOCATION_ID, name: "Rella Aesthetics", ...overrides } });
  } };
}
test("skips other projects, Production and unrelated branches without any request", async () => {
  for (const change of [{ VERCEL_PROJECT_ID: "another" }, { VERCEL_ENV: "production" }, { VERCEL_GIT_COMMIT_REF: "main" }, { VERCEL_PROJECT_ID: undefined }]) {
    const { calls, fetcher } = adapter();
    assert.equal((await checkCrmReadiness({ env: { ...env, ...change }, fetcher })).state, "skipped");
    assert.equal(calls.length, 0);
  }
});
test("explicit check can override a branch but never the canonical project or Preview requirement", async () => {
  const { calls, fetcher } = adapter();
  assert.equal((await checkCrmReadiness({ env: { ...env, VERCEL_GIT_COMMIT_REF: "review" }, explicit: true, fetcher })).business.state, "verified");
  const before = calls.length;
  assert.equal((await checkCrmReadiness({ env: { ...env, VERCEL_PROJECT_ID: "another" }, explicit: true, fetcher })).state, "skipped");
  assert.equal((await checkCrmReadiness({ env: { ...env, VERCEL_ENV: "production" }, explicit: true, fetcher })).state, "skipped");
  assert.equal(calls.length, before);
});
test("verifies metadata using GET only, prints no sensitive values, and leaves notes/workflow proof unknown", async () => {
  const { calls, fetcher } = adapter();
  const report = await checkCrmReadiness({ env, fetcher });
  assert.equal(report.business.state, "verified");
  assert.deepEqual(Object.values(report.customFields).map(field => field.state), ["verified", "verified", "verified"]);
  assert.equal(report.notesRead.state, "unknown");
  assert.equal(report.launchReady, false);
  assert.equal(report.state, "unknown");
  assert.equal(calls.length, 5);
  assert(calls.every(([, init]) => init.method === "GET" && init.redirect === "manual"));
  assert(!calls.some(([url]) => url.includes("contacts?") || /contacts\/$/.test(url)));
  const output = JSON.stringify(report);
  for (const sensitive of [...Object.values(env), "private-message-not-logged", "Rella Aesthetics"]) assert(!output.includes(sensitive));
});
test("stops before additional checks on wrong-business metadata", async () => {
  const { calls, fetcher } = adapter({ name: "Another business" });
  const report = await checkCrmReadiness({ env, fetcher });
  assert.equal(report.state, "invalid"); assert.equal(calls.length, 1);
});
test("treats authentication or scope denial and transient failures as unknown without error body exposure", async () => {
  for (const [status, expected] of [[401, "unknown"], [403, "unknown"], [500, "unknown"]]) {
    const report = await checkCrmReadiness({ env, fetcher: async () => Response.json({ error: env.GHL_API_KEY }, { status }) });
    assert.equal(report.state, expected); assert.equal(report.business.httpStatus, status);
    assert(!JSON.stringify(report).includes(env.GHL_API_KEY));
  }
});
test("continues custom-field and synthetic notes checks when location metadata is forbidden", async () => {
  const { calls, fetcher } = adapter();
  const report = await checkCrmReadiness({ env, fetcher: async (url, init) => {
    if (!url.includes("customFields") && !url.includes("/notes")) {
      calls.push([url, init]); return Response.json({ message: "private permission details" }, { status: 403 });
    }
    return fetcher(url, init);
  } });
  assert.deepEqual(report.business, { state: "unknown", reason: "metadata_scope_denied", httpStatus: 403 });
  assert.equal(report.state, "unknown");
  assert.deepEqual(Object.values(report.customFields).map(field => [field.state, field.httpStatus]), [["verified", 200], ["verified", 200], ["verified", 200]]);
  assert.equal(report.notesRead.httpStatus, 404);
  assert.equal(calls.length, 5);
  assert(calls.some(([url]) => url.includes("/__rella_readiness_no_patient__/notes")));
  assert(!JSON.stringify(report).includes("private permission details"));
});
test("401 metadata scope denial does not skip independent contact-read checks", async () => {
  let calls = 0;
  const report = await checkCrmReadiness({ env, fetcher: async () => { calls++; return Response.json({}, { status: 401 }); } });
  assert.equal(report.state, "unknown"); assert.equal(report.business.reason, "auth_or_scope_denied");
  assert.equal(report.business.httpStatus, 401); assert.equal(calls, 5);
  assert.equal(report.notesRead.outcome, "auth_or_scope_denied");
});
test("reports only a boolean for the UI-verified business account location", async () => {
  const report = await checkCrmReadiness({ env: { ...env, GHL_LOCATION_ID: "AN9PD7sVxQPYWh1Jv6ji" }, fetcher: async () => Response.json({}, { status: 401 }) });
  assert.equal(report.configuration.approvedAccountLocationMatches, true);
  assert(!JSON.stringify(report).includes("AN9PD7sVxQPYWh1Jv6ji"));
  assert.equal(report.business.state, "unknown");
});
test("malformed JSON retains bounded HTTP status without logging response contents", async () => {
  const report = await checkCrmReadiness({ env, fetcher: async () => new Response("private non-json response", { status: 200 }) });
  assert.equal(report.state, "unknown"); assert.equal(report.business.httpStatus, 200);
  assert.equal(report.notesRead.httpStatus, 200); assert(!JSON.stringify(report).includes("private"));
});
test("a forged JWT scope claim cannot establish notes read or write readiness", async () => {
  const token = `fake.${Buffer.from(JSON.stringify({ scope: "contacts.readonly contacts.write", exp: 9999999999 })).toString("base64url")}.unsigned`;
  const { fetcher } = adapter();
  const report = await checkCrmReadiness({ env: { ...env, GHL_API_KEY: token }, fetcher });
  assert.equal(report.unverifiedTokenClaims.contactsRead, true);
  assert.equal(report.unverifiedTokenClaims.contactsWrite, true);
  assert.equal(report.unverifiedTokenClaims.verified, false);
  assert.equal(report.notesRead.state, "unknown"); assert.equal(report.launchReady, false);
  assert(!JSON.stringify(report).includes(token));
});
test("detects wrong configured custom-field identity without exposing the native IDs", async () => {
  const { fetcher } = adapter();
  const report = await checkCrmReadiness({ env, fetcher: async (url, init) => url.includes("customFields")
    ? Response.json({ customField: { id: "wrong-private-id", locationId: env.GHL_LOCATION_ID, model: "opportunity" } }) : fetcher(url, init) });
  assert.equal(report.state, "invalid"); assert.equal(report.customFields.message.state, "invalid");
  assert(!JSON.stringify(report).includes("wrong-private-id"));
});
test("does not mistake an empty synthetic notes response for positive permission proof", async () => {
  const { fetcher } = adapter();
  for (const [status, outcome] of [[200, "empty_probe_accepted"], [403, "scope_or_resource_denied"]]) {
    const report = await checkCrmReadiness({ env, fetcher: async (url, init) => url.includes("/notes")
      ? Response.json({ notes: [] }, { status }) : fetcher(url, init) });
    assert.equal(report.notesRead.state, "unknown"); assert.equal(report.notesRead.outcome, outcome);
    assert.equal(report.notesRead.httpStatus, status);
    assert.equal(report.launchReady, false);
  }
});

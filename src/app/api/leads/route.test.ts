import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { CONTACT_CONSENT_POLICY_VERSION } from "@/lib/guided-booking/policies";
import { buildGhlContactBody } from "@/lib/ghl";

function leadRequest(body: Record<string, unknown>) {
  return new Request("https://experiencerella.com/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ submissionId: "62d72df4-658e-4d6c-aa7c-608aaf27a212", consent: { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: Boolean(body.phone), marketing: false }, ...body }),
  });
}

function ghlContact(id: string, email?: string, phone?: string) {
  return { id, locationId: "location-123", email, phone };
}

function withConsentNotes(delegate: typeof fetch) {
  let saved = "";
  return async (url: RequestInfo | URL, init?: RequestInit) => {
    if (String(url).endsWith("/notes") && init?.method === "POST") {
      saved = JSON.parse(String(init.body)).body;
      return Response.json({ note: { id: "note-fixture" } }, { status: 201 });
    }
    if (String(url).endsWith("/notes")) return Response.json({ notes: [] });
    if (String(url).endsWith("/notes/note-fixture")) return Response.json({ note: { id: "note-fixture", contactId: "contact-456", body: saved } });
    return delegate(url, init);
  };
}

function configureGhl() {
  vi.stubEnv("GHL_API_KEY", "test-token");
  vi.stubEnv("GHL_LOCATION_ID", "location-123");
  vi.stubEnv("GHL_CUSTOM_FIELD_SERVICE_ID", "service-field");
  vi.stubEnv("GHL_CUSTOM_FIELD_LOCATION_ID", "location-field");
  vi.stubEnv("GHL_CUSTOM_FIELD_MESSAGE_ID", "message-field");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("contact lead delivery", () => {
  it.each([
    undefined,
    { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: false, marketing: false },
    { policyVersion: "old", operational: true, marketing: false },
    { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: true, marketing: "false" },
  ])("rejects missing or invalid phone consent before any CRM request: %j", async consent => {
    configureGhl(); const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(leadRequest({ name: "Test Person", phone: "7075550100", consent }) as never);
    expect(response.status).toBe(400); expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not claim successful delivery if contact saved but durable consent readback fails", async () => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ contact: ghlContact("verified-contact", undefined, "+17075550100") }))
      .mockResolvedValueOnce(Response.json({ notes: [] }))
      .mockResolvedValueOnce(Response.json({ note: { id: "saved-note" } }, { status: 201 }))
      .mockResolvedValueOnce(Response.json({ note: { id: "saved-note", contactId: "wrong", body: "wrong" } }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(leadRequest({ name: "Test Person", phone: "7075550100", contactId: "browser-id-is-not-authority" }) as never);
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock.mock.calls.slice(1).every(([url]) => String(url).includes("/contacts/verified-contact/notes"))).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("persists email-only no-phone/no-marketing choices before success and routing tags", async () => {
    configureGhl(); let savedBody = ""; let savedTags: string[] = [];
    const actions: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (url, init) => {
      const path = new URL(String(url)).pathname;
      actions.push(`${init?.method ?? "GET"} ${path}`);
      if (path.endsWith("upsert")) return Response.json({ contact: ghlContact("server-contact", "test@example.test") });
      if (path.endsWith("/notes") && init?.method === "POST") {
        savedBody = JSON.parse(String(init.body)).body;
        return Response.json({ note: { id: "server-note" } }, { status: 201 });
      }
      if (path.endsWith("/notes")) return Response.json({ notes: [] });
      if (path.endsWith("/server-note")) return Response.json({ note: { id: "server-note", contactId: "server-contact", body: savedBody } });
      if (path.endsWith("/tags")) {
        savedTags = JSON.parse(String(init?.body)).tags;
        return Response.json({ tags: savedTags }, { status: 201 });
      }
      return Response.json({});
    }));
    const response = await POST(leadRequest({ name: "Test Person", email: "test@example.test" }) as never);
    expect(await response.json()).toEqual({ success: true, accepted: true });
    expect(JSON.parse(savedBody)).toMatchObject({ operational: false, marketing: false, phoneProvided: false, policyVersion: CONTACT_CONSENT_POLICY_VERSION });
    expect(savedTags).toEqual(["website-contact-request"]);
    expect(actions).toEqual(["POST /contacts/upsert", "GET /contacts/server-contact/notes", "POST /contacts/server-contact/notes", "GET /contacts/server-contact/notes/server-note", "POST /contacts/server-contact/tags"]);
  });

  it("keeps a lost upsert response pending without issuing a second mutation", async () => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockRejectedValue(new Error("response lost")); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(leadRequest({ name: "Test Person", email: "test@example.test" }) as never);
    expect(response.status).toBe(202); expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([500, 502, 503])("keeps an ambiguous upsert HTTP %s pending without another CRM request", async status => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ message: "Upstream server error" }, { status }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(leadRequest({ name: "Test Person", email: "test@example.test" }) as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://services.leadconnectorhq.com/contacts/upsert");
  });

  it("rejects cross-site forged consent before any CRM request", async () => {
    const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
    const response = await POST(new Request("https://experiencerella.com/api/leads", {
      method: "POST", headers: { origin: "https://evil.test", "content-type": "application/json" }, body: "{}",
    }) as never);
    expect(response.status).toBe(403); expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { label: "phone matched while email belongs to another contact", contact: ghlContact("contact-456", "existing@example.test", "+17075550100"), matches: { email: false, phone: true } },
    { label: "email matched while phone belongs to another contact", contact: ghlContact("contact-456", "reply@example.test", "+17075550199"), matches: { email: true, phone: false } },
  ])("preserves submitted reply details but holds routing when $label", async ({ contact, matches }) => {
    configureGhl();
    const delegate = vi.fn().mockResolvedValueOnce(Response.json({ contact }));
    const fetchMock = vi.fn(withConsentNotes(delegate));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(leadRequest({ name: "Test Person", email: " REPLY@EXAMPLE.TEST ", phone: "(707) 555-0100" }) as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(delegate).toHaveBeenCalledTimes(1); // No second profile write or routing tags.
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith("/tags"))).toBe(false);
    const noteWrite = fetchMock.mock.calls.find(([url, init]) => String(url).endsWith("/notes") && init?.method === "POST")!;
    expect(JSON.parse(JSON.parse(String(noteWrite[1]?.body)).body)).toMatchObject({
      receiptVersion: 2, replyContact: { email: "reply@example.test", phone: "+17075550100" },
      channelMatches: matches, marketing: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(4); // Upsert, list, receipt write and exact readback.
  });

  it.each([
    { label: "email-only", request: { email: "REPLY@EXAMPLE.TEST" }, contact: ghlContact("contact-456", "reply@example.test", "+17075550199"), reply: { email: "reply@example.test", phone: null }, matches: { email: true, phone: false } },
    { label: "phone-only", request: { phone: "(707) 555-0100" }, contact: ghlContact("contact-456", "existing@example.test", "+1 (707) 555-0100"), reply: { email: null, phone: "+17075550100" }, matches: { email: false, phone: true } },
  ])("accepts a verified $label request without requiring the unsubmitted channel", async ({ request, contact, reply, matches }) => {
    configureGhl();
    const delegate = vi.fn()
      .mockResolvedValueOnce(Response.json({ contact }))
      .mockImplementationOnce(async (_url, init) => Response.json({ tags: JSON.parse(String(init?.body)).tags }, { status: 201 }));
    const fetchMock = vi.fn(withConsentNotes(delegate));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(leadRequest({ name: "Test Person", ...request }) as never);

    expect(await response.json()).toEqual({ success: true, accepted: true });
    const noteWrite = fetchMock.mock.calls.find(([url, init]) => String(url).endsWith("/notes") && init?.method === "POST")!;
    expect(JSON.parse(JSON.parse(String(noteWrite[1]?.body)).body)).toMatchObject({ replyContact: reply, channelMatches: matches });
    expect(delegate).toHaveBeenCalledTimes(2);
  });

  it.each([
    { label: "missing contact", result: {} },
    { label: "missing native identity", result: { contact: { locationId: "location-123", email: "reply@example.test" } } },
    { label: "missing account", result: { contact: { id: "contact-456", email: "reply@example.test" } } },
    { label: "different account", result: { contact: { id: "contact-456", locationId: "another-location", email: "reply@example.test", phone: "+17075550100" } } },
    { label: "missing contact channels", result: { contact: { id: "contact-456", locationId: "location-123" } } },
    { label: "neither submitted channel matches", result: { contact: ghlContact("contact-456", "different@example.test", "+17075550199") } },
  ])("holds $label before any consent note or routing mutation", async ({ result }) => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json(result));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(leadRequest({ name: "Test Person", email: "reply@example.test", phone: "7075550100" }) as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails closed when CRM delivery is not configured", async () => {
    vi.stubEnv("GHL_API_KEY", "");
    vi.stubEnv("GHL_LOCATION_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({ name: "Test Person", email: "test@example.com" }) as never,
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Contact form is temporarily unavailable",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires a configured field for a free-text message", async () => {
    vi.stubEnv("GHL_API_KEY", "test-token");
    vi.stubEnv("GHL_LOCATION_ID", "location-123");
    vi.stubEnv("GHL_CUSTOM_FIELD_MESSAGE_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({
        name: "Test Person",
        email: "test@example.com",
        message: "I would like to discuss treatment.",
      }) as never,
    );

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently rejects honeypot submissions", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({
        name: "Spam Bot",
        email: "bot@example.com",
        website: "https://spam.invalid",
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, accepted: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([false, true])("upserts bounded fields and applies explicit consent routing tags (marketing=%s)", async marketing => {
    configureGhl();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact: ghlContact("contact-456", "test@example.com", "+17075550100") }), {
          status: 200,
        }),
      )
      .mockImplementationOnce(async (_url, init) => Response.json({ tags: JSON.parse(String(init?.body)).tags }, { status: 201 }));
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({
        name: "  Test Person  ",
        email: "TEST@EXAMPLE.COM",
        phone: "(707) 555-0100",
        service: "Medical Weight Loss",
        location: "Napa",
        message: "Please call after 3pm.",
        consent: { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: true, marketing },
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, accepted: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [upsertUrl, upsertOptions] = fetchMock.mock.calls[0];
    expect(upsertUrl).toBe("https://services.leadconnectorhq.com/contacts/upsert");
    expect(JSON.parse(String(upsertOptions.body))).toMatchObject({
      firstName: "Test",
      lastName: "Person",
      email: "test@example.com",
      phone: "+17075550100",
      source: "Rella Website - Contact Form",
      customFields: [
        { id: "service-field", fieldValue: "Medical Weight Loss" },
        { id: "location-field", fieldValue: "Napa" },
        { id: "message-field", fieldValue: "Please call after 3pm." },
      ],
    });

    const [tagUrl, tagOptions] = fetchMock.mock.calls[1];
    expect(tagUrl).toBe(
      "https://services.leadconnectorhq.com/contacts/contact-456/tags",
    );
    expect(JSON.parse(String(tagOptions.body))).toEqual({
      tags: ["website-contact-request", "website-contact-operational-consent", ...(marketing ? ["website-contact-marketing-opt-in"] : []), "interest-medical-weight-loss", "location-napa"],
    });
  });

  it("rejects unrecognized clinic values", async () => {
    configureGhl();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({
        name: "Test Person",
        email: "test@example.com",
        location: "Somewhere Else",
      }) as never,
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects arbitrary service tags", async () => {
    configureGhl();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(
      leadRequest({
        name: "Test Person",
        email: "test@example.com",
        service: "Injected CRM Tag",
      }) as never,
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never claims acceptance when the CRM rejects the contact", async () => {
    configureGhl();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Rejected" }), { status: 422 }),
      ),
    );

    const response = await POST(
      leadRequest({ name: "Test Person", email: "test@example.com" }) as never,
    );

    expect(response.status).toBe(502);
    expect(await response.json()).not.toHaveProperty("success", true);
  });

  it("keeps a saved lead pending verification if staff routing tags fail, without inviting resubmission", async () => {
    configureGhl();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      withConsentNotes(vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ contact: ghlContact("contact-456", "test@example.com") }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(new Response("", { status: 500 }))),
    );

    const response = await POST(
      leadRequest({ name: "Test Person", email: "test@example.com" }) as never,
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
  });

  it.each([
    {},
    { tags: [] },
    { tags: ["website-contact-request"] },
    { tags: ["website-contact-request", "website-contact-operational-consent", 1] },
  ])("does not claim acceptance from unverified routing-tag readback: %j", async tagResult => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ contact: ghlContact("contact-456", undefined, "+17075550100") }))
      .mockResolvedValueOnce(Response.json(tagResult, { status: 201 }));
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(leadRequest({ name: "Test Person", phone: "7075550100" }) as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps malformed routing-tag JSON pending without repeating the tag mutation", async () => {
    configureGhl(); vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ contact: ghlContact("contact-456", "test@example.test") }))
      .mockResolvedValueOnce(new Response("not-json", { status: 201 }));
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(leadRequest({ name: "Test Person", email: "test@example.test" }) as never);

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: false, pending: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("accepts verified requested tags without altering historical marketing permission", async () => {
    configureGhl();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ contact: ghlContact("contact-456", "test@example.test") }))
      .mockResolvedValueOnce(Response.json({ tags: ["historical-tag", "website-contact-marketing-opt-in", "website-contact-request"] }, { status: 201 }));
    vi.stubGlobal("fetch", withConsentNotes(fetchMock));

    const response = await POST(leadRequest({ name: "Test Person", email: "test@example.test" }) as never);

    expect(await response.json()).toEqual({ success: true, accepted: true });
    const [url, options] = fetchMock.mock.calls[1];
    expect(String(url)).toMatch(/\/tags$/);
    expect(JSON.parse(String(options?.body))).toEqual({ tags: ["website-contact-request"] });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).not.toHaveProperty("dnd");
  });
});

describe("HighLevel payload shape", () => {
  it("uses the documented fieldValue property", () => {
    expect(
      buildGhlContactBody({
        firstName: "Test",
        lastName: "Person",
        locationId: "location-123",
        source: "Website",
        customFields: [{ id: "field-1", fieldValue: "Saved value" }],
      }),
    ).toMatchObject({
      customFields: [{ id: "field-1", fieldValue: "Saved value" }],
    });
  });
});

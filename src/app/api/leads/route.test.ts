import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { buildGhlContactBody } from "@/lib/ghl";

function leadRequest(body: Record<string, unknown>) {
  return new Request("https://experiencerella.com/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
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
  it("fails closed when CRM delivery is not configured", async () => {
    vi.stubEnv("GHL_API_KEY", "");
    vi.stubEnv("GHL_LOCATION_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      leadRequest({ name: "Test Person", email: "test@example.com" }) as never,
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      error: "Contact form is temporarily unavailable",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires a real destination for a free-text message", async () => {
    vi.stubEnv("GHL_API_KEY", "test-token");
    vi.stubEnv("GHL_LOCATION_ID", "location-123");
    vi.stubEnv("GHL_CUSTOM_FIELD_MESSAGE_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

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

  it("silently rejects honeypot submissions without firing a CRM request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

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

  it("upserts the contact, stores exact custom-field values, and adds tags", async () => {
    configureGhl();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact: { id: "contact-456" } }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ tags: ["website-lead"] }), {
          status: 201,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      leadRequest({
        name: "  Test Person  ",
        email: "TEST@EXAMPLE.COM",
        phone: "(707) 555-0100",
        service: "Medical Weight Loss",
        location: "Napa",
        message: "Please call after 3pm.",
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, accepted: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [upsertUrl, upsertOptions] = fetchMock.mock.calls[0];
    expect(upsertUrl).toBe("https://services.leadconnectorhq.com/contacts/upsert");
    const upsertBody = JSON.parse(String(upsertOptions.body));
    expect(upsertBody).toMatchObject({
      firstName: "Test",
      lastName: "Person",
      email: "test@example.com",
      phone: "+17075550100",
      source: "Rella Website — Contact Form",
      customFields: [
        { id: "service-field", fieldValue: "Medical Weight Loss" },
        { id: "location-field", fieldValue: "Napa" },
        { id: "message-field", fieldValue: "Please call after 3pm." },
      ],
    });
    expect(upsertBody).not.toHaveProperty("tags");
    expect(JSON.stringify(upsertBody)).not.toContain('"value"');

    const [tagUrl, tagOptions] = fetchMock.mock.calls[1];
    expect(tagUrl).toBe(
      "https://services.leadconnectorhq.com/contacts/contact-456/tags",
    );
    expect(JSON.parse(String(tagOptions.body))).toEqual({
      tags: ["website-lead", "interest-medical-weight-loss", "location-napa"],
    });
  });

  it("preserves clinic preference as a tag when its optional custom field is absent", async () => {
    configureGhl();
    vi.stubEnv("GHL_CUSTOM_FIELD_LOCATION_ID", "");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ contact: { id: "contact-456" } }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      leadRequest({
        name: "Test Person",
        email: "test@example.com",
        location: "Vacaville",
      }) as never,
    );

    expect(response.status).toBe(200);
    const upsertBody = JSON.parse(String(fetchMock.mock.calls[0][1].body));
    expect(upsertBody.customFields).toBeUndefined();
    const tagBody = JSON.parse(String(fetchMock.mock.calls[1][1].body));
    expect(tagBody.tags).toEqual(["website-lead", "location-vacaville"]);
  });

  it("rejects an unrecognized clinic value before contacting the CRM", async () => {
    configureGhl();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      leadRequest({
        name: "Test Person",
        email: "test@example.com",
        location: "Somewhere Else",
      }) as never,
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Select a valid clinic preference",
    });
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

  it("keeps the lead accepted if only post-save tag assignment fails", async () => {
    configureGhl();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ contact: { id: "contact-456" } }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(new Response("", { status: 500 })),
    );

    const response = await POST(
      leadRequest({ name: "Test Person", email: "test@example.com" }) as never,
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, accepted: true });
  });
});

describe("HighLevel payload shape", () => {
  it("uses the documented fieldValue request property", () => {
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

import { afterEach, describe, expect, it, vi } from "vitest";
import { leadConsentTags, persistLeadConsent, readLeadConsent, signalLeadReceipt, validLeadReceiptField, type LeadConsent } from "./lead-consent";
import { CONTACT_CONSENT_POLICY_VERSION } from "./guided-booking/policies";

const choice: LeadConsent = { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: true, marketing: false };
const input = { contactId: "verified-contact", submissionId: "62d72df4-658e-4d6c-aa7c-608aaf27a212", choice, phoneProvided: true,
  replyContact: { email: null, phone: "+17075550100" }, channelMatches: { email: false, phone: true },
  inquiry: { name: "Test Person", serviceInterest: "Botox", clinicPreference: "Napa", message: "Synthetic inquiry A" },
  headers: { Version: "2021-07-28" } };
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

function notesStore() {
  const notes: Array<{ id: string; contactId: string; body: string }> = [];
  const fetcher = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
    if (init?.method === "POST") {
      notes.push({ id: `note-${notes.length}`, contactId: input.contactId, body: JSON.parse(String(init.body)).body });
      return Response.json({ note: notes.at(-1) }, { status: 201 });
    }
    return Response.json(String(url).endsWith("/notes") ? { notes } : { note: notes.at(-1) });
  });
  vi.stubGlobal("fetch", fetcher);
  return { notes, fetcher };
}

describe("durable contact consent", () => {
  it("only adds the explicit marketing opt-in tag when selected, without legacy promotion enrollment tags", () => {
    expect(leadConsentTags(choice)).toEqual(["website-contact-request", "website-contact-operational-consent"]);
    expect(leadConsentTags({ ...choice, operational: false })).toEqual(["website-contact-request"]);
    expect(leadConsentTags({ ...choice, marketing: true })).toEqual(["website-contact-request", "website-contact-operational-consent", "website-contact-marketing-opt-in"]);
    expect(leadConsentTags(choice)).not.toContain("website-lead");
  });
  it("requires explicit operational acceptance for phone, accepts marketing=false and preserves email-only", () => {
    expect(readLeadConsent(choice, true)).toEqual(choice);
    expect(readLeadConsent({ ...choice, operational: false }, true)).toBeNull();
    expect(readLeadConsent({ ...choice, operational: "true" }, true)).toBeNull();
    expect(readLeadConsent({ ...choice, marketing: "false" }, true)).toBeNull();
    expect(readLeadConsent({ ...choice, policyVersion: "old" }, true)).toBeNull();
    expect(readLeadConsent({ ...choice, operational: false }, false)).toMatchObject({ operational: false, marketing: false });
    expect(readLeadConsent({ ...choice, marketing: true }, false)).toBeNull();
  });
  it("writes a versioned timestamped receipt and reads back the exact server contact note", async () => {
    const { notes, fetcher } = notesStore();
    const verified = await persistLeadConsent(input);
    expect(notes).toHaveLength(1);
    expect(JSON.parse(notes[0].body)).toMatchObject({ type: "rella-contact-consent", receiptVersion: 3, ...choice, source: "/contact", phoneProvided: true,
      replyContact: input.replyContact, channelMatches: input.channelMatches,
      inquiry: input.inquiry,
      policyHash: expect.stringMatching(/^[a-f0-9]{64}$/), recordedAt: expect.any(String) });
    expect(verified).toEqual({ receiptId: JSON.parse(notes[0].body).receiptId, noteId: "note-0", recordedAt: JSON.parse(notes[0].body).recordedAt });
    expect(fetcher.mock.calls.map(([url, init]) => [String(url).split("/").at(-1), init?.method ?? "GET"]))
      .toEqual([["notes", "GET"], ["notes", "POST"], ["note-0", "GET"]]);
  });
  it("keeps already-open v1 forms valid and records their original policy hash", async () => {
    const legacy = { ...choice, policyVersion: "rella-booking-consent-2026-10-19-v1" as const };
    expect(readLeadConsent(legacy, true)).toEqual(legacy);
    const oldStore = notesStore();
    await persistLeadConsent({ ...input, choice: legacy });
    const oldReceipt = JSON.parse(oldStore.notes[0].body);
    const newStore = notesStore();
    await persistLeadConsent(input);
    const newReceipt = JSON.parse(newStore.notes[0].body);
    expect(oldReceipt.policyVersion).toBe(legacy.policyVersion);
    expect(newReceipt.policyVersion).toBe(choice.policyVersion);
    expect(newReceipt.policyHash).not.toBe(oldReceipt.policyHash);
  });
  it("does not create a second note after retrying an already-saved receipt", async () => {
    const { notes, fetcher } = notesStore();
    await persistLeadConsent(input);
    const original = notes[0].body;
    await persistLeadConsent(input);
    expect(notes).toHaveLength(1);
    expect(notes[0].body).toBe(original);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it("preserves distinct inquiry snapshots for repeat requests from the same contact", async () => {
    const { notes } = notesStore();
    await persistLeadConsent(input);
    const secondInquiry = { ...input.inquiry, clinicPreference: "Vacaville", message: "Synthetic inquiry B" };
    await persistLeadConsent({ ...input, submissionId: "7cf36f5d-8773-442c-9e12-6219670bcb01", inquiry: secondInquiry });

    const receipts = notes.map(note => JSON.parse(note.body));
    expect(receipts.map(receipt => receipt.inquiry)).toEqual([input.inquiry, secondInquiry]);
    expect(receipts[0].receiptId).not.toBe(receipts[1].receiptId);
  });
  it("does not rewrite an old receipt that cannot prove submitted reply details", async () => {
    const { notes, fetcher } = notesStore();
    await persistLeadConsent(input);
    const legacy = JSON.parse(notes[0].body);
    delete legacy.receiptVersion; delete legacy.replyContact; delete legacy.channelMatches; delete legacy.inquiry;
    notes[0].body = JSON.stringify(legacy);

    await expect(persistLeadConsent(input)).rejects.toThrow("differs");

    expect(notes[0].body).toBe(JSON.stringify(legacy));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it("keeps a v2 receipt pending without rewriting its missing inquiry snapshot", async () => {
    const { notes, fetcher } = notesStore();
    await persistLeadConsent(input);
    const legacy = JSON.parse(notes[0].body);
    legacy.receiptVersion = 2; delete legacy.inquiry;
    notes[0].body = JSON.stringify(legacy);

    await expect(persistLeadConsent(input)).rejects.toThrow("differs");

    expect(notes[0].body).toBe(JSON.stringify(legacy));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it.each(["name", "serviceInterest", "clinicPreference", "message"] as const)("does not rewrite a receipt when inquiry %s changes on retry", async field => {
    const { notes, fetcher } = notesStore();
    await persistLeadConsent(input);
    const original = notes[0].body;

    await expect(persistLeadConsent({ ...input, inquiry: { ...input.inquiry, [field]: "Changed synthetic value" } })).rejects.toThrow("differs");

    expect(notes[0].body).toBe(original);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it.each(["replyContact", "channelMatches"] as const)("does not reuse a receipt when %s changes on retry", async field => {
    const collisionInput = { ...input, replyContact: { email: "reply@example.test", phone: "+17075550100" }, channelMatches: { email: false, phone: true } };
    const { notes, fetcher } = notesStore();
    await persistLeadConsent(collisionInput);
    const original = notes[0].body;
    const next = field === "replyContact"
      ? { ...collisionInput, replyContact: { ...collisionInput.replyContact, email: "changed@example.test" } }
      : { ...collisionInput, channelMatches: { email: true, phone: true } };

    await expect(persistLeadConsent(next)).rejects.toThrow("differs");

    expect(notes[0].body).toBe(original);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it("recovers an uncertain note-create response by reading the saved note without repeating its mutation", async () => {
    const { notes, fetcher } = notesStore();
    fetcher.mockImplementationOnce(async () => Response.json({ notes: [] }))
      .mockImplementationOnce(async (_url, init) => {
        notes.push({ id: "note-0", contactId: input.contactId, body: JSON.parse(String(init?.body)).body });
        throw new Error("response lost after save");
      });
    await expect(persistLeadConsent(input)).rejects.toThrow("response lost");
    await persistLeadConsent(input);
    expect(notes).toHaveLength(1);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "POST")).toHaveLength(1);
  });
  it("blocks conflicting consent on a replayed submission ID without another note", async () => {
    const { notes } = notesStore(); await persistLeadConsent(input);
    await expect(persistLeadConsent({ ...input, choice: { ...choice, marketing: true } })).rejects.toThrow("differs");
    expect(notes).toHaveLength(1);
  });
  it("does not create a note when existing notes cannot be checked", async () => {
    const fetcher = vi.fn(async () => Response.json({ message: "Forbidden" }, { status: 403 }));
    vi.stubGlobal("fetch", fetcher);
    await expect(persistLeadConsent(input)).rejects.toThrow("lookup");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("does not claim persistence after mismatched readback", async () => {
    const { fetcher } = notesStore();
    fetcher.mockImplementationOnce(async () => Response.json({ notes: [] }))
      .mockImplementationOnce(async () => Response.json({ note: { id: "note-0" } }))
      .mockImplementationOnce(async () => Response.json({ note: { id: "note-0", contactId: "another-contact", body: "wrong" } }));
    await expect(persistLeadConsent(input)).rejects.toThrow("readback");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it.each(["replyContact", "channelMatches"] as const)("rejects exact-note readback that changes %s", async field => {
    const { fetcher } = notesStore();
    let body = "";
    fetcher.mockImplementationOnce(async () => Response.json({ notes: [] }))
      .mockImplementationOnce(async (_url, init) => {
        body = JSON.parse(String(init?.body)).body;
        return Response.json({ note: { id: "note-0" } }, { status: 201 });
      })
      .mockImplementationOnce(async () => {
        const receipt = JSON.parse(body);
        if (field === "replyContact") receipt.replyContact.email = "changed@example.test";
        else receipt.channelMatches.phone = false;
        return Response.json({ note: { id: "note-0", contactId: input.contactId, body: JSON.stringify(receipt) } });
      });

    await expect(persistLeadConsent(input)).rejects.toThrow("readback");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it.each(["name", "serviceInterest", "clinicPreference", "message"] as const)("rejects exact-note readback that tampers with inquiry %s", async field => {
    const { fetcher } = notesStore();
    let body = "";
    fetcher.mockImplementationOnce(async () => Response.json({ notes: [] }))
      .mockImplementationOnce(async (_url, init) => {
        body = JSON.parse(String(init?.body)).body;
        return Response.json({ note: { id: "note-0" } }, { status: 201 });
      })
      .mockImplementationOnce(async () => {
        const receipt = JSON.parse(body);
        receipt.inquiry[field] = "Changed synthetic value";
        return Response.json({ note: { id: "note-0", contactId: input.contactId, body: JSON.stringify(receipt) } });
      });

    await expect(persistLeadConsent(input)).rejects.toThrow("readback");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});

describe("verified receipt staff-review marker", () => {
  const markerInput = { contactId: input.contactId, locationId: "approved-location", fieldId: "rrrrrrrrrrrrrrrrrrrr",
    receipt: { receiptId: "a".repeat(64), noteId: "verified-note" }, headers: input.headers };
  function markerStore() {
    let value: string | null = null;
    const contact = () => ({ id: markerInput.contactId, locationId: markerInput.locationId,
      customFields: value ? [{ id: markerInput.fieldId, value }] : [] });
    const fetcher = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "PUT") {
        value = JSON.parse(String(init.body)).customFields[0].fieldValue;
        return Response.json({ succeeded: true, contact: contact() });
      }
      return Response.json({ contact: contact() });
    });
    vi.stubGlobal("fetch", fetcher);
    return { fetcher, contact };
  }

  it("requires a distinct native field ID", () => {
    expect(validLeadReceiptField(markerInput.fieldId, ["other"])).toBe(true);
    for (const field of ["", "bad field", "short", "x".repeat(21)]) expect(validLeadReceiptField(field, [])).toBe(false);
    expect(validLeadReceiptField(markerInput.fieldId, [markerInput.fieldId])).toBe(false);
  });

  it("updates only the dedicated field, then verifies the exact contact and marker", async () => {
    const { fetcher } = markerStore();
    await signalLeadReceipt(markerInput);
    expect(fetcher.mock.calls.map(([, init]) => init?.method ?? "GET")).toEqual(["GET", "PUT", "GET"]);
    const [, options] = fetcher.mock.calls[1];
    expect(JSON.parse(String(options?.body))).toEqual({ customFields: [{ id: markerInput.fieldId, fieldValue: markerInput.receipt.receiptId }] });
    expect(fetcher.mock.calls.every(([url, options]) => String(url).endsWith(`/contacts/${markerInput.contactId}`) && options?.cache === "no-store")).toBe(true);
  });

  it("skips a duplicate marker but signals a new receipt for the same contact", async () => {
    const { fetcher } = markerStore();
    await signalLeadReceipt(markerInput);
    await signalLeadReceipt(markerInput);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "PUT")).toHaveLength(1);
    await signalLeadReceipt({ ...markerInput, receipt: { ...markerInput.receipt, receiptId: "b".repeat(64) } });
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "PUT")).toHaveLength(2);
  });

  it("does not replay a lost marker-write response; an explicit retry reads the saved marker", async () => {
    const { fetcher, contact } = markerStore();
    fetcher.mockImplementationOnce(async () => Response.json({ contact: contact() }))
      .mockImplementationOnce(async () => { throw new Error("response lost"); });
    await expect(signalLeadReceipt(markerInput)).rejects.toThrow("response lost");
    expect(fetcher).toHaveBeenCalledTimes(2);
    fetcher.mockImplementationOnce(async () => Response.json({ contact: { ...contact(), customFields: [{ id: markerInput.fieldId, value: markerInput.receipt.receiptId }] } }));
    await signalLeadReceipt(markerInput);
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "PUT")).toHaveLength(1);
  });

  it.each([
    { id: "wrong", locationId: "approved-location", customFields: [] },
    { id: input.contactId, locationId: "wrong", customFields: [] },
    { id: input.contactId, locationId: "approved-location" },
    { id: input.contactId, locationId: "approved-location", customFields: [{ id: "rrrrrrrrrrrrrrrrrrrr", value: 7 }] },
    { id: input.contactId, locationId: "approved-location", customFields: [{ id: "rrrrrrrrrrrrrrrrrrrr", value: "a" }, { id: "rrrrrrrrrrrrrrrrrrrr", value: "b" }] },
  ])("does not mutate an unverified contact/field response: %j", async contact => {
    const fetcher = vi.fn(async () => Response.json({ contact })); vi.stubGlobal("fetch", fetcher);
    await expect(signalLeadReceipt(markerInput)).rejects.toThrow("unverified");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each(["failed", "wrong-contact", "wrong-location", "wrong-marker"])("keeps %s marker mutation unverified without a second write", async failure => {
    const { fetcher, contact } = markerStore();
    fetcher.mockImplementationOnce(async () => Response.json({ contact: contact() }))
      .mockImplementationOnce(async () => Response.json({ succeeded: failure !== "failed", contact: {
        ...contact(), ...(failure === "wrong-contact" ? { id: "wrong" } : {}), ...(failure === "wrong-location" ? { locationId: "wrong" } : {}),
      } }));
    await expect(signalLeadReceipt(markerInput)).rejects.toThrow("unverified");
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === "PUT")).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(failure === "wrong-marker" ? 3 : 2);
  });

  it("does not mutate when marker lookup is unavailable", async () => {
    const fetcher = vi.fn(async () => Response.json({}, { status: 403 })); vi.stubGlobal("fetch", fetcher);
    await expect(signalLeadReceipt(markerInput)).rejects.toThrow("lookup");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

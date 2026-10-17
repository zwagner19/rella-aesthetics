import { describe, expect, it, vi } from "vitest";
import { createPackageClient, createSharedPackageClient, formatPackageTotal, packageMenuLabel, type PackageOperations, type PackagePurchaseResult } from "./package-client";

const input = { client: { firstName: "Test", lastName: "Client", email: "test@example.test", phone: "7075550100", assessmentContactConsent: true, marketingConsent: false }, token: "test-token" };
function operations(purchase: PackageOperations["purchase"]): PackageOperations {
  return { status: async () => ({ state: "DRAFT" }), listOfferings: async () => [], reviewPurchase: async () => { throw new Error("Not requested"); }, preparePurchase: async () => { throw new Error("Not requested"); }, purchase };
}

describe("package purchase safety", () => {
  it("keeps a lost purchase response pending and never submits a second purchase", async () => {
    const purchase = vi.fn(async () => { throw new Error("Response lost"); });
    const client = createPackageClient(operations(purchase));
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    await client.listOfferings("napa");
    expect(client.verificationPending()).toBe(true);
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    expect(purchase).toHaveBeenCalledTimes(1);
  });

  it("serializes duplicate clicks onto the same purchase operation", async () => {
    let finish!: (result: PackagePurchaseResult) => void;
    const purchase = vi.fn(() => new Promise<PackagePurchaseResult>(resolve => { finish = resolve; }));
    const client = createPackageClient(operations(purchase));
    const first = client.purchase(input);
    const second = client.purchase(input);
    expect(first).toBe(second);
    finish({ status: "confirmed", confirmationId: "verified-order" });
    expect(await first).toEqual({ status: "confirmed", confirmationId: "verified-order" });
    expect(purchase).toHaveBeenCalledTimes(1);
  });

  it("requires a verified confirmation identifier", async () => {
    const client = createPackageClient(operations(async () => ({ status: "confirmed", confirmationId: "" })));
    expect(await client.purchase(input)).toEqual({ status: "pending" });
  });

  it("allows only an explicit new purchase after confirmation and never clears a pending result", async () => {
    const purchase = vi.fn(async (): Promise<PackagePurchaseResult> => ({ status: "confirmed", confirmationId: "verified-order" }));
    const client = createPackageClient(operations(purchase));
    await client.purchase(input);
    expect(client.resetConfirmed()).toBe(true);
    await client.purchase(input);
    expect(purchase).toHaveBeenCalledTimes(2);
    const pending = createPackageClient(operations(async () => ({ status: "pending" })));
    await pending.purchase(input);
    expect(pending.resetConfirmed()).toBe(false);
    expect(pending.verificationPending()).toBe(true);
  });
});

describe("package copy", () => {
  it("hides monetary name fragments without removing clinical numbers", () => {
    expect(packageMenuLabel("6-session CO2 package | from $1,250")).toBe("6-session CO2 package");
    expect(packageMenuLabel("$600")).toBe("Treatment package");
  });

  it("formats only valid server totals", () => {
    expect(formatPackageTotal({ totalCents: 12750, currency: "USD" })).toBe("$127.50");
    expect(formatPackageTotal({ totalCents: Number.NaN, currency: "USD" })).toBeNull();
    expect(formatPackageTotal({ totalCents: 1.5, currency: "USD" })).toBeNull();
  });
});

describe("same-origin package contract", () => {
  function adapter(overrides: Record<string, unknown | Error> = {}) {
    const calls: Array<{ operation: string; body: unknown }> = [];
    const responses: Record<string, unknown> = {
      catalog: { ok: true, packages: [{ id: "opaque-package", name: "Verified package", description: "Native description.", benefitGroups: [] }] },
      start: { ok: true, quote: { totalCents: 60000, currency: "USD", needsCard: true }, cardFrameOrigin: "https://secure.example.test" },
      prepare: { ok: true, quote: { totalCents: 57500, currency: "USD", needsCard: true }, cardFrameOrigin: "https://secure.example.test" },
      payment: { ok: true, state: "PAYMENT_READY" },
      checkout: { ok: true, state: "CONFIRMED", confirmationId: "verified-purchase" },
      status: { ok: true, state: "DRAFT" },
      ...overrides,
    };
    const fetcher = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const operation = String(url).split("/").at(-1)!.split("?")[0];
      calls.push({ operation, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      expect(init?.credentials).toBe("same-origin");
      expect(init?.cache).toBe("no-store");
      const response = responses[operation];
      if (response instanceof Error) throw response;
      if (response instanceof Response) return response;
      return Response.json(response);
    }) as typeof fetch;
    return { fetcher, calls, responses };
  }

  it.each(["napa", "vacaville"] as const)("buys one package at %s using the post-contact native total and distinct payment/checkout calls", async location => {
    const { fetcher, calls } = adapter();
    const client = createSharedPackageClient(fetcher);
    const packages = await client.listOfferings(location);
    expect(packages[0].benefitGroups).toEqual([]);
    await client.reviewPurchase({ location, packageId: packages[0].id });
    const prepared = await client.preparePurchase(input.client);
    expect(prepared.totalCents).toBe(57500);
    expect(await client.purchase(input)).toEqual({ status: "confirmed", confirmationId: "verified-purchase" });
    expect(calls.map(call => call.operation)).toEqual(["catalog", "start", "prepare", "payment", "checkout"]);
    expect(calls[1].body).toEqual({ location, packageKey: "opaque-package" });
    expect(calls[2].body).toEqual({ info: { firstName: "Test", lastName: "Client", email: "test@example.test", phoneNumber: "7075550100" } });
    expect(calls[3].body).toEqual({ token: "test-token" });
    expect(calls[4].body).toEqual({});
  });

  it("does not attach payment or checkout before contact preparation, or after contact details change", async () => {
    const { fetcher, calls } = adapter();
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa");
    await client.reviewPurchase({ location: "napa", packageId: "opaque-package" });
    await expect(client.purchase(input)).rejects.toThrow("Review your contact details");
    expect(client.verificationPending()).toBe(false);
    await client.preparePurchase(input.client);
    await expect(client.purchase({ ...input, client: { ...input.client, email: "different@example.test" } })).rejects.toThrow("Review your contact details");
    expect(calls.some(call => call.operation === "payment" || call.operation === "checkout")).toBe(false);
  });

  it("requires contact consent before preparing a package and sends only the four supported contact fields", async () => {
    const { fetcher, calls } = adapter();
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa"); await client.reviewPurchase({ location: "napa", packageId: "opaque-package" });
    await expect(client.preparePurchase({ ...input.client, assessmentContactConsent: false, marketingConsent: true })).rejects.toThrow("Complete your contact details");
    expect(calls.filter(call => call.operation === "prepare")).toHaveLength(0);
    await client.preparePurchase(input.client);
    expect(calls.filter(call => call.operation === "prepare").map(call => call.body)).toEqual([
      { info: { firstName: "Test", lastName: "Client", email: "test@example.test", phoneNumber: "7075550100" } },
    ]);
  });

  it("stops after uncertain payment attachment and never auto-checks out or reattaches", async () => {
    const { fetcher, calls } = adapter({ payment: { ok: true, state: "PENDING" } });
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa");
    await client.reviewPurchase({ location: "napa", packageId: "opaque-package" });
    await client.preparePurchase(input.client);
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    expect(calls.filter(call => call.operation === "payment")).toHaveLength(1);
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(0);
  });

  it("preserves pending verification after checkout response loss and a new modal/client status read", async () => {
    const { fetcher, calls, responses } = adapter({ checkout: new Error("Response lost") });
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("vacaville");
    await client.reviewPurchase({ location: "vacaville", packageId: "opaque-package" });
    await client.preparePurchase(input.client);
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    responses.status = { ok: true, state: "PENDING" };
    const reopened = createSharedPackageClient(fetcher);
    expect(await reopened.status()).toEqual({ state: "PENDING" });
    expect(reopened.verificationPending()).toBe(true);
    await reopened.listOfferings("vacaville");
    expect(() => reopened.reviewPurchase({ location: "vacaville", packageId: "opaque-package" })).toThrow("verify your package purchase");
    expect(await reopened.purchase(input)).toEqual({ status: "pending" });
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(1);
  });

  it("does not infer package counts or alternatives from a name", async () => {
    const { fetcher } = adapter({ catalog: { ok: true, packages: [{ id: "opaque-package", name: "Six treatments of A and B", description: "Native source.", benefitGroups: [] }] } });
    const client = createSharedPackageClient(fetcher);
    expect((await client.listOfferings("napa"))[0].benefitGroups).toEqual([]);
  });

  it("deduplicates simultaneous reviews of the same package instead of creating two carts", async () => {
    const { fetcher, calls } = adapter();
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa");
    const first = client.reviewPurchase({ location: "napa", packageId: "opaque-package" });
    const second = client.reviewPurchase({ location: "napa", packageId: "opaque-package" });
    expect(first).toBe(second);
    await Promise.all([first, second]);
    expect(calls.filter(call => call.operation === "start")).toHaveLength(1);
  });

  it("keeps an ambiguous HTTP validation-class response pending without replaying checkout", async () => {
    const { fetcher, calls } = adapter({ checkout: Response.json({ ok: false, reason: "unverified" }, { status: 400 }) });
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa"); await client.reviewPurchase({ location: "napa", packageId: "opaque-package" }); await client.preparePurchase(input.client);
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    expect(await client.purchase(input)).toEqual({ status: "pending" });
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(1);
  });

  it("permits a deliberate retry after explicit server SAFE_TO_RETRY without reattaching the card", async () => {
    const { fetcher, calls, responses } = adapter({ checkout: { ok: false, stage: "SAFE_TO_RETRY", reason: "validated_rejection" } });
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa"); await client.reviewPurchase({ location: "napa", packageId: "opaque-package" }); await client.preparePurchase(input.client);
    await expect(client.purchase(input)).rejects.toThrow("could not be completed");
    responses.checkout = { ok: true, state: "CONFIRMED", confirmationId: "verified-retry" };
    expect(await client.purchase(input)).toEqual({ status: "confirmed", confirmationId: "verified-retry" });
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(2);
    expect(calls.filter(call => call.operation === "payment")).toHaveLength(1);
  });

  it("shows catalog-review-required offers but does not start a purchase for them", async () => {
    const { fetcher, calls } = adapter({ catalog: { ok: true, packages: [{ id: "opaque-package", name: "Review package", description: "Needs review.", reviewRequired: true }] } });
    const client = createSharedPackageClient(fetcher);
    expect((await client.listOfferings("napa"))[0].reviewRequired).toBe(true);
    await expect(client.reviewPurchase({ location: "napa", packageId: "opaque-package" })).rejects.toThrow("call Rella");
    expect(calls.filter(call => call.operation === "start")).toHaveLength(0);
  });

  it("discards old contact/card approval when the buyer explicitly starts another purchase", async () => {
    const { fetcher, calls } = adapter();
    const client = createSharedPackageClient(fetcher);
    await client.listOfferings("napa"); await client.reviewPurchase({ location: "napa", packageId: "opaque-package" }); await client.preparePurchase(input.client);
    await client.purchase(input);
    expect(client.resetConfirmed()).toBe(true);
    await expect(client.purchase(input)).rejects.toThrow("Review your contact details");
    expect(calls.filter(call => call.operation === "payment")).toHaveLength(1);
    expect(calls.filter(call => call.operation === "checkout")).toHaveLength(1);
  });
});

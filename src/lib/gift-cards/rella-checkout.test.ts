import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createPackageClient, PackageRequestError, type PackageOperations, type PackageSessionStatus } from "@/lib/guided-booking/package-client";
import { BOULEVARD_CHECKOUT, OFFERS, RELLA_PACKAGE_KEYS, blackFridayCheckoutMode, offerById, quoteMatchesOffer, rellaPackageKey } from "./config";
import { openRellaCheckout } from "./rella-checkout";

const offer = offerById("bf26-1000")!;
const KEY = rellaPackageKey("bf26-1000", "napa");

function fakeClient(over: Partial<PackageOperations> & { state?: PackageSessionStatus; totalCents?: number; ids?: string[] } = {}) {
  const calls: string[] = [];
  const offering = (id: string) => ({ id, displayName: "Black Friday", description: "", benefitGroups: [] });
  const ops: PackageOperations = {
    status: async () => { calls.push("status"); return over.state ?? { state: "NONE" }; },
    listOfferings: async () => { calls.push("catalog"); return (over.ids ?? [KEY]).map(offering); },
    reviewPurchase: async ({ packageId }) => {
      calls.push(`start:${packageId}`);
      return { offering: offering(packageId), totalCents: over.totalCents ?? 80_000, currency: "USD", needsCard: true, cardFrameOrigin: "https://book.experiencerella.com" };
    },
    preparePurchase: async () => { throw new Error("unused"); },
    purchase: async () => { throw new Error("unused"); },
    ...over,
  };
  return { client: createPackageClient(ops), calls };
}

describe("Black Friday keys for Rella's own package checkout", () => {
  it("derives every public key from Zach's Boulevard package id at that clinic", () => {
    for (const o of OFFERS) {
      for (const clinic of BOULEVARD_CHECKOUT.clinics) {
        const uuid = BOULEVARD_CHECKOUT.packages[o.id][clinic.id].replace(/^p_/, "");
        const digest = createHash("sha256").update(`${clinic.id}|urn:blvd:ProductLocation:${uuid}`).digest("hex");
        expect(RELLA_PACKAGE_KEYS[o.id][clinic.id]).toBe(`package-${digest.slice(0, 24)}`);
      }
    }
    expect(new Set(Object.values(RELLA_PACKAGE_KEYS).flatMap((v) => Object.values(v))).size).toBe(4);
    expect(() => rellaPackageKey("nope" as never, "napa")).toThrow("unknown-package");
  });

  it("only accepts a server quote equal to the advertised price", () => {
    expect(quoteMatchesOffer(offer, { totalCents: 80_000, currency: "USD" })).toBe(true);
    expect(quoteMatchesOffer(offer, { totalCents: 80_001, currency: "USD" })).toBe(false);
    expect(quoteMatchesOffer(offer, { totalCents: 160_000, currency: "USD" })).toBe(false);
    expect(quoteMatchesOffer(offer, { totalCents: 80_000, currency: "CAD" })).toBe(false);
    expect(quoteMatchesOffer(offerById("bf26-2100")!, { totalCents: 160_000, currency: "USD" })).toBe(true);
  });
});

describe("Black Friday checkout mode", () => {
  it("is closed in production no matter which flags are set", () => {
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "production", BF_RELLA_CHECKOUT: "1", BF_BOULEVARD_WIDGET_CHECKOUT: "1" })).toBe("closed");
  });
  it("is closed without a flag and uses Rella's checkout on a flagged preview", () => {
    expect(blackFridayCheckoutMode({})).toBe("closed");
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview" })).toBe("closed");
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview", BF_RELLA_CHECKOUT: "true" })).toBe("closed");
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview", BF_RELLA_CHECKOUT: "1" })).toBe("rella");
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview", BF_BOULEVARD_WIDGET_CHECKOUT: "1" })).toBe("rella");
  });
  it("can be forced back to Boulevard's widget", () => {
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview", BF_BOULEVARD_WIDGET_CHECKOUT: "1", BF_RELLA_CHECKOUT: "0" })).toBe("widget");
    expect(blackFridayCheckoutMode({ VERCEL_ENV: "preview", BF_RELLA_CHECKOUT: "0" })).toBe("closed");
  });
});

describe("opening Rella's checkout for a Black Friday offer", () => {
  it("starts the one matching package and is ready at the advertised price", async () => {
    const { client, calls } = fakeClient();
    const result = await openRellaCheckout(client, offer, "napa");
    expect(result.kind).toBe("ready");
    expect(calls).toEqual(["status", "catalog", `start:${KEY}`]);
  });

  it("fails closed when the server total is not the advertised price", async () => {
    expect((await openRellaCheckout(fakeClient({ totalCents: 100_000 }).client, offer, "napa")).kind).toBe("mismatch");
    expect((await openRellaCheckout(fakeClient({ totalCents: 0 }).client, offer, "napa")).kind).toBe("mismatch");
  });

  it("never starts a cart when the package is not in the live catalog", async () => {
    const { client, calls } = fakeClient({ ids: ["package-somethingelse"] });
    expect((await openRellaCheckout(client, offer, "napa")).kind).toBe("unavailable");
    expect(calls).toEqual(["status", "catalog"]);
  });

  it("never starts another purchase while a payment is unverified", async () => {
    for (const state of ["PENDING", "PAYMENT_READY"] as const) {
      const { client, calls } = fakeClient({ state: { state } });
      expect((await openRellaCheckout(client, offer, "napa")).kind).toBe("pending");
      expect(calls).toEqual(["status"]);
    }
  });

  it("asks before buying again on a device with a confirmed purchase", async () => {
    const { client, calls } = fakeClient({ state: { state: "CONFIRMED", confirmationId: "c1" } });
    expect(await openRellaCheckout(client, offer, "napa")).toEqual({ kind: "already", confirmationId: "c1" });
    expect(calls).toEqual(["status"]);
    expect((await openRellaCheckout(client, offer, "napa", { buyAnother: true })).kind).toBe("ready");
  });

  it("reports unavailable (so the page can fall back) when the checkout is down", async () => {
    const down = fakeClient({ status: async () => { throw new PackageRequestError("down"); } });
    expect((await openRellaCheckout(down.client, offer, "napa")).kind).toBe("unavailable");
    const noStart = fakeClient({ reviewPurchase: async () => { throw new PackageRequestError("packages_unavailable"); } });
    expect((await openRellaCheckout(noStart.client, offer, "vacaville")).kind).toBe("unavailable");
  });
});

import { describe, expect, it, vi } from "vitest";
import { createPackageIdentityClient, restorePackageWallet } from "./package-client";

describe("verified package ownership contract", () => {
  it.each(["napa", "vacaville"] as const)("verifies a profile and hands one covered service to booking at %s without redeeming a voucher", async location => {
    const calls: Array<{ operation: string; body: unknown }> = [];
    const profile = { id: "opaque-profile", name: "Test Profile", dobRequired: true, dobOnFile: false };
    const fetcher = vi.fn(async (url: RequestInfo | URL, init?: RequestInit) => {
      const operation = String(url).split("/").at(-1)!.split("?")[0];
      const body = init?.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ operation, body });
      expect(init?.credentials).toBe("same-origin");
      expect(init?.cache).toBe("no-store");
      let data: unknown;
      if (operation === "auth-code") data = { state: "CODE_SENT", maskedDestination: "t***@example.test" };
      else if (operation === "auth-verify") data = { state: "PROFILE_REQUIRED", profiles: [profile] };
      else if (operation === "auth-profile") data = body.dob ? { state: "AUTHENTICATED", profile: { name: profile.name } } : { state: "DOB_REQUIRED", profiles: [profile] };
      else if (operation === "owned") data = { state: "AUTHENTICATED", location, profile: { name: profile.name }, redemption: "STAFF_CHECKOUT", vouchers: [
        { id: "opaque-voucher", title: "Native package", expiresOn: null, eligibleAtLocation: true, restrictions: [], services: [{ key: `${location}/covered-service`, name: "Covered service", category: "Laser" }] },
      ] };
      else if (operation === "book-owned") data = { location, serviceKey: `${location}/covered-service` };
      else data = {};
      return Response.json({ ok: true, ...data as object });
    }) as typeof fetch;
    const client = createPackageIdentityClient(fetcher);
    expect(await client.sendCode({ method: "email", contact: "test@example.test" })).toEqual({ state: "CODE_SENT", maskedDestination: "t***@example.test" });
    expect((await client.verifyCode("012345")).state).toBe("PROFILE_REQUIRED");
    expect((await client.selectProfile({ profileId: "opaque-profile" })).state).toBe("DOB_REQUIRED");
    expect((await client.selectProfile({ profileId: "opaque-profile", dob: "1990-01-02", captureDob: true })).state).toBe("AUTHENTICATED");
    const wallet = await client.owned(location);
    expect(wallet.vouchers).toHaveLength(1);
    expect(wallet.redemption).toBe("STAFF_CHECKOUT");
    expect(await client.bookOwned({ location, voucherId: wallet.vouchers[0].id, serviceKey: wallet.vouchers[0].services[0].key })).toEqual({ location, serviceKey: `${location}/covered-service` });
    expect(calls.at(-1)?.body).toEqual({ location, voucherId: "opaque-voucher", serviceKey: `${location}/covered-service` });
    expect(calls.map(call => call.operation)).toEqual(["auth-code", "auth-verify", "auth-profile", "auth-profile", "owned", "book-owned"]);
    expect(calls.some(call => /redeem|checkout|payment/.test(call.operation))).toBe(false);
  });

  it("does not send malformed verification codes or birthdates", async () => {
    const fetcher = vi.fn() as unknown as typeof fetch;
    const client = createPackageIdentityClient(fetcher);
    await expect(client.verifyCode("12345")).rejects.toThrow("6-digit");
    await expect(client.selectProfile({ profileId: "opaque-profile", dob: "01/02/1990" })).rejects.toThrow("date of birth");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("rejects a wallet whose services belong to another clinic", async () => {
    const fetcher = vi.fn(async () => Response.json({ ok: true, state: "AUTHENTICATED", location: "napa", profile: { name: "Test" }, redemption: "STAFF_CHECKOUT", vouchers: [
      { id: "opaque-voucher", title: "Package", expiresOn: null, eligibleAtLocation: true, restrictions: [], services: [{ key: "vacaville/covered-service", name: "Covered service", category: "Laser" }] },
    ] })) as typeof fetch;
    await expect(createPackageIdentityClient(fetcher).owned("napa")).rejects.toThrow("could not be verified");
  });

  it("rejects an owned-booking response that changes the chosen service", async () => {
    const fetcher = vi.fn(async () => Response.json({ ok: true, location: "napa", serviceKey: "napa/different-service" })) as typeof fetch;
    await expect(createPackageIdentityClient(fetcher).bookOwned({ location: "napa", voucherId: "opaque-voucher", serviceKey: "napa/covered-service" })).rejects.toThrow("could not be verified");
  });

  it("reopens an existing verified account by reading its wallet without requesting another code", async () => {
    const fetcher = vi.fn(async () => Response.json({ ok: true, state: "AUTHENTICATED", location: "napa", profile: { name: "Test Profile" }, redemption: "STAFF_CHECKOUT", vouchers: [] })) as typeof fetch;
    const wallet = await restorePackageWallet(createPackageIdentityClient(fetcher), "napa");
    expect(wallet?.profile.name).toBe("Test Profile");
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(String(vi.mocked(fetcher).mock.calls[0][0])).toBe("/api/package-booking/owned?location=napa");
  });

  it("returns to verification only for explicit expired/missing identity, not for an unverified network response", async () => {
    const required = vi.fn(async () => Response.json({ ok: false, reason: "identity_required" }, { status: 401 })) as typeof fetch;
    expect(await restorePackageWallet(createPackageIdentityClient(required), "vacaville")).toBeNull();
    const interrupted = vi.fn(async () => { throw new Error("Network interrupted"); }) as typeof fetch;
    await expect(restorePackageWallet(createPackageIdentityClient(interrupted), "vacaville")).rejects.toThrow("could not be verified");
  });
});

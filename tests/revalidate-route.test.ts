import { beforeEach, describe, expect, it, vi } from "vitest";

// The route reads SANITY_WEBHOOK_SECRET at module load, so the module must be
// imported after the environment is arranged for each scenario.
describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("fails closed with 401 when SANITY_WEBHOOK_SECRET is unset", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "");
    delete process.env.SANITY_WEBHOOK_SECRET;
    const { POST } = await import("@/app/api/revalidate/route");
    const { NextRequest } = await import("next/server");

    const res = await POST(
      new NextRequest("http://localhost/api/revalidate", { method: "POST" }),
    );
    expect(res.status).toBe(401);
  });

  it("rejects requests with a wrong bearer token", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "correct-secret");
    const { POST } = await import("@/app/api/revalidate/route");
    const { NextRequest } = await import("next/server");

    const res = await POST(
      new NextRequest("http://localhost/api/revalidate", {
        method: "POST",
        headers: { authorization: "Bearer wrong-secret" },
      }),
    );
    expect(res.status).toBe(401);
  });
});

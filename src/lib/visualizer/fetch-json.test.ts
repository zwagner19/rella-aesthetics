import { describe, expect, it } from "vitest";
import { readVisualizerResponse } from "./fetch-json";

describe("readVisualizerResponse", () => {
  it("parses valid JSON", async () => {
    const res = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    const data = await readVisualizerResponse<{ ok: boolean }>(res);
    expect(data.ok).toBe(true);
  });

  it("surfaces 413 entity too large as a friendly error", async () => {
    const res = new Response("Request Entity Too Large", { status: 413 });
    await expect(readVisualizerResponse(res)).rejects.toThrow(/too large/i);
  });

  it("surfaces non-JSON error bodies", async () => {
    const res = new Response("Internal Server Error", { status: 500 });
    await expect(readVisualizerResponse(res)).rejects.toThrow(/Internal Server Error/);
  });
});

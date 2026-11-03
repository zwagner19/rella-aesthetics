import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { withWebsiteSeo } from "./website-seo";
// Metadata merge/failure cases run without a Next request context. The separate
// website-seo-cache suite exercises the real framework cache and patched fetch.
vi.mock("next/cache", () => ({ unstable_cache: (read: unknown) => read }));
const defaults = {
  title: "Original",
  description: "Original description",
  alternates: { canonical: "/locations/napa" },
  openGraph: { images: ["/original.jpg"], url: "/locations/napa" },
  robots: { index: true },
};
beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("published metadata", () => {
  it("keeps exact defaults for drafts, missing settings or an outage", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(null));
    vi.stubGlobal("fetch", fetcher);
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    expect(console.warn).not.toHaveBeenCalled();
    fetcher.mockRejectedValue(new Error("offline"));
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    expect(console.warn).toHaveBeenCalledWith("[website-seo] Optional metadata unavailable", { path: "/locations/napa", reason: "request" });
  });
  it.each([503, 502, 404, 302])("keeps defaults on HTTP %i without consuming an error body", async (status) => {
    const response = new Response("private upstream detail", { status });
    const read = vi.spyOn(response, "json");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    expect(read).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith("[website-seo] Optional metadata unavailable", { path: "/locations/napa", reason: "http", status });
  });
  it("keeps defaults when the response body is malformed or closes after headers", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("not JSON"));
    vi.stubGlobal("fetch", fetcher);
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    fetcher.mockResolvedValue({ ok: true, json: () => Promise.reject(new Error("socket closed: secret upstream detail")) });
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain("secret");
  });
  it("changes only title and descriptions while preserving canonical, images and indexability", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          title: "Napa House | Rella Aesthetics",
          description: "Explore Rella Aesthetics in downtown Napa, California.",
        }),
      ),
    );
    const m = await withWebsiteSeo("/locations/napa", defaults);
    expect(m.title).toEqual({ absolute: "Napa House | Rella Aesthetics" });
    expect(m.alternates).toEqual(defaults.alternates);
    expect(m.robots).toEqual(defaults.robots);
    expect(m.openGraph).toMatchObject(defaults.openGraph);
    expect(m.openGraph).toMatchObject({ title: "Napa House | Rella Aesthetics", description: "Explore Rella Aesthetics in downtown Napa, California." });
    expect(m.twitter).toMatchObject({ title: "Napa House | Rella Aesthetics", description: "Explore Rella Aesthetics in downtown Napa, California." });
    expect(fetch).toHaveBeenCalledWith(
      "https://rella-hq.vercel.app/api/public/website-seo?path=%2Flocations%2Fnapa",
      { cache: "no-store", redirect: "error", signal: expect.any(AbortSignal) },
    );
  });
  it("preserves root social artwork when a page has no page-specific image", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({
            title: "Rella Aesthetics in Napa and Vacaville",
            description:
              "Explore Rella Aesthetics in Napa and Vacaville, California.",
          }),
        ),
    );
    const result = await withWebsiteSeo("/", {
      title: "Rella",
      alternates: { canonical: "/" },
    });
    expect(result.openGraph).toMatchObject({
      type: "website",
      siteName: "Rella Aesthetics",
      images: [
        expect.objectContaining({
          alt: "Rella Aesthetics in Napa and Vacaville",
        }),
      ],
    });
    expect(result.twitter).toMatchObject({
      card: "summary_large_image",
      images: [expect.stringContaining("rella_two_locations")],
    });
  });
  it("does not call HQ for unapproved paths or accept executable markup", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        title: "<script>bad</script>",
        description: "A sufficiently long description for this test.",
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    expect(await withWebsiteSeo("/services/weight-loss", defaults)).toBe(
      defaults,
    );
    expect(fetcher).not.toHaveBeenCalled();
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
  });
});

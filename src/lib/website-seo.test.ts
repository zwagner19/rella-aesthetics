import { afterEach, describe, expect, it, vi } from "vitest";
import { withWebsiteSeo } from "./website-seo";
const defaults = {
  title: "Original",
  description: "Original description",
  alternates: { canonical: "/locations/napa" },
  openGraph: { images: ["/original.jpg"], url: "/locations/napa" },
  robots: { index: true },
};
afterEach(() => vi.unstubAllGlobals());
describe("published metadata", () => {
  it("keeps exact defaults for drafts, missing settings or an outage", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(null));
    vi.stubGlobal("fetch", fetcher);
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
    fetcher.mockRejectedValue(new Error("offline"));
    expect(await withWebsiteSeo("/locations/napa", defaults)).toBe(defaults);
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

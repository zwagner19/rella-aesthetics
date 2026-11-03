// Load the same async-context baseline as the Next server before its internals.
import "next/dist/server/node-environment-baseline";
import { setImmediate } from "node:timers/promises";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createPatchedFetcher, NEXT_PATCH_SYMBOL } from "next/dist/server/lib/patch-fetch";
import {
  CacheHandler,
  IncrementalCache,
  type CacheHandlerValue,
} from "next/dist/server/lib/incremental-cache";
import type { IncrementalCacheValue } from "next/dist/server/response-cache";
import {
  workAsyncStorage,
  type WorkStore,
} from "next/dist/server/app-render/work-async-storage.external";
import { workUnitAsyncStorage } from "next/dist/server/app-render/work-unit-async-storage.external";
import { withWebsiteSeo } from "./website-seo";

const path = "/locations/napa";
const endpoint = `https://rella-hq.vercel.app/api/public/website-seo?path=${encodeURIComponent(path)}`;
const defaults = { title: "Source title", description: "Source description" };
const published = {
  title: "Napa House | Rella Aesthetics",
  description: "Explore Rella Aesthetics in downtown Napa, California.",
};

/** Only the storage backend is replaced; Next owns keys, TTLs and refreshes. */
class MemoryCacheHandler extends CacheHandler {
  readonly entries = new Map<string, CacheHandlerValue>();

  async get(key: string) {
    return this.entries.get(key) ?? null;
  }

  async set(key: string, value: IncrementalCacheValue | null) {
    this.entries.set(key, {
      value,
      lastModified: performance.timeOrigin + performance.now(),
    });
  }

  expire() {
    for (const entry of this.entries.values()) entry.lastModified -= 61_000;
  }
}

function harness(network: typeof fetch) {
  const cache = new IncrementalCache({
    dev: false,
    requestHeaders: {},
    CurCacheHandler: MemoryCacheHandler,
    getPrerenderManifest: () => ({
      version: 4,
      routes: {},
      dynamicRoutes: {},
      notFoundRoutes: [],
      preview: {
        previewModeId: "test-preview",
        previewModeSigningKey: "test-signing",
        previewModeEncryptionKey: "test-encryption",
      },
    }),
  });
  // createPatchedFetcher marks this global as patched; include it in cleanup.
  vi.stubGlobal(NEXT_PATCH_SYMBOL, false);
  vi.stubGlobal(
    "fetch",
    createPatchedFetcher(network, { workAsyncStorage, workUnitAsyncStorage }),
  );
  return {
    expire: () => (cache.cacheHandler as MemoryCacheHandler).expire(),
    async render<T>(read: () => Promise<T>, isStaticGeneration = false) {
      // The tested cache APIs only consume these WorkStore fields. Supplying
      // the real async context is essential: calling the helper directly would
      // bypass Next's background refresh path and miss the original defect.
      const store = {
        route: path,
        page: `${path}/page`,
        isStaticGeneration,
        isDraftMode: false,
        incrementalCache: cache,
        nextFetchId: 1,
        pendingRevalidates: {},
        shouldTrackFetchMetrics: false,
      } as WorkStore;
      const value = await workAsyncStorage.run(store, read);
      return {
        value,
        async drain() {
          const outcomes = await Promise.allSettled(
            Object.values(store.pendingRevalidates ?? {}),
          );
          // Let streamed response-cache writes and attached rejection handlers
          // finish before asserting console output or starting another request.
          await setImmediate();
          return outcomes;
        },
      };
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("website SEO with the real Next cache and patched fetch", () => {
  it("reproduces the former escaped stale-fetch error despite a caller catch", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const outage = new TypeError("synthetic connection reset");
    const network = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(published));
    const cache = harness(network);
    // This is the previous cache boundary, retained to prove why a unit test
    // mocking global fetch alone could not expose the background failure.
    async function previousLookup() {
      try {
        const response = await fetch(endpoint, {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(1200),
          redirect: "error",
        });
        return await response.json();
      } catch {
        return null;
      }
    }
    const first = await cache.render(previousLookup);
    expect(first.value).toEqual(published);
    await first.drain();
    cache.expire();
    network.mockRejectedValueOnce(outage);
    const stale = await cache.render(previousLookup);
    expect(stale.value).toEqual(published);
    await stale.drain();
    expect(network.mock.calls[1][1]?.signal).toBeUndefined();
    expect(errorLog).toHaveBeenCalledWith(outage);
  });

  it("reuses published overrides, refreshes edits, applies reset and recovers after failure", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const network = vi.fn<typeof fetch>().mockImplementation(async () => Response.json(published));
    const cache = harness(network);
    const read = () => withWebsiteSeo(path, defaults);
    const first = await cache.render(read);
    expect(first.value.title).toEqual({ absolute: published.title });
    await first.drain();
    expect((await cache.render(read)).value.title).toEqual({ absolute: published.title });
    expect(network).toHaveBeenCalledTimes(1);

    const edited = { ...published, title: "Updated Napa House | Rella Aesthetics" };
    cache.expire();
    network.mockImplementation(async () => Response.json(edited));
    const publishing = await cache.render(read);
    expect(publishing.value.title).toEqual({ absolute: published.title });
    await publishing.drain();
    expect((await cache.render(read)).value.title).toEqual({ absolute: edited.title });

    cache.expire();
    network.mockImplementation(async () => Response.json(null));
    const resetting = await cache.render(read);
    await resetting.drain();
    expect((await cache.render(read)).value).toBe(defaults);

    cache.expire();
    network.mockRejectedValue(new TypeError("synthetic socket failure"));
    const failing = await cache.render(read);
    expect(failing.value).toBe(defaults);
    expect((await failing.drain()).every((outcome) => outcome.status === "fulfilled")).toBe(true);
    const callsAfterFailure = network.mock.calls.length;
    expect((await cache.render(read)).value).toBe(defaults);
    expect(network).toHaveBeenCalledTimes(callsAfterFailure);

    cache.expire();
    network.mockImplementation(async () => Response.json(published));
    const recovering = await cache.render(read);
    expect(recovering.value).toBe(defaults);
    await recovering.drain();
    expect((await cache.render(read)).value.title).toEqual({ absolute: published.title });
    expect(errorLog).not.toHaveBeenCalled();
  });

  it("keeps the 1.2-second abort signal on a stale refresh and contains its rejection", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const network = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(published));
    const cache = harness(network);
    const read = () => withWebsiteSeo(path, defaults);
    const first = await cache.render(read);
    await first.drain();
    cache.expire();
    let signal: AbortSignal | null | undefined;
    network.mockImplementationOnce((_input, options) => {
      signal = options?.signal;
      return new Promise((_resolve, reject) => {
        signal?.addEventListener("abort", () => reject(signal?.reason), { once: true });
      });
    });
    const stale = await cache.render(read);
    expect(stale.value.title).toEqual({ absolute: published.title });
    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal?.aborted).toBe(false);
    const outcomes = await stale.drain();
    expect(signal?.aborted).toBe(true);
    expect(outcomes.every((outcome) => outcome.status === "fulfilled")).toBe(true);
    expect((await cache.render(read)).value).toBe(defaults);
    expect(errorLog).not.toHaveBeenCalled();
  });

  it("bounds a cold lookup whose headers arrive but JSON body stalls", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const warningLog = vi.spyOn(console, "warn").mockImplementation(() => {});
    const network = vi.fn<typeof fetch>().mockImplementation(async (_input, options) => {
      const signal = options?.signal;
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('{"title":'));
          signal?.addEventListener("abort", () => controller.error(signal.reason), { once: true });
        },
      });
      return new Response(body, { headers: { "content-type": "application/json" } });
    });
    const cache = harness(network);
    const cold = await cache.render(() => withWebsiteSeo(path, defaults));
    expect(cold.value).toBe(defaults);
    await cold.drain();
    expect(network.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(warningLog).toHaveBeenCalledExactlyOnceWith(
      "[website-seo] Optional metadata unavailable",
      { path, reason: "timeout" },
    );
    expect(errorLog).not.toHaveBeenCalled();
  });

  it("keeps cached overrides separate for each approved page", async () => {
    const contact = { ...published, title: "Contact the team | Rella Aesthetics" };
    const network = vi.fn<typeof fetch>().mockImplementation(async (input) =>
      Response.json(new URL(String(input)).searchParams.get("path") === "/contact" ? contact : published),
    );
    const cache = harness(network);
    const napa = await cache.render(() => withWebsiteSeo(path, defaults));
    await napa.drain();
    const other = await cache.render(() => withWebsiteSeo("/contact", defaults));
    await other.drain();
    expect(napa.value.title).toEqual({ absolute: published.title });
    expect(other.value.title).toEqual({ absolute: contact.title });
    expect((await cache.render(() => withWebsiteSeo(path, defaults))).value.title).toEqual({ absolute: published.title });
    expect((await cache.render(() => withWebsiteSeo("/contact", defaults))).value.title).toEqual({ absolute: contact.title });
    expect(network).toHaveBeenCalledTimes(2);
  });

  it("waits for safe defaults during foreground static regeneration", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const network = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json(published));
    const cache = harness(network);
    const read = () => withWebsiteSeo(path, defaults);
    const first = await cache.render(read);
    await first.drain();
    cache.expire();
    network.mockRejectedValueOnce(new TypeError("synthetic connection reset"));
    const regenerated = await cache.render(read, true);
    expect(regenerated.value).toBe(defaults);
    await regenerated.drain();
    expect(errorLog).not.toHaveBeenCalled();
  });
});

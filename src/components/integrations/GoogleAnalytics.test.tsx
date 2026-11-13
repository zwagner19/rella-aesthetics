import { afterEach, describe, expect, it, vi } from "vitest";
import { Children, type ReactElement } from "react";
import { runInNewContext } from "node:vm";

const ORIGINAL_GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type ScriptProps = {
  id?: string;
  src?: string;
  strategy?: string;
  children?: string;
};

type AnalyticsWindow = {
  dataLayer?: ArrayLike<unknown>[];
  gtag?: (...args: unknown[]) => void;
  location?: { hostname: string };
  document?: {
    head: { appendChild: (el: Record<string, unknown>) => void };
    createElement: (tag: string) => Record<string, unknown>;
  };
};

function fakeWindow(hostname: string) {
  const appended: Record<string, unknown>[] = [];
  const window: AnalyticsWindow = {
    location: { hostname },
    document: {
      head: { appendChild: (el) => appended.push(el) },
      createElement: (tag) => ({ tag }),
    },
  };
  return { window, appended };
}

afterEach(() => {
  vi.resetModules();
  if (ORIGINAL_GA_ID === undefined) {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  } else {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = ORIGINAL_GA_ID;
  }
});

async function loadWithId(measurementId?: string) {
  vi.resetModules();
  if (measurementId === undefined) {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  } else {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = measurementId;
  }
  return import("./GoogleAnalytics");
}

function bootstrapFrom(element: unknown) {
  const script = element as ReactElement<ScriptProps>;
  expect(Children.count(script)).toBe(1);
  expect(script.props).toMatchObject({
    id: "google-analytics-bootstrap",
    strategy: "afterInteractive",
  });
  return script.props.children ?? "";
}

function commands(window: AnalyticsWindow) {
  return (window.dataLayer ?? []).map((entry) => Array.from(entry));
}

describe("GoogleAnalytics production bootstrap", () => {
  it("renders nothing without a valid GA4 measurement ID", async () => {
    for (const invalid of [
      undefined,
      "",
      "G-",
      "UA-12345-1",
      "g-wkds1158y1",
      "G-123;alert(1)",
      '<script>alert("x")</script>',
    ]) {
      const { GoogleAnalytics } = await loadWithId(invalid);
      expect(GoogleAnalytics(), JSON.stringify(invalid)).toBeNull();
    }
  });

  it("configures GA4 and loads gtag.js on the live domain", async () => {
    const { GoogleAnalytics } = await loadWithId("  G-WKDS1158Y1  ");
    const bootstrap = bootstrapFrom(GoogleAnalytics());

    for (const host of ["experiencerella.com", "www.experiencerella.com"]) {
      const { window, appended } = fakeWindow(host);
      runInNewContext(bootstrap, { window, Date });

      expect(commands(window).map((command) => command[0])).toEqual(["js", "config"]);
      expect(commands(window)[1]).toEqual(["config", "G-WKDS1158Y1"]);
      expect(window.gtag).toBeTypeOf("function");
      expect(appended).toHaveLength(1);
      expect(appended[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-WKDS1158Y1");
    }
  });

  it("sends nothing from Vercel, localhost, or other hosts", async () => {
    const { GoogleAnalytics } = await loadWithId("G-WKDS1158Y1");
    const bootstrap = bootstrapFrom(GoogleAnalytics());

    for (const host of [
      "rella-aesthetics.vercel.app",
      "rella-aesthetics-git-codex-amie-cont-d87d57-zwagner19s-projects.vercel.app",
      "localhost",
      "experiencerella.com.evil.example",
      "",
    ]) {
      const { window, appended } = fakeWindow(host);
      runInNewContext(bootstrap, { window, Date });
      window.gtag?.("event", "select_content", { item_id: "booking_intent" });

      expect(commands(window).filter((c) => c[0] === "config"), host).toHaveLength(0);
      expect(appended, host).toHaveLength(0);
      expect(window.gtag, host).toBeTypeOf("function");
    }
  });

  it("queues booking-intent events and never configures the property twice", async () => {
    const { GoogleAnalytics } = await loadWithId("G-WKDS1158Y1");
    const bootstrap = bootstrapFrom(GoogleAnalytics());
    const { window, appended } = fakeWindow("experiencerella.com");

    runInNewContext(bootstrap, { window, Date });
    runInNewContext(bootstrap, { window, Date });
    window.gtag?.("event", "select_content", {
      content_type: "conversion_intent",
      item_id: "booking_intent",
      location: "napa",
    });

    const queued = commands(window);
    expect(queued.filter((command) => command[0] === "config")).toHaveLength(1);
    expect(queued.filter((command) => command[0] === "js")).toHaveLength(1);
    expect(appended).toHaveLength(1);
    expect(queued.at(-1)).toEqual([
      "event",
      "select_content",
      {
        content_type: "conversion_intent",
        item_id: "booking_intent",
        location: "napa",
      },
    ]);
  });
});

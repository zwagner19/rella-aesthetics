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
};

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

function scriptsFrom(element: ReactElement<{ children: ReactElement<ScriptProps>[] }>) {
  return Children.toArray(element.props.children) as ReactElement<ScriptProps>[];
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

  it("loads gtag and emits the standard js + config queue commands", async () => {
    const { GoogleAnalytics } = await loadWithId("  G-WKDS1158Y1  ");
    const scripts = scriptsFrom(
      GoogleAnalytics() as ReactElement<{ children: ReactElement<ScriptProps>[] }>,
    );

    expect(scripts).toHaveLength(2);
    expect(scripts[0].props).toMatchObject({
      id: "google-analytics-loader",
      src: "https://www.googletagmanager.com/gtag/js?id=G-WKDS1158Y1",
      strategy: "afterInteractive",
    });

    const bootstrap = scripts[1];
    expect(bootstrap.props).toMatchObject({
      id: "google-analytics-bootstrap",
      strategy: "afterInteractive",
    });

    const window: AnalyticsWindow = {};
    runInNewContext(bootstrap.props.children ?? "", { window, Date });

    expect(commands(window).map((command) => command[0])).toEqual(["js", "config"]);
    expect(commands(window)[1]).toEqual(["config", "G-WKDS1158Y1"]);
    expect(window.gtag).toBeTypeOf("function");
  });

  it("queues booking-intent events and never configures the property twice", async () => {
    const { GoogleAnalytics } = await loadWithId("G-WKDS1158Y1");
    const scripts = scriptsFrom(
      GoogleAnalytics() as ReactElement<{ children: ReactElement<ScriptProps>[] }>,
    );
    const bootstrap = scripts[1].props.children ?? "";
    const window: AnalyticsWindow = {};

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

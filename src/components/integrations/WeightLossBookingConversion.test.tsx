import React from "react";
import { describe, expect, it, afterEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WEIGHT_LOSS_GTM_ENV_VAR } from "@/components/integrations/WeightLossBookingGtm";

const ORIGINAL_GTM = process.env[WEIGHT_LOSS_GTM_ENV_VAR];

afterEach(() => {
  vi.resetModules();
  if (ORIGINAL_GTM === undefined) {
    delete process.env[WEIGHT_LOSS_GTM_ENV_VAR];
  } else {
    process.env[WEIGHT_LOSS_GTM_ENV_VAR] = ORIGINAL_GTM;
  }
});

describe("WeightLossBookingGtm", () => {
  it("renders nothing without a valid container id", async () => {
    delete process.env[WEIGHT_LOSS_GTM_ENV_VAR];
    const { WeightLossBookingGtm, WeightLossBookingGtmNoScript } = await import(
      "@/components/integrations/WeightLossBookingGtm"
    );
    expect(WeightLossBookingGtm()).toBeNull();
    expect(renderToStaticMarkup(<WeightLossBookingGtmNoScript />)).toBe("");
  });

  it("loads the configured container once", async () => {
    vi.resetModules();
    process.env[WEIGHT_LOSS_GTM_ENV_VAR] = "GTM-N4R7NHBJ";
    const { WeightLossBookingGtm } = await import(
      "@/components/integrations/WeightLossBookingGtm"
    );
    const el = WeightLossBookingGtm() as React.ReactElement<{
      id: string;
      children: string;
    }>;
    expect(el.props.id).toBe("weight-loss-booking-gtm");
    expect(el.props.children).toContain("GTM-N4R7NHBJ");
  });
});

describe("WeightLossBookingConversionTracker", () => {
  it("renders no DOM (tracking-only component)", async () => {
    const { WeightLossBookingConversionTracker } = await import(
      "@/components/integrations/WeightLossBookingConversionTracker"
    );
    expect(
      renderToStaticMarkup(
        <WeightLossBookingConversionTracker confirmed={false} location="napa" />,
      ),
    ).toBe("");
  });
});

import { describe, expect, it } from "vitest";
import {
  resolveWeightLossConsultHref,
  WEIGHT_LOSS_BOOKING_ORIGIN,
} from "./booking-routes";
import { withWeightLossAttribution } from "./weight-loss-attribution";

const BOOKING_URL = resolveWeightLossConsultHref("vacaville");

describe("weight-loss paid attribution handoff", () => {
  it("preserves approved click and campaign fields for the booking app", () => {
    const result = new URL(
      withWeightLossAttribution(
        BOOKING_URL,
        "?gclid=Cj0K.real-1&utm_source=google&utm_medium=cpc" +
          "&utm_campaign=vacaville-weight-loss&campaignid=123&adgroupid=456" +
          "&keyword=medical+weight+loss&matchtype=e&device=m&network=g",
      ),
    );

    expect(result.origin).toBe(WEIGHT_LOSS_BOOKING_ORIGIN);
    expect(result.searchParams.get("gclid")).toBe("Cj0K.real-1");
    expect(result.searchParams.get("utm_campaign")).toBe(
      "vacaville-weight-loss",
    );
    expect(result.searchParams.get("keyword")).toBe("medical weight loss");
    expect(result.searchParams.get("device")).toBe("m");
  });

  it("normalizes approved ValueTrack aliases", () => {
    const result = new URL(
      withWeightLossAttribution(
        BOOKING_URL,
        "?gad_campaignid=123&gad_adgroupid=456&gad_keyword=weight+loss",
      ),
    );

    expect(result.searchParams.get("campaignid")).toBe("123");
    expect(result.searchParams.get("adgroupid")).toBe("456");
    expect(result.searchParams.get("keyword")).toBe("weight loss");
    expect(result.searchParams.has("gad_campaignid")).toBe(false);
  });

  it("rejects unknown, contact-like, oversized, and malformed values", () => {
    const result = new URL(
      withWeightLossAttribution(
        BOOKING_URL,
        "?gclid=person@example.com&utm_campaign=707-555-1212" +
          `&utm_content=${"x".repeat(201)}&email=person@example.com&diagnosis=test`,
      ),
    );

    expect([...result.searchParams.keys()]).toEqual([]);
  });

  it("never decorates a non-Rella destination", () => {
    const external = "https://example.com/book";
    expect(withWeightLossAttribution(external, "?gclid=abc123")).toBe(
      external,
    );
  });
});

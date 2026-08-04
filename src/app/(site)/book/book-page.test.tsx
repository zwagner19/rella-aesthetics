import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BookPage, { metadata } from "./page";
import {
  BOOKING_LOCATION_CHOOSER,
  BOULEVARD_WIDGET_NAPA,
  BOULEVARD_WIDGET_VACAVILLE,
} from "@/lib/booking-routes";

const html = renderToStaticMarkup(<BookPage />);

describe("first-party clinic booking chooser", () => {
  it("offers exactly one location-pinned handoff per clinic", () => {
    expect(html.match(/data-booking-location=/g)).toHaveLength(2);
    expect(html.match(/data-cta="location-booking"/g)).toHaveLength(2);
    expect(html).toContain(`href="${BOULEVARD_WIDGET_VACAVILLE.replaceAll("&", "&amp;")}"`);
    expect(html).toContain(`href="${BOULEVARD_WIDGET_NAPA.replaceAll("&", "&amp;")}"`);
  });

  it("does not use Boulevard's broken generic or Vacaville Peels deep links", () => {
    expect(html).not.toContain('href="https://dashboard.boulevard.io/booking/businesses/a12f397a-6db3-4b18-bc34-01f02dfb7216/widget"');
    expect(html).not.toContain("%2Fcart%2Fmenu%2FPeels");
    expect(html).not.toContain(`href="${BOOKING_LOCATION_CHOOSER}"`);
  });

  it("is a focused, noindex handoff with no form or health-data collection", () => {
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
    expect(html).toContain("707.358.2928");
  });
});

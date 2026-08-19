import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const tracker = readFileSync(
  join(process.cwd(), "public/weight-loss-booking-tracker.js"),
  "utf8",
);

describe("weight-loss-booking-tracker.js drop-in script", () => {
  it("targets only the booking subdomain and napa/vacaville consult path", () => {
    expect(tracker).toContain('hostname !== "book.rellaweightloss.com"');
    expect(tracker).toContain("\\/book\\/(napa|vacaville)\\/weight-loss-consult");
  });

  it("fires a sterile once-per-session dataLayer event on confirmation UI", () => {
    expect(tracker).toContain("weight_loss_booking_confirmed");
    expect(tracker).toContain("booking_confirmed: true");
    expect(tracker).toContain("rella_wl_booking_conv_fired");
    expect(tracker).toContain('getElementById("ok-h")');
    expect(tracker).not.toMatch(/email|phone|gclid|firstName|cartId/i);
  });

  it("bootstraps the shared GTM container", () => {
    expect(tracker).toContain("GTM-N4R7NHBJ");
  });
});

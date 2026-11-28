import { afterEach, describe, expect, it, vi } from "vitest";
import { formatScheduledStart } from "./schedule";

afterEach(() => vi.unstubAllEnvs());
describe("reserved treatment schedule", () => {
  it.each(["UTC", "America/New_York", "Asia/Tokyo"])("keeps a clinic-local time unchanged for visitors in %s", visitorTimeZone => {
    vi.stubEnv("TZ", visitorTimeZone);
    const label = formatScheduledStart({ treatmentKey: "napa/botox", startTime: "2026-10-21T10:30:00", timeZone: "America/Los_Angeles" });
    expect(label).toContain("10:30 AM");
    expect(label).toContain("Pacific time");
  });
  it("formats an absolute server timestamp in the verified clinic time zone", () => {
    expect(formatScheduledStart({ treatmentKey: "napa/botox", startTime: "2026-10-21T17:30:00Z", timeZone: "America/Los_Angeles" })).toContain("10:30 AM");
  });
});

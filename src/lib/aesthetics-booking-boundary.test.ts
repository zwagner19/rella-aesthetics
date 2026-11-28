import { expect, it } from "vitest";
import { prepareAestheticsBookingAttribution, registerAestheticsBookingPreparation } from "./aesthetics-booking-boundary";

it("awaits the current browser boundary and does not clear a replacement on old cleanup", async () => {
  let first = 0; let second = 0;
  const oldCleanup = registerAestheticsBookingPreparation(async () => { first += 1; });
  const currentCleanup = registerAestheticsBookingPreparation(async () => { second += 1; });
  oldCleanup();
  await prepareAestheticsBookingAttribution();
  expect(first).toBe(0); expect(second).toBe(1);
  currentCleanup();
  await prepareAestheticsBookingAttribution();
  expect(second).toBe(1);
});

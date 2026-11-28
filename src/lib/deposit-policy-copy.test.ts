import { describe, expect, it } from "vitest";
import { LOCAL_EDITORIAL_POSTS } from "./local-editorial-posts";
import { CANCELLATION_POLICY, PAYMENT_DISCLOSURE, VISIT } from "./napa-botox-facts";

describe("public deposit copy", () => {
  it("keeps Napa new-patient tox on the standard $100 deposit policy", () => {
    expect(VISIT.depositAmount).toBe("$100");
    expect(PAYMENT_DISCLOSURE).toContain("charge a $100 deposit");
    expect(PAYMENT_DISCLOSURE).toContain("applied to your completed treatment");
    expect(CANCELLATION_POLICY).toContain("cancel or reschedule");
    expect(CANCELLATION_POLICY).toContain("no-show");
  });

  it("contains no stale $50 tox booking-deposit claim in editorial content", () => {
    const editorialCopy = JSON.stringify(LOCAL_EDITORIAL_POSTS);
    expect(editorialCopy).toContain("$100 booking deposit");
    expect(editorialCopy).not.toMatch(/\$50[^\"]{0,40}booking deposit|booking deposit[^\"]{0,40}\$50/i);
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PackageIdentityForm } from "./PackageIdentityForm";

const actions = { onRequestCode: async () => {}, onVerifyCode: async () => {}, onProfile: async () => {} };

describe("package ownership verification", () => {
  it("offers passwordless email/SMS verification without collecting a password", () => {
    const html = renderToStaticMarkup(<PackageIdentityForm {...actions} authentication={null} />);
    expect(html).toContain("Text message");
    expect(html).toContain('type="email"');
    expect(html).toContain("min-h-11");
    expect(html).toContain("text-base");
    expect(html).not.toContain('type="password"');
  });

  it("uses one-time-code autofill and preserves six-digit codes including leading zeros", () => {
    const html = renderToStaticMarkup(<PackageIdentityForm {...actions} authentication={{ state: "CODE_SENT", maskedDestination: "t***@example.test" }} />);
    expect(html).toContain("t***@example.test");
    expect(html).toContain('autoComplete="one-time-code"');
    expect(html).toContain('inputMode="numeric"');
    expect(html).toContain('type="text"');
    expect(html).toContain('maxLength="6"');
  });

  it("requires explicit consent before saving a missing date of birth and never prechecks it", () => {
    const html = renderToStaticMarkup(<PackageIdentityForm {...actions} authentication={{ state: "DOB_REQUIRED", profiles: [{ id: "opaque-profile", name: "Test User", dobRequired: true, dobOnFile: false }] }} />);
    expect(html).toContain('type="date"');
    expect(html).toContain("I agree to save my date of birth");
    const checkbox = html.match(/<input\b[^>]*type="checkbox"[^>]*>/)?.[0];
    expect(checkbox).toBeDefined();
    expect(checkbox).not.toContain("checked");
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Continue/);
  });

  it("asks for a profile explicitly when the verified contact belongs to more than one", () => {
    const html = renderToStaticMarkup(<PackageIdentityForm {...actions} authentication={{ state: "PROFILE_REQUIRED", profiles: [
      { id: "opaque-one", name: "First Profile", dobRequired: true, dobOnFile: true },
      { id: "opaque-two", name: "Second Profile", dobRequired: false, dobOnFile: false },
    ] }} />);
    expect(html.match(/type="radio"/g)).toHaveLength(2);
    expect(html).not.toContain("checked");
    expect(html).not.toContain('type="date"');
    expect(html).toContain("Choose your profile");
  });
});

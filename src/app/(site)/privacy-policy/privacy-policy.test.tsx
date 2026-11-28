import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage, { metadata } from "./page";

describe("privacy policy", () => {
  it("describes consented source measurement and the limited Google export", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />);

    expect(metadata.alternates?.canonical).toBe("/privacy-policy");
    expect(html).toContain("how you found our website");
    expect(html).toContain("first-party booking system");
    expect(html).toContain("stored in encrypted form");
    expect(html).toContain("do not send full referring");
    expect(html).toContain("Patient contact information");
    expect(html).toContain("not included in that export");
    expect(html).toContain("does not depend on accepting");
  });
});

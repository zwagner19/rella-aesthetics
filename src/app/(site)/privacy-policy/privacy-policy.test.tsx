import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyPolicyPage, { metadata } from "./page";

describe("privacy policy", () => {
  it("describes the exact-Napa first-party attribution choice", () => {
    const html = renderToStaticMarkup(<PrivacyPolicyPage />);

    expect(metadata.alternates?.canonical).toBe("/privacy-policy");
    expect(html).toContain("Napa Botox advertising page");
    expect(html).toContain("first-party booking system");
    expect(html).toContain("stored there in encrypted form");
    expect(html).toContain("does not include your name");
    expect(html).toContain("does not depend on accepting");
  });
});

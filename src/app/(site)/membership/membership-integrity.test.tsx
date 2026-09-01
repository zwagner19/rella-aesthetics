import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MembershipPage, { metadata } from "./page";
import { membershipTiers } from "@/lib/data";

const html = renderToStaticMarkup(<MembershipPage />);
const text = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ");

describe("2026 injectable membership integrity", () => {
  it("publishes the three source-backed injectable plans", () => {
    expect(membershipTiers).toHaveLength(3);
    for (const [name, dues] of [
      ["Tox Membership", "$30"],
      ["Filler Membership", "$40"],
      ["Tox + Filler Membership", "$50"],
    ]) {
      expect(text).toContain(name);
      expect(text).toContain(dues);
    }
    expect([...html.matchAll(/<h1\b/g)]).toHaveLength(1);
    expect(text).not.toContain("Most Popular");
  });

  it("states exact member rates and the material HydraFacial term", () => {
    for (const fact of [
      "Botox at $13/unit",
      "Dysport at $4.40/unit",
      "Restylane at $600/syringe",
      "Juvederm Ultra / Ultra Plus at $600",
      "Voluma / Vollure / Vollux / Volbella at $700",
      "1 complimentary Signature HydraFacial*",
      "1 complimentary Deluxe HydraFacial*",
      "10% off retail",
      "One-year membership commitment",
      "after six months of on-time payments",
      "full membership year is paid in advance",
    ]) {
      expect(text).toContain(fact);
    }
  });

  it("routes every plan to a membership inquiry without inventing enrollment links", () => {
    const inquiryHrefs = [
      ...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>Ask About Membership<\/a>/g),
    ].map((match) => match[1]);
    expect(inquiryHrefs).toHaveLength(3);
    expect(new Set(inquiryHrefs)).toEqual(new Set(["/contact?intent=membership"]));
    expect(html).not.toContain("Most Popular");
  });

  it("keeps separately reviewed medical programs out of this injectable page", () => {
    expect(text).not.toMatch(/Semaglutide|Tirzepatide|Peptide|compounded/i);
    expect(text).not.toContain("$449");
    expect(text).not.toContain("$20/month");
  });

  it("has unique search metadata for the comparison page", () => {
    expect(metadata.title).toBe("2026 Injectable Memberships");
    expect(metadata.alternates?.canonical).toBe("/membership");
    expect(String(metadata.description)).toContain("Tox + Filler");
  });
});

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "./page";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import {
  resolveWeightLossAssessmentHref,
  resolveWeightLossConsultHref,
} from "@/lib/booking-routes";

const weightLossHtml = renderToStaticMarkup(<WeightLossServicePage />);
const homeHtml = renderToStaticMarkup(<HomePage />);

describe("medical-weight-loss conversion foundation", () => {
  it("leads with a clear local, physician-led offer", () => {
    expect(weightLossHtml).toContain("Medical weight loss built around more than medication.");
    expect(weightLossHtml).toContain("Vacaville");
    expect(weightLossHtml).toContain("Napa");
    expect(weightLossHtml).toContain("30-minute phone consultation");
    expect(weightLossHtml).toContain("No card required");
    expect(weightLossHtml).toContain("Zachary Wagner, DO");
    expect(weightLossHtml).toContain("American Board of Obesity Medicine diplomate");
  });

  it("gives ready and uncertain visitors separate, city-correct paths", () => {
    for (const location of ["napa", "vacaville"] as const) {
      expect(weightLossHtml).toContain(`href="${resolveWeightLossConsultHref(location)}"`);
      expect(weightLossHtml).toContain(`href="${resolveWeightLossAssessmentHref(location)}"`);
      expect(weightLossHtml).toContain(`data-location="${location}"`);
    }
    expect([...weightLossHtml.matchAll(/data-cta="weight-loss-consult"/g)]).toHaveLength(2);
    expect([...weightLossHtml.matchAll(/data-cta="weight-loss-assessment"/g)]).toHaveLength(2);
  });

  it("does not publish unapproved pricing, outcome promises, or disputed provider copy", () => {
    for (const claim of ["$350", "15–20%", "15-20%", "Warda Harchaoui"] as const) {
      expect(weightLossHtml).not.toContain(claim);
    }
    expect(weightLossHtml).toContain("does not guarantee a prescription");
    expect(weightLossHtml).toContain("Individual results vary");
  });

  it("contains no patient intake form and sends no answer values", () => {
    expect(weightLossHtml).not.toMatch(/<(form|input|select|textarea)\b/);
    expect(weightLossHtml).not.toMatch(/data-answer|assessment_answer|medical_history/i);
  });

  it("emits only sanitized FAQ and service JSON-LD", () => {
    const scripts = [...weightLossHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(scripts).toHaveLength(2);
    const parsed = scripts.map((match) => JSON.parse(match[1]));
    expect(parsed.map((item) => item["@type"])).toEqual(["FAQPage", "Service"]);
    expect(weightLossHtml).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  });
});

describe("homepage conversion foundation", () => {
  it("replaces the generic beauty headline with clear positioning", () => {
    expect(homeHtml).toContain("Care Built Around You");
    expect(homeHtml).toContain("Physician-owned");
    expect(homeHtml).toContain("Vacaville &amp; Napa");
    expect(homeHtml).not.toContain("Ageless Beauty");
  });

  it("promotes the rebuilt medical-weight-loss page without bypassing it", () => {
    expect(homeHtml).toContain('href="/services/weight-loss"');
    expect(homeHtml).toContain("Built around more than medication.");
  });
});

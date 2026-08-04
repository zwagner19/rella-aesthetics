import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WeightLossServicePage } from "@/components/pages/WeightLossServicePage";
import { resolveWeightLossConsultHref } from "@/lib/booking-routes";

const weightLossHtml = renderToStaticMarkup(<WeightLossServicePage />);

describe("medical-weight-loss conversion foundation", () => {
  it("leads with a clear local, physician-led offer", () => {
    expect(weightLossHtml).toContain("Talk with an obesity-medicine physician about GLP-1 options in Vacaville &amp; Napa.");
    expect(weightLossHtml).toContain("Vacaville");
    expect(weightLossHtml).toContain("Napa");
    expect(weightLossHtml).toContain("30-minute phone consultation");
    expect(weightLossHtml).toContain("No card required");
    expect(weightLossHtml).toContain("Zachary Wagner, DO");
    expect(weightLossHtml).toContain("ABOM-certified physician");
    expect(weightLossHtml).toContain("semaglutide or tirzepatide");
  });

  it("gives visitors one city-correct qualification-call path", () => {
    for (const location of ["napa", "vacaville"] as const) {
      expect(weightLossHtml).toContain(`href="${resolveWeightLossConsultHref(location)}"`);
      expect(weightLossHtml).toContain(`data-location="${location}"`);
    }
    expect([...weightLossHtml.matchAll(/data-cta="weight-loss-consult"/g)]).toHaveLength(2);
    expect(weightLossHtml).not.toContain('data-cta="weight-loss-assessment"');
    expect(weightLossHtml).not.toContain("Take Assessment");
  });

  it("does not publish unapproved pricing, outcome promises, or disputed provider copy", () => {
    for (const claim of ["$350", "15–20%", "15-20%", "Warda Harchaoui"] as const) {
      expect(weightLossHtml).not.toContain(claim);
    }
    expect(weightLossHtml).toContain("does not guarantee a prescription");
    expect(weightLossHtml).toContain("Individual results vary");
  });

  it("explains medical qualification and the primary objections before booking", () => {
    expect(weightLossHtml).toContain("A real medical qualification consultation");
    expect(weightLossHtml).toContain("Know whether you qualify and what comes next");
    expect(weightLossHtml).toContain("How much does medical weight-loss care cost?");
    expect(weightLossHtml).toContain("What side effects and monitoring should I expect?");
    expect(weightLossHtml).toContain("Will I be pushed into injections if they are not right for me?");
    expect(weightLossHtml).toContain("What happens if I stop medication or worry about regaining weight?");
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

  it("uses current, attributable Google weight-loss social proof without review schema", () => {
    expect(weightLossHtml).toContain("4.9 on Google · 219 reviews");
    expect(weightLossHtml).toContain("23 Google reviews mention weight loss");
    expect(weightLossHtml).toContain("Georgia Javaras");
    expect(weightLossHtml).toContain("Paige Kiehn");
    expect(weightLossHtml).toContain("J N");
    expect(weightLossHtml).toContain("Reviews reflect individual experiences. Results vary.");
    expect(weightLossHtml).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  });

  it("includes the Rella semaglutide patient-story video", () => {
    expect(weightLossHtml).toContain("Hear the experience in a patient&#x27;s own words.");
    expect(weightLossHtml).toContain('src="/media/semaglutide-story.mp4"');
    expect(weightLossHtml).toContain("Individual results vary.");
  });
});

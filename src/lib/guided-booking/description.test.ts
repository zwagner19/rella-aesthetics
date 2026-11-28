import { describe, expect, it } from "vitest";
import { treatmentBookingNotes, treatmentDescription } from "./description";
import { backendTreatments } from "./catalog";

describe("treatment menu descriptions", () => {
  it("keeps two complete treatment sentences and removes the policy paragraph", () => {
    const treatment = "This facial cleanses and hydrates the skin. The treatment includes a personalized serum. Additional options can be discussed during your visit.";
    const policy = "A $100 reservation deposit secures your visit. It reserves provider time. With at least 48 hours’ notice, it may be transferred once. Late cancellations and no-shows forfeit the deposit.";
    expect(treatmentDescription(`${treatment}\n\n${policy}`, "Facial")).toBe(
      "This facial cleanses and hydrates the skin. The treatment includes a personalized serum.",
    );
  });

  it("removes policy and its pronoun-only continuation when it shares a treatment paragraph", () => {
    const result = treatmentDescription("This visit reviews your skin concerns. A reservation deposit secures your visit. It is applied when you attend.", "Skin Consultation");
    expect(result).toBe("This visit reviews your skin concerns. Your provider can help you understand the appropriate next steps.");
    expect(result).not.toMatch(/deposit|applied|reservation/i);
  });

  it.each([undefined, "", "A $100 deposit secures your consultation. It reserves provider time. Your card is charged when confirmed.", "Cancellation policy: 48 hours’ notice is required."])(
    "gives policy-only or missing descriptions a concise neutral fallback",
    (description) => {
      const result = treatmentDescription(description, "New Patient Consultation");
      expect(result).toBe("Meet with a Rella provider to discuss your goals and treatment options. Your provider can help you understand the appropriate next steps.");
      expect(result).not.toMatch(/deposit|cancel|48 hours|card|charged/i);
    },
  );

  it("adds a neutral second sentence when the source contains one treatment sentence", () => {
    expect(treatmentDescription("This appointment reviews your treatment results.", "Injectables Follow Up")).toBe(
      "This appointment reviews your treatment results. Your provider can help you understand the appropriate next steps.",
    );
  });

  it("handles markup, entities and a dedicated price block without displaying them", () => {
    expect(treatmentDescription("<p>$840–960/syringe</p><p>Fillers add volume &amp; fullness to selected areas. Your provider discusses suitable treatment areas.</p><script>hide this</script><p>A $100 deposit is required.</p>", "Filler")).toBe(
      "Fillers add volume & fullness to selected areas. Your provider discusses suitable treatment areas.",
    );
  });

  it("moves actual service prerequisites into review notes and keeps treatment facts in the menu", () => {
    const raw = "See treatment packages for deals!\n\n***MUST book your initial laser consult before booking IPL***\n\nIPL targets pigmentation and uneven skin tone. The treatment uses intense pulsed light.\n\nA $100 deposit secures the visit.";
    expect(treatmentDescription(raw, "IPL")).toBe("IPL targets pigmentation and uneven skin tone. The treatment uses intense pulsed light.");
    expect(treatmentBookingNotes(raw)).toBe("MUST book your initial laser consult before booking IPL");
    expect(treatmentBookingNotes("A $100 deposit secures your visit. Late cancellations forfeit the deposit.")).toBeUndefined();
    const event = "Please only book this service if you are attending a out of clinic party/event. Select the nurse that will be hosting your event and date you will be attending.";
    expect(treatmentBookingNotes(event)).toBe(event);
    expect(treatmentDescription(event, "Event Tox")).toBe("This service is intended for an offsite party or event. The visit is coordinated with the nurse hosting your event.");
  });

  it("drops standalone duration/price blocks before taking treatment sentences", () => {
    expect(treatmentDescription("30-Minute Session - $350\n60-Minute Session - $600\n\nThis treatment addresses visible spider veins. Your provider discusses the suitable areas.", "Spider Vein Removal")).toBe(
      "This treatment addresses visible spider veins. Your provider discusses the suitable areas.",
    );
  });

  it("preserves a prerequisite when policy and treatment facts share its paragraph", () => {
    const raw = "MUST book your initial laser consult before booking IPL. IPL targets pigmentation and uneven skin tone. The treatment uses intense pulsed light. A $100 deposit secures the visit. It is applied when you attend.";
    expect(treatmentBookingNotes(raw)).toBe("MUST book your initial laser consult before booking IPL.");
    expect(treatmentDescription(raw, "IPL")).toBe("IPL targets pigmentation and uneven skin tone. The treatment uses intense pulsed light.");
    const event = "Please only book this service if you are attending an out of clinic party/event. Select the nurse hosting your event. A $100 deposit secures the visit.";
    expect(treatmentBookingNotes(event)).toBe("Please only book this service if you are attending an out of clinic party/event. Select the nurse hosting your event.");
  });

  it.each([
    ["MicroPeel Plus 30", "The Micro Peel Plus 20 Peel treats skin concerns."],
    ["$699 ByeBye Baggy Eyes", "Use this service for the $11 / Unit of BOTOX offer."],
    ["$13 / Unit of BOTOX offer", "Use this service for the $11 / Unit of BOTOX offer."],
  ])("does not repeat source claims belonging to a different service or offer", (name, description) => {
    expect(treatmentDescription(description, name)).toBe("Learn more about this treatment with a Rella provider. Your provider can discuss how it fits your goals and treatment plan.");
  });

  it("avoids clipping long clinical statements or keeping a trailing source fragment", () => {
    expect(treatmentDescription(`${"A very long clinical explanation ".repeat(30)}.`, "Treatment")).toBe(
      "Learn more about this treatment with a Rella provider. Your provider can discuss how it fits your goals and treatment plan.",
    );
    expect(treatmentDescription("The consultation reviews your skin concerns. Your provider discusses treatment options.right but", "Skin Consult")).toBe(
      "The consultation reviews your skin concerns. Your provider discusses treatment options.",
    );
  });

  it("changes display descriptions without changing service identity or payment settings", () => {
    const [treatment] = backendTreatments("napa", [{
      serviceSlug: "live-service", displayName: "Live treatment", category: "Skin",
      description: "This treatment addresses skin concerns. A $50 deposit secures the visit. It is applied toward treatment.",
      paymentRule: "DEPOSIT_CENTS", depositCents: 5000, listPriceCents: 20000,
    }]);
    expect(treatment.shortDescription).toBe("This treatment addresses skin concerns. Your provider can discuss how it fits your goals and treatment plan.");
    expect(treatment).toMatchObject({ key: "napa/live-service", serviceSlug: "live-service", category: "Skin", paymentRule: "deposit", depositCents: 5000, listPriceCents: 20000 });
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ASSESSMENT_CONTACT_CONSENT, MARKETING_CONSENT, backendTreatments, bootstrapFromIntent, createMockBackend } from "@/lib/guided-booking";
import type { GuidedBookingState } from "@/lib/guided-booking";
import { TreatmentsStep } from "./steps/TreatmentsStep";
import { ProviderStep } from "./steps/ProviderStep";
import { ReviewStep } from "./steps/ReviewStep";
import { CompleteStep } from "./steps/CompleteStep";
import { VisitSummary } from "./VisitSummary";
import { BookingModal } from "./BookingModal";
import { DateTimeStep } from "./steps/DateTimeStep";

const treatments = backendTreatments("napa", [
  { serviceSlug: "botox", displayName: "Tox", category: "Injectables", description: "", paymentRule: "DEPOSIT_CENTS", depositCents: 10000 },
  { serviceSlug: "hydrafacial", displayName: "Facial", category: "Skin", description: "", paymentRule: "DEPOSIT_CENTS", depositCents: 10000 },
  { serviceSlug: "universal-peel", displayName: "Peel", category: "Skin", description: "", paymentRule: "DEPOSIT_CENTS", depositCents: 5000 },
]);
const state: GuidedBookingState = { ...bootstrapFromIntent({ location: "napa" }), treatments,
  selectedTreatmentKeys: ["napa/botox", "napa/hydrafacial"], providerIds: { "napa/botox": "provider-one", "napa/hydrafacial": "any-available" },
  expandedCategories: ["Injectables", "Skin"], quote: { depositCents: 7350, totalCents: 31800, needsCard: true },
  schedule: [
    { treatmentKey: "napa/botox", startTime: "2026-10-21T10:30:00", timeZone: "America/Los_Angeles", providerName: "Provider One" },
    { treatmentKey: "napa/hydrafacial", startTime: "2026-10-21T11:15:00", timeZone: "America/Los_Angeles", providerName: "Provider Two" },
  ],
};
describe("multi-treatment presentation", () => {
  it("shows both independently added treatments and keeps unselected items available to add without menu photos", () => {
    const html = renderToStaticMarkup(<TreatmentsStep state={state} locationSlug="napa" onSearch={() => {}} onToggleCategory={() => {}} onToggleTreatment={() => {}} />);
    expect(html.match(/✓ Added/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Remove Tox"');
    expect(html).toContain('aria-label="Remove Facial"');
    expect(html).toContain('aria-label="Add Peel"');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2);
    expect(html).not.toContain("Replace");
    expect(html).not.toContain("<img");
  });
  it("scopes a provider choice to each treatment using the existing provider controls", () => {
    const providers = [{ id: "any-available", displayName: "Any available provider", anyAvailable: true }, { id: "provider-one", displayName: "Provider One", anyAvailable: false }];
    const html = renderToStaticMarkup(<ProviderStep groups={[{ treatmentKey: "napa/botox", displayName: "Tox", providers }, { treatmentKey: "napa/hydrafacial", displayName: "Facial", providers }]}
      selectedIds={state.providerIds} loading={false} onSelect={() => {}} />);
    expect(html).toContain('aria-label="Any available provider for Tox"');
    expect(html).toContain('aria-label="Any available provider for Facial"');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(2);
  });
  it("shows actual per-item clinic start times/providers rather than deriving a schedule from list durations", () => {
    const html = renderToStaticMarkup(<VisitSummary state={{ ...state, step: "complete" }} editable={false} />);
    expect(html).toContain("10:30 AM Pacific time");
    expect(html).toContain("11:15 AM Pacific time");
    expect(html).toContain("Provider One"); expect(html).toContain("Provider Two");
    expect(html).toContain("Amount confirmed for your complete visit before payment");
    expect(html).not.toContain("$100.00 booking deposit");
  });
  it("approves only the native whole-cart quote at completion and keeps policy in the review step", () => {
    const review = renderToStaticMarkup(<ReviewStep state={state} onChangeTreatments={() => {}} />);
    expect(review.match(/Amount confirmed for your complete visit before payment/g)).toHaveLength(2);
    const complete = renderToStaticMarkup(<CompleteStep state={state} mode="live" onChange={() => {}} submitting={false} onLiveComplete={async () => {}} />);
    expect(complete).toContain("Total booking deposit: $73.50");
    expect(complete).toContain(ASSESSMENT_CONTACT_CONSENT);
    expect(complete).toContain(MARKETING_CONSENT);
    expect(complete).toContain("Complete your contact details to continue.");
    expect(complete).not.toContain("Confirm booking");
    const consented = renderToStaticMarkup(<CompleteStep state={{ ...state, client: {
      firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928",
      assessmentContactConsent: false, marketingConsent: false,
    } }} mode="live" onChange={() => {}} submitting={false} onLiveComplete={async () => {}} />);
    expect(consented).toContain("Confirm the required contact consent to continue.");
    expect(consented).not.toContain("Confirm booking");
    expect(consented).toContain("Required: ");
    const checkboxes = (consented.match(/<input\b[^>]*>/g) ?? []).filter(input => input.includes('type="checkbox"'));
    expect(checkboxes[0]).toContain('required=""');
    expect(checkboxes[1]).not.toContain("required");
    const readyWithoutMarketing = renderToStaticMarkup(<CompleteStep state={{ ...state,
      quote: { ...state.quote!, needsCard: false },
      client: { firstName: "Fixture", lastName: "User", email: "fixture@example.test", phone: "7073582928",
        assessmentContactConsent: true, marketingConsent: false },
    }} mode="live" onChange={() => {}} submitting={false} onLiveComplete={async () => {}} />);
    expect(readyWithoutMarketing).toContain("Confirm booking");
    expect(complete).not.toContain("$200.00");
  });
  it("shows terminal pending verification immediately when the modal reopens", () => {
    const backend = { ...createMockBackend(), verificationPending: () => true };
    const html = renderToStaticMarkup(<BookingModal intent={{}} backend={backend} onClose={() => {}} />);
    expect(html).toContain("Booking verification pending");
    expect(html).not.toContain("Choose a location");
    expect(html).not.toContain("Confirm booking");
  });
  it("locks date, quick-pick and time controls while reservation is pending", () => {
    const slot = { id: "time", startTime: "2026-11-01T18:00:00Z", label: "10:00 AM" };
    const html = renderToStaticMarkup(<DateTimeStep availability={{ live: true, dates: ["2026-11-01"], nextAvailable: [slot] }}
      times={[slot]} selectedDate="2026-11-01" selectedSlotId="time" loading={true} onSelectDate={() => {}} onSelectSlot={() => {}} />);
    expect(html.match(/disabled=""/g)).toHaveLength(3);
  });
  it("uses phone-safe contact input size and keyboard/autofill types without changing desktop typography", () => {
    const html = renderToStaticMarkup(<CompleteStep state={state} mode="live" onChange={() => {}} submitting={false} onLiveComplete={async () => {}} />);
    const inputs = (html.match(/<input\b[^>]*>/g) ?? []).filter(input => !input.includes('type="checkbox"'));
    expect(inputs).toHaveLength(4);
    expect(html.match(/type="checkbox"/g)).toHaveLength(2);
    for (const input of inputs) {
      expect(input).toContain("min-h-11");
      expect(input).toMatch(/\btext-base\b/);
      expect(input).toContain("sm:text-sm");
    }
    expect(inputs.some(input => input.includes('type="email"') && input.includes('autoComplete="email"'))).toBe(true);
    expect(inputs.some(input => input.includes('type="tel"') && input.includes('autoComplete="tel"'))).toBe(true);
  });
  it("keeps new purchase offers searchable and separate from appointment services without leaking monetary copy", () => {
    const packageTreatments = backendTreatments("napa", [{ serviceSlug: "package-session", displayName: "Laser package session", category: "Packages", description: "A treatment appointment. Your provider can discuss your plan." }]);
    const html = renderToStaticMarkup(<TreatmentsStep locationSlug="napa" state={{ ...state, treatments: packageTreatments, search: "laser", expandedCategories: ["Packages"] }}
      packageOfferings={[{ id: "opaque-offer", displayName: "6-session laser package | from $600", description: "Laser treatments address your skin goals. The price is $600 for the package.", benefitGroups: [] }]}
      onSearch={() => {}} onToggleCategory={() => {}} onToggleTreatment={() => {}} onBuyPackage={() => {}} onBookPackage={() => {}} />);
    expect(html).toContain("Buy a new package");
    expect(html).toContain("Book a package treatment");
    expect(html).toContain('aria-label="Buy 6-session laser package"');
    expect(html).toContain("Book from my package");
    expect(html).toContain("Laser package session");
    expect(html).not.toContain("$600");
    expect(html).not.toContain("The price is");
  });
});

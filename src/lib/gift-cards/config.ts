/**
 * Black Friday 2026 gift card event — the ONE place every price, value, date,
 * perk and approved line of copy lives. Pages, API routes, emails and the HQ
 * staff view read from here; nothing else may hard-code these values.
 *
 * Amounts are integer cents. Instants are absolute (UTC) so the server can
 * enforce the window without trusting the browser clock or time zone.
 */

export const PROMO_TIME_ZONE = "America/Los_Angeles" as const;

export type GiftCardOfferId = "bf26-1000" | "bf26-2100";

export type GiftCardOffer = {
  id: GiftCardOfferId;
  label: "Offer 01" | "Offer 02";
  /** Total value the recipient can spend (purchase + bonus). */
  valueCents: number;
  /** What the purchaser is charged. This is the Boulevard gift card item price. */
  priceCents: number;
  /** valueCents - priceCents, added to the SAME Boulevard gift card after verified payment. */
  bonusCents: number;
  title: string;
  priceLine: string;
  bonusLine: string;
  cta: "Purchase Gift Card";
};

export const OFFERS: readonly GiftCardOffer[] = Object.freeze([
  {
    id: "bf26-1000",
    label: "Offer 01",
    valueCents: 100_000,
    priceCents: 80_000,
    bonusCents: 20_000,
    title: "$1,000 Rella Gift Card",
    priceLine: "Purchase for $800",
    bonusLine: "$200 in additional value",
    cta: "Purchase Gift Card",
  },
  {
    id: "bf26-2100",
    label: "Offer 02",
    valueCents: 210_000,
    priceCents: 160_000,
    bonusCents: 50_000,
    title: "$2,100 Rella Gift Card",
    priceLine: "Purchase for $1,600",
    bonusLine: "$500 in additional value",
    cta: "Purchase Gift Card",
  },
] as const);

export const BLACK_FRIDAY_2026 = Object.freeze({
  campaignId: "black-friday-2026",
  /** Nov 27 2026 00:00 PST (UTC-8) → Dec 1 2026 23:59:59.999 PST. */
  window: {
    startsAt: Date.parse("2026-11-27T08:00:00.000Z"),
    endsAt: Date.parse("2026-12-02T07:59:59.999Z"),
    label: "NOVEMBER 27 – DECEMBER 1",
  },
  pass: {
    /** Last day to BOOK the chosen experience (end of day, Pacific). */
    bookBy: { instant: Date.parse("2026-12-16T07:59:59.999Z"), label: "December 15, 2026" },
    /** Last day to RECEIVE the chosen experience (end of day, Pacific). */
    redeemBy: { instant: Date.parse("2027-02-01T07:59:59.999Z"), label: "January 31, 2027" },
    /** Recipient picks exactly one at redemption. */
    choose: 1,
  },
  /** Bonus value is applied only when this AND the server env arm are both on. */
  bonusApprovedByOwner: false,
  /**
   * SINGLE checkout placeholder. Zach sets up the Boulevard side; when he
   * provides the checkout URL (it receives `?offer=<id>`), set it here.
   * While null, every Purchase button fails closed: nothing is charged and
   * the visitor is shown how to buy by phone instead.
   */
  checkoutUrl: null as string | null,
  offersTermsUrl: "https://experiencerella.com/promotional-terms",
  site: "https://experiencerella.com",
  bookingUrl: "https://book.experiencerella.com/book",
  phone: "707.358.2928",
  phoneHref: "tel:+17073582928",
  email: "info@experiencerella.com",
  locations: [
    { name: "Rella Vacaville", address: "542 Main St, Vacaville, CA 95688" },
    { name: "Rella Napa", address: "1541 3rd St, Napa, CA 94559" },
  ],
});

/**
 * Boulevard checkout. Both offers are Boulevard Packages that add account
 * credit (Boulevard caps gift cards at $1,500). Credit is granted at the
 * clinic where the package is bought, so the visitor picks a clinic first.
 * IDs are Zach's (Boulevard dashboard, "Other Packages" category); do not
 * invent or edit them here without his confirmation.
 *
 * Purchase opens Boulevard's own booking widget for the chosen package. That
 * path has NO server-verified payment, so it never shows the celebration;
 * the VIP Guest Pass is staff-issued and arrives by email.
 */
export type ClinicId = "napa" | "vacaville";

export const BOULEVARD_CHECKOUT = Object.freeze({
  businessId: "a12f397a-6db3-4b18-bc34-01f02dfb7216",
  injectorSrc: "https://static.joinboulevard.com/injector.min.js",
  menuCategory: "Other Packages",
  visitType: "PACKAGE",
  clinics: Object.freeze([
    { id: "napa", name: "Napa House", locationId: "91eba843-57fb-49e9-8505-431d501ffec7" },
    { id: "vacaville", name: "Vacaville", locationId: "0f146f87-364e-4dfd-b938-61ba49528820" },
  ] as const),
  packages: Object.freeze({
    "bf26-1000": { napa: "p_0c568ac1-560e-4a8f-a18e-a11cff0af950", vacaville: "p_b7d2e9ac-c9e0-42cd-b818-a7aba38b9676" },
    "bf26-2100": { napa: "p_216ed6c4-0cc4-4717-bdd8-7430539ea3f2", vacaville: "p_17a12f26-1eb3-4b93-823d-c58915152d11" },
  } satisfies Record<GiftCardOfferId, Record<ClinicId, string>>),
});

/** urlParams for blvd.openBookingWidget for one offer at one clinic. */
export function boulevardWidgetParams(offerId: GiftCardOfferId, clinicId: ClinicId) {
  const clinic = BOULEVARD_CHECKOUT.clinics.find((c) => c.id === clinicId);
  const pkg = BOULEVARD_CHECKOUT.packages[offerId]?.[clinicId];
  if (!clinic || !pkg) throw Error("unknown-package");
  return {
    locationId: clinic.locationId,
    path: `/cart/menu/${BOULEVARD_CHECKOUT.menuCategory}/${pkg}`,
    visitType: BOULEVARD_CHECKOUT.visitType,
  };
}

/**
 * Server-side gate for the Boulevard widget checkout. Preview only: it needs
 * BF_BOULEVARD_WIDGET_CHECKOUT=1 AND a non-production Vercel environment.
 * Anything else keeps Purchase fail-closed.
 */
export function boulevardWidgetCheckoutEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.BF_BOULEVARD_WIDGET_CHECKOUT === "1" && env.VERCEL_ENV !== "production";
}

export type VipExperienceId =
  | "member-tox"
  | "beauty-blend-iv"
  | "signature-hydrafacial"
  | "member-filler"
  | "inbody-scan"
  | "wellness-labs";

export const VIP_EXPERIENCES: readonly { id: VipExperienceId; label: string }[] = Object.freeze([
  { id: "member-tox", label: "Member pricing on tox" },
  { id: "beauty-blend-iv", label: "Complimentary Beauty Blend IV ($300 value)" },
  { id: "signature-hydrafacial", label: "Complimentary Signature HydraFacial ($300 value)" },
  { id: "member-filler", label: "Member pricing on filler" },
  { id: "inbody-scan", label: "Complimentary InBody scan" },
  { id: "wellness-labs", label: "Complimentary labs with a hormone or peptide wellness consultation" },
]);

/**
 * DRAFT offer terms — PLACEHOLDER pending Zach's approval (flagged in the PR).
 * Not legal advice; the owner must approve before launch.
 */
export const OFFER_TERMS_DRAFT: readonly string[] = Object.freeze([
  "Black Friday gift card offers are available for purchase November 27 through December 1, 2026 (Pacific Time), or while the promotion remains available.",
  "Open to new and existing Rella clients. Limit and eligibility details to be confirmed by Rella before launch.",
  "The $1,000 Rella Gift Card is purchased for $800 and the $2,100 Rella Gift Card is purchased for $1,600. Additional value is promotional and is included on the same gift card.",
  "Each qualifying purchase includes one Rella VIP Guest Pass for a friend or family member. The recipient chooses one experience. Book by December 15, 2026; redeem by January 31, 2027.",
  "All treatments are subject to consultation and provider approval. Results vary and are not guaranteed.",
  "Gift cards and passes have no cash value except as required by law and may not be combined with other offers unless stated.",
]);

/** Approved copy (verbatim from Zach's spec). */
export const COPY = Object.freeze({
  /** Approved by Zach (Nov 25, 2026). */
  delivery: "Delivered as Rella account credit.",
  boulevardNote: "Your purchase is processed by Boulevard; your VIP Guest Pass will arrive by email.",
  landing: {
    eyebrow: "THE BLACK FRIDAY EVENT | NOVEMBER 27 – DECEMBER 1",
    headline: "The gift that gives a little more.",
    body: "Something for you. Something for someone you love. Discover our exclusive Black Friday gift card offers and unlock a little extra Rella magic.",
  },
  vipSection: {
    headline: "A little something for someone else.",
    body: "Either Black Friday gift card purchase includes an exclusive Rella VIP Guest Pass to gift to a friend or family member. Because the best things in life are even better shared.",
  },
  celebration: {
    headline: "Surprise! You've unlocked a little extra.",
    body: "Your gift card purchase is complete, and we have something special for someone you love.",
    secondary: "This is your Rella VIP Guest Pass.",
  },
  pass: {
    brand: "RELLA",
    title: "VIP GUEST PASS",
    line: "A little luxury, gifted with love.",
    heading: "Choose your complimentary or exclusive experience.",
    chooseOne: "Recipient chooses ONE experience.",
  },
  gifting: {
    headline: "Who are we spoiling?",
    body: "Send a little Rella magic to someone special. We'll deliver their VIP Guest Pass straight to their inbox.",
    messagePlaceholder: "A little something just for you. Enjoy some well-deserved Rella time!",
    primary: "Send a Little Rella Magic",
    secondary: "I'll send my pass later.",
  },
  sent: {
    headline: "Consider them spoiled.",
    body: (first: string) =>
      `Your Rella VIP Guest Pass is on its way to ${first}. A little luxury is officially headed their way.`,
    back: "Back to Rella",
  },
  recipientEmail: {
    subject: "A little Rella magic, just for you.",
    preview: "Someone special has gifted you an exclusive Rella VIP Guest Pass.",
    headline: "You've been spoiled!",
    cta: "Claim My VIP Experience",
    closing: "We can't wait to welcome you to Rella.",
    signoff: ["With love,", "Your Rella team"],
  },
});

export function offerById(id: string): GiftCardOffer | null {
  return OFFERS.find((o) => o.id === id) ?? null;
}

export function formatUsd(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw Error("invalid-amount");
  const whole = cents % 100 === 0;
  return (
    "$" +
    (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: whole ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export type WindowState = "before" | "open" | "closed";

/** Server-side window check. Callers pass the server clock, never a browser value. */
export function promoWindowState(now: number): WindowState {
  if (!Number.isSafeInteger(now) || now <= 0) return "closed";
  if (now < BLACK_FRIDAY_2026.window.startsAt) return "before";
  if (now > BLACK_FRIDAY_2026.window.endsAt) return "closed";
  return "open";
}

/** Config self-check, used by tests and the readiness endpoint. */
export function assertConfigConsistent(): void {
  for (const o of OFFERS) {
    if (o.valueCents - o.priceCents !== o.bonusCents) throw Error(`offer-math:${o.id}`);
    if (o.bonusCents <= 0 || o.priceCents <= 0) throw Error(`offer-amounts:${o.id}`);
  }
  const w = BLACK_FRIDAY_2026.window;
  const p = BLACK_FRIDAY_2026.pass;
  if (!(w.startsAt < w.endsAt && w.endsAt < p.bookBy.instant && p.bookBy.instant < p.redeemBy.instant)) {
    throw Error("date-order");
  }
  if (VIP_EXPERIENCES.length !== 6) throw Error("perk-count");
}

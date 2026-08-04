/**
 * Canonical facts for the Napa Botox landing page (B01, Revision 06 Wave 3).
 *
 * Source of truth: `exports/RELLA-DESIGN-REVISION-06/FACTS-AND-CONTENT-TOKENS.md`
 * ("Pricing canon — binding, July 24 2026" and "Closed owner & operations
 * decisions — binding, July 26 2026"), accepted as D-036.
 *
 * Everything a visitor is told about price, duration, deposit, or policy comes
 * from here so a single test can hold the whole page to the canon. Two rules
 * are load-bearing rather than stylistic:
 *
 *  1. The $50 booking deposit is NEVER merged with, described as, or displayed
 *     as part of per-unit treatment pricing. They are separate blocks with
 *     separate language.
 *  2. Nothing may be stated that the canon does not establish — no cancellation
 *     FEE amount beyond the retained-deposit sentence, no refund or
 *     deposit-application promise, no ratings, no credentials beyond the
 *     approved line, no delivery channel for confirmations.
 *
 * The repository's older `service-data.ts` still carries superseded 2023-era
 * figures ($13 / $4.33 as *standard*). Those are history; this file is canon.
 */

export const PRICING = {
  /** Standard, non-member, point-of-sale pricing. */
  botoxPerUnit: "$18",
  dysportPerUnit: "$6",
  /** 2026 Tox Membership pricing. */
  memberBotoxPerUnit: "$13",
  memberDysportPerUnit: "$4.40",
  membershipMonthly: "$30",
  membershipCommitment: "one year",
} as const;

export const VISIT = {
  durationMinutes: 30,
  durationCopy: "30 minutes",
  /** Charged by Boulevard at confirmation. Never described as credited,
   *  applied toward treatment, refundable, or transferable. */
  depositAmount: "$50",
} as const;

/** Verbatim approved payment disclosure (FACTS-AND-CONTENT-TOKENS, D1). */
export const PAYMENT_DISCLOSURE =
  "A card is required to book. Boulevard will charge a $50 deposit when you confirm your appointment. " +
  "Card details are sent directly to Boulevard’s secure payment vault and are not stored on Rella’s servers.";

/** Verbatim approved cancellation policy (D3). No other fee is stated. */
export const CANCELLATION_POLICY =
  "Please give at least 48 hours’ notice if you need to cancel. Rella may retain your $50 deposit for " +
  "cancellations within 48 hours. Emergencies are reviewed individually.";

export const CANCELLATION_POLICY_URL = "https://experiencerella.com/cancellation-policy/";

/** Approved credential + trust lines (D5). Nothing further may be claimed. */
export const TRUST = {
  ownerCredential: "Zachary Wagner, DO — Owner",
  physicianOwned: "Physician-owned Rella Aesthetics",
} as const;

/**
 * Marketing display number. Same digits as the booking fallback today, but a
 * DIFFERENT token: this one may later be swapped for a HighLevel visitor-pool
 * number on approved marketing pages. That swap is NOT implemented here.
 */
export const MARKETING_PHONE = {
  display: "(707) 358-2928",
  href: "tel:+17073582928",
} as const;

export const NAPA = {
  street: "1541 3rd St",
  cityStateZip: "Napa, CA 94559",
  hoursCopy: "Open Tuesday – Saturday · 9am – 5pm",
  parkingCopy: "Street & garage parking within one block",
} as const;

/** Verified clinical expectations (reusable copy, live site July 2026). */
export const RESULTS = {
  onset: "Results appear in 4–7 days, full effect by two weeks",
  duration: "Typically lasts 3–4 months",
  touchUp: "Complimentary two-week touch-up, up to 6 units",
  consult: "Free in-person consultation with every first visit",
  dysportOnset: "Dysport can show results a little sooner (2–5 days)",
} as const;

export type Faq = { readonly q: string; readonly a: string };

/**
 * FAQ content. Every entry here is rendered visibly AND emitted as FAQPage
 * schema — the two must never diverge, which a test enforces. Schema for a
 * question that is not on the page would be structured-data spam.
 */
export const FAQS: readonly Faq[] = [
  {
    q: "How many units will I need?",
    a: "It depends on your anatomy and goals — that’s exactly what your provider maps out during your visit. Your consultation is free, and you’ll know your plan and cost before anything is treated.",
  },
  {
    q: "Does it hurt?",
    a: "Most patients describe it as a quick pinch — the needles are very fine and the visit is fast. You can return to your day right after, with a few simple aftercare guidelines.",
  },
  {
    q: "How long do results last?",
    a: "You’ll see softening in 4–7 days with full effect around two weeks. Results typically last 3–4 months, and we include a complimentary two-week touch-up of up to 6 units.",
  },
  {
    q: "Botox® or Dysport — which is right for me?",
    a: "They’re closely related — Dysport can show results a little sooner (2–5 days), and the two are priced differently per unit: Botox® $18/unit, Dysport $6/unit. Your provider will recommend the right fit at your visit.",
  },
  {
    q: "What is the $50 deposit for?",
    a: `${PAYMENT_DISCLOSURE} It is a booking deposit, separate from per-unit treatment pricing.`,
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: CANCELLATION_POLICY,
  },
  {
    q: "Do you take Allē or Aspire rewards?",
    a: "Yes — we accept both Allē (Botox®) and Aspire (Dysport) rewards. Bring your account login to your visit and we’ll apply your points.",
  },
];

/**
 * Optional content modules (ratings, reviews, owner portrait, Napa photography,
 * map embed) are designed but OFF by default. Production-ready state ships
 * without them, and no stock stand-in is ever substituted.
 */
export const SHOW_OPTIONAL_MODULES = false;

/** Photography is not approved for production; the accepted default is no-photo. */
export const HERO_PHOTO_ENABLED = false;

/**
 * Warda-led 12-week program — single source of truth for the PREVIEW page.
 *
 * Rules this file enforces (do not relax without Dr. Wagner's written approval):
 *  1. Every patient-facing claim carries a status. Only `confirmed` items render
 *     as plain copy. `pending` items render as a visible review flag in preview
 *     and MUST be resolved before the page is promoted or linked anywhere.
 *  2. No inclusion, discount, urgency, financing, result, or protocol is stated
 *     unless it has been confirmed for THIS $1,000 offer. The $2,010 Rella Reset
 *     inclusions are NOT assumed to carry over.
 *  3. BOOKING_HREF stays null until a Warda-specific assessment appointment type
 *     exists in Boulevard and in the booking app catalog and has been tested.
 *     The current weight-loss route (`/book/<loc>/weight-loss-consult`) is a
 *     30-minute PHONE consult pinned to Dr. Wagner, so it must not be reused.
 *  4. The page collects no health information. Clinical intake happens only in
 *     the booking/clinical system after the patient chooses to book.
 */

export type FactStatus = "confirmed" | "pending";
export type Fact = { text: string; status: FactStatus; note?: string };

export const PREVIEW_MODE = true;

export const PROGRAM = {
  name: { text: "12-Week Weight & Wellness Program with Warda", status: "pending", note: "Working name; Dr. Wagner to approve final program name." } as Fact,
  price: { text: "$1,000 for 12 weeks", status: "confirmed", note: "Owner-stated price, Oct 12 2026." } as Fact,
  priceType: { text: "Offer type (first-10 pilot price, introductory, or standing tier)", status: "pending" } as Fact,
  duration: { text: "12 weeks", status: "confirmed" } as Fact,
  cohortSize: { text: "Open to our first 10 participants", status: "confirmed", note: "Owner goal: first 10 participants. Real capacity limit, not a countdown." } as Fact,
} as const;

export const ASSESSMENT = {
  price: { text: "$100", status: "confirmed", note: "Owner-stated direction: $100 assessment with Warda." } as Fact,
  creditTerms: { text: "Whether the $100 is credited toward the $1,000 program, and within what window", status: "pending" } as Fact,
  length: { text: "Assessment length", status: "pending", note: "Rella Reset Blueprint drafts used 60 minutes; not confirmed for this offer." } as Fact,
  format: { text: "In person with Warda", status: "pending", note: "Recommended: in person. Confirm." } as Fact,
  refund: { text: "Assessment payment, cancellation and refund terms", status: "pending" } as Fact,
};

/** Inclusions: every row pending until Dr. Wagner confirms the $1,000 scope. */
export const INCLUSIONS: readonly { label: string; fact: Fact }[] = [
  { label: "Visits with Warda", fact: { text: "Number and cadence of in-person visits", status: "pending" } },
  { label: "Check-ins between visits", fact: { text: "Check-in method and frequency", status: "pending" } },
  { label: "Nutrition & lifestyle support", fact: { text: "What support is provided and by whom", status: "pending" } },
  { label: "Body composition / progress tracking", fact: { text: "Whether scans are included and how often", status: "pending" } },
  { label: "Labs", fact: { text: "Included, billed separately, or ordered only when clinically appropriate", status: "pending" } },
  { label: "Medication", fact: { text: "Included, separate charge, or not part of this offer", status: "pending" } },
];

export const SEPARATE_COSTS: Fact = {
  text: "List of anything billed separately (for example labs or medication, if not included)",
  status: "pending",
};

export const PROVIDER = {
  name: "Warda Harchaoui, PA-C",
  photo: "/images/team/warda-harchaoui.jpg",
  photoAlt: "Warda Harchaoui, PA-C, physician assistant at Rella Aesthetics",
  /** From the approved Team page bio. Weight-care wording below is pending Warda's review. */
  approvedBio:
    "Warda is passionate about wellness and personalized patient care. She loves creating individualized treatment plans that help patients feel their best from the inside out.",
  pendingIntro: {
    text: "Warda's first-person introduction for this program (draft supplied for her edit)",
    status: "pending",
  } as Fact,
  veteranLine: {
    text: "U.S. Air Force veteran",
    status: "pending",
    note: "Public on her LinkedIn; use only with Warda's OK.",
  } as Fact,
};

export const MEDICAL_DIRECTOR =
  "Rella Aesthetics is physician-owned. Dr. Zachary Wagner serves as medical director and supervises Rella’s physician assistants under California law.";

export const LOCATIONS = [
  { id: "vacaville", name: "Rella Aesthetics — Vacaville", street: "542 Main St", city: "Vacaville, CA 95688" },
  { id: "napa", name: "Rella Aesthetics — Napa", street: "1541 3rd St", city: "Napa, CA 94559" },
] as const;
export const LOCATION_SCOPE: Fact = { text: "Which clinic(s) Warda will see program participants at", status: "pending" };

export const START_DATES: Fact = { text: "Program start dates", status: "pending" };

export const PHONE = { display: "(707) 358-2928", href: "tel:+17073582928" };

/** null until a tested Warda assessment route exists. */
export const BOOKING_HREF: string | null = null;

export const PUBLIC_LINKS = {
  privacy: "https://experiencerella.com/privacy-policy",
  terms: "https://experiencerella.com/terms",
  cancellation: "https://experiencerella.com/cancellation-policy",
};

export type Faq = { q: string; a: string; status: FactStatus };
export const FAQS: readonly Faq[] = [
  {
    q: "Who will I see?",
    a: "Your assessment and program visits are with Warda Harchaoui, PA-C. Dr. Zachary Wagner is Rella’s medical director and supervises our physician assistants.",
    status: "confirmed",
  },
  {
    q: "Am I a good fit?",
    a: "That is what the assessment is for. Warda reviews your health history and goals and tells you honestly whether this program is appropriate, or whether another option is safer or a better fit. Not everyone qualifies.",
    status: "confirmed",
  },
  {
    q: "What does the $100 assessment include, and is it credited?",
    a: "PENDING — assessment inclusions, length, and credit terms are awaiting final approval.",
    status: "pending",
  },
  {
    q: "Is medication included?",
    a: "PENDING — whether medication is included, billed separately, or not part of this offer is awaiting final approval.",
    status: "pending",
  },
  {
    q: "How is this different from the Rella Reset program?",
    a: "PENDING — the difference between this $1,000 program and the $2,010 Rella Reset is awaiting final approval.",
    status: "pending",
  },
  {
    q: "What results should I expect?",
    a: "Results vary from person to person, and we don’t promise a specific amount of weight loss. Warda will talk with you about realistic goals and how progress is measured.",
    status: "confirmed",
  },
  {
    q: "What does being one of the first 10 participants mean?",
    a: "We’re opening this program to 10 people first so Warda can give each person close attention. We’ll ask for honest feedback about the experience. Sharing feedback is optional, and we never ask for a positive review or require photos or testimonials.",
    status: "confirmed",
  },
  {
    q: "I’m already in a Rella weight-loss program. Should I switch?",
    a: "Please don’t book a new assessment yet — call us and we’ll connect you with your provider to talk about your current plan.",
    status: "confirmed",
  },
];

export function pendingCount(): number {
  const all: Fact[] = [
    ...Object.values(PROGRAM),
    ...Object.values(ASSESSMENT),
    ...INCLUSIONS.map((i) => i.fact),
    SEPARATE_COSTS,
    LOCATION_SCOPE,
    START_DATES,
    PROVIDER.pendingIntro,
  ];
  return all.filter((f) => f.status === "pending").length + FAQS.filter((f) => f.status === "pending").length + (BOOKING_HREF ? 0 : 1);
}

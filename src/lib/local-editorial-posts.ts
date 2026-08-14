export type EditorialSection = {
  readonly id: string;
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
};

export type EditorialFaq = {
  readonly question: string;
  readonly answer: string;
};

export type LocalEditorialPost = {
  readonly slug: string;
  readonly title: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly excerpt: string;
  readonly category: string;
  readonly publishedAt: string;
  readonly modifiedAt: string;
  readonly authorName: string;
  readonly readingTime: string;
  readonly coverImage: string;
  readonly ogImage: string;
  readonly coverAlt: string;
  readonly eyebrow: string;
  readonly dek: string;
  readonly answerFirst: string;
  readonly keyFacts: readonly string[];
  readonly priceRows: readonly {
    readonly item: string;
    readonly publicPrice: string;
    readonly whatItMeans: string;
  }[];
  readonly sections: readonly EditorialSection[];
  readonly faqs: readonly EditorialFaq[];
  readonly reviewedAgainst: string;
};

/**
 * Durable, build-time editorial content.
 *
 * Sanity remains the long-term CMS. These local posts guarantee that approved,
 * high-intent education does not disappear or 404 when Sanity is not configured
 * in a preview. A local slug is reserved and takes precedence over a CMS record
 * with the same slug until an intentional migration removes it from this file.
 */
export const LOCAL_EDITORIAL_POSTS: readonly LocalEditorialPost[] = [
  {
    slug: "botox-cost-napa",
    title: "Botox in Napa: 2026 Pricing, Membership, and What to Expect",
    seoTitle: "Botox Cost in Napa: 2026 Pricing Guide",
    seoDescription:
      "See Rella Napa's current Botox and Dysport prices, 2026 membership math, booking deposit, visit details, and what determines your total.",
    excerpt:
      "A transparent guide to Rella Napa's Botox, Dysport, membership, and booking-deposit pricing—plus the questions that determine your actual treatment total.",
    category: "Injectables",
    publishedAt: "2026-08-03T12:00:00-07:00",
    modifiedAt: "2026-08-03T12:00:00-07:00",
    authorName: "Rella Aesthetics",
    readingTime: "7 minute read",
    coverImage: "/images/clinic/rella-front-desk-consult.jpg",
    ogImage: "/images/og-botox-cost-napa.png",
    coverAlt: "The reception and front-desk area at Rella Aesthetics in Vacaville",
    eyebrow: "Napa Botox pricing guide",
    dek:
      "The per-unit number matters, but it is not the whole quote. Here is the current Rella Napa pricing and the practical math to review before you book.",
    answerFirst:
      "Rella's current published Napa price is $18 per unit for Botox® and $6 per unit for Dysport. The 2026 Tox Membership is $30 per month with a one-year commitment; members pay $13 per unit for Botox and $4.40 per unit for Dysport. A $50 booking deposit is charged when a new-patient tox appointment is confirmed, and it is separate from treatment pricing.",
    keyFacts: [
      "Downtown Napa: 1541 3rd St, Napa, CA 94559",
      "Clinic hours: Tuesday–Saturday, 9am–5pm",
      "New-patient tox visit: 30 minutes",
      "Free in-person consultation with the first visit",
      "Botox® and Dysport rewards programs accepted",
      "Your provider reviews the proposed units and total before treatment",
    ],
    priceRows: [
      {
        item: "Botox®",
        publicPrice: "$18/unit",
        whatItMeans: "Standard, non-member treatment price",
      },
      {
        item: "Dysport",
        publicPrice: "$6/unit",
        whatItMeans: "Standard, non-member treatment price",
      },
      {
        item: "2026 Tox Membership",
        publicPrice: "$30/month",
        whatItMeans: "One-year membership commitment",
      },
      {
        item: "Member Botox®",
        publicPrice: "$13/unit",
        whatItMeans: "$5 less per unit than the standard price",
      },
      {
        item: "Member Dysport",
        publicPrice: "$4.40/unit",
        whatItMeans: "$1.60 less per unit than the standard price",
      },
      {
        item: "New-patient booking deposit",
        publicPrice: "$50",
        whatItMeans: "Charged at confirmation; separate from treatment pricing",
      },
    ],
    sections: [
      {
        id: "per-unit-versus-total",
        heading: "Why the per-unit price is not your final total",
        paragraphs: [
          "Botox and Dysport are priced by the unit, but the responsible total comes after an in-person assessment. Your anatomy, the muscles and areas being considered, your goals, prior treatment, and the product selected all affect the plan.",
          "That is why this guide does not publish a one-size-fits-all package total or promise a particular unit count. At Rella Napa, the provider maps the proposed plan and explains the expected treatment total before anything is treated.",
        ],
        bullets: [
          "Which areas you want evaluated",
          "How much movement you want to preserve",
          "Your facial anatomy and muscle activity",
          "Whether Botox® or Dysport is the better fit for the plan",
          "Whether this is a first visit, maintenance visit, or follow-up",
        ],
      },
      {
        id: "botox-versus-dysport",
        heading: "Botox vs. Dysport: do not compare the unit prices alone",
        paragraphs: [
          "The $18 Botox and $6 Dysport numbers can look dramatically different on a menu, but the products are measured differently. A Dysport unit is not a one-for-one substitute for a Botox unit, so the lower unit price does not mean the same plan automatically costs one-third as much.",
          "The useful comparison is the complete proposed plan: product, unit count, treatment areas, and total. Your provider can explain why one product may be recommended and show the math before treatment.",
        ],
      },
      {
        id: "booking-deposit",
        heading: "What the $50 booking deposit is—and is not",
        paragraphs: [
          "A card is required to book the 30-minute new-patient tox visit. A $50 deposit is charged when the appointment is confirmed. Card details are handled by the secure booking provider and are not stored on Rella's servers.",
          "The deposit is separate from the per-unit Botox or Dysport treatment price. Rella does not describe it as credited, refundable, transferable, or automatically applied to treatment unless a separately approved policy says so. If you need to cancel, review the current cancellation policy before the 48-hour window.",
        ],
      },
      {
        id: "membership-math",
        heading: "The 2026 Tox Membership math",
        paragraphs: [
          "The membership is $30 per month with a one-year commitment, which is $360 in dues over twelve months. The current member price is $13 per Botox unit instead of $18, a difference of $5 per unit. On price difference alone, 72 Botox units across the year equals $360 in per-unit savings.",
          "For Dysport, the member price is $4.40 instead of $6, a difference of $1.60 per unit. On that price difference alone, 225 Dysport units across the year equals $360. This is transparent arithmetic, not a treatment recommendation: actual product choice, unit use, timing, and eligibility vary. Review the complete membership terms before enrolling.",
        ],
      },
      {
        id: "new-patient-visit",
        heading: "What happens at a new-patient tox visit",
        paragraphs: [
          "The Napa new-patient appointment is scheduled for 30 minutes. The visit starts with a consultation, a review of goals and relevant history, and an assessment of facial movement and anatomy. If treatment is appropriate and you want to proceed, the consultation and treatment can happen in the same appointment.",
          "Results are not immediate and individual response varies. The current Rella guidance is that softening may appear in several days and full effect is assessed around two weeks. Rella's current Napa follow-up policy includes a complimentary two-week touch-up of up to six units when appropriate.",
        ],
      },
      {
        id: "compare-practices",
        heading: "Questions worth asking before you compare prices",
        paragraphs: [
          "A low unit price is not useful if the clinic will not explain the plan, total, follow-up, or who is treating you. A clear consultation should make the decision easier, not pressure you into a package.",
        ],
        bullets: [
          "Who will perform the assessment and treatment?",
          "Will I see the proposed unit count and total first?",
          "What is the current deposit and cancellation policy?",
          "What follow-up is included if the result needs reassessment?",
          "Can I use Allē for Botox® or Aspire for Dysport?",
          "What are the complete membership terms and commitment?",
        ],
      },
      {
        id: "visit-napa",
        heading: "Booking Botox in downtown Napa",
        paragraphs: [
          "Rella Aesthetics Napa is at 1541 3rd St, Napa, CA 94559, with street and garage parking within one block. Current clinic hours are Tuesday through Saturday, 9am to 5pm. Online booking is available at any time, even when the clinic is closed.",
          "If you already know you want a new-patient tox visit, use the Napa-specific booking path. If you still have a pricing or membership question, call Rella at (707) 358-2928 before confirming.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much is Botox per unit in Napa?",
        answer:
          "Rella's current standard Napa price is $18 per unit for Botox®. Tox members pay $13 per unit under the 2026 membership terms.",
      },
      {
        question: "How much is Dysport per unit at Rella Napa?",
        answer:
          "The current standard price is $6 per Dysport unit. Tox members pay $4.40 per unit. Botox and Dysport units are measured differently, so compare the full proposed plan rather than the unit prices alone.",
      },
      {
        question: "How much will my Botox appointment cost in total?",
        answer:
          "The total depends on the product, areas, anatomy, goals, and proposed unit count. Your provider reviews the plan and expected total before treatment.",
      },
      {
        question: "Is the $50 deposit part of the Botox price?",
        answer:
          "No. It is a booking deposit charged when the new-patient appointment is confirmed in Rella's secure booking experience, and it is separate from per-unit treatment pricing.",
      },
      {
        question: "Is the Rella Tox Membership month-to-month?",
        answer:
          "The current 2026 Tox Membership is $30 per month with a one-year commitment. Review the complete terms before enrolling.",
      },
      {
        question: "Does Rella Napa accept Botox and Dysport rewards?",
        answer:
          "Yes. Rella accepts Allē for Botox® and Aspire for Dysport. Bring your account information to the visit so the team can help apply available rewards.",
      },
    ],
    reviewedAgainst:
      "Pricing and booking facts are current as of August 3, 2026 and were reviewed against Rella's July 24 public pricing record and July 26 Napa tox operating decisions.",
  },
] as const;

export function getLocalEditorialPost(
  slug: string,
): LocalEditorialPost | undefined {
  return LOCAL_EDITORIAL_POSTS.find((post) => post.slug === slug);
}

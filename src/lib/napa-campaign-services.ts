export type NapaCampaignServiceSlug =
  | "filler"
  | "laser"
  | "hydrafacial"
  | "hyperhidrosis";

export type NapaCampaignFaq = {
  readonly q: string;
  readonly a: string;
};

export type NapaCampaignService = {
  readonly slug: NapaCampaignServiceSlug;
  readonly bookingService: string;
  readonly trackingService: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly heroTitle: string;
  readonly heroDescription: string;
  readonly primaryCta: string;
  readonly introKicker: string;
  readonly introHeading: string;
  readonly introBody: string;
  readonly highlights: readonly {
    readonly title: string;
    readonly body: string;
  }[];
  readonly pricingHeading: string;
  readonly pricingBody: string;
  readonly priceCards: readonly {
    readonly value: string;
    readonly label: string;
    readonly body: string;
    readonly accent?: boolean;
  }[];
  readonly visitHeading: string;
  readonly visitBody: string;
  readonly visitSteps: readonly string[];
  readonly faqs: readonly NapaCampaignFaq[];
  readonly legal: string;
};

/**
 * Public acquisition copy for the Napa campaign routes.
 *
 * Prices are limited to the binding July 24, 2026 public pricing canon. The
 * superseded WordPress offers ($700 filler, $700/$800 laser, and $50 off a
 * HydraFacial) intentionally do not appear here. No availability promise is
 * made because provider capacity can change faster than a static page.
 */
export const NAPA_CAMPAIGN_SERVICES: Readonly<
  Record<NapaCampaignServiceSlug, NapaCampaignService>
> = {
  filler: {
    slug: "filler",
    bookingService: "dermal-fillers",
    trackingService: "filler",
    title: "Dermal Fillers",
    metaTitle: "Lip & Dermal Filler in Napa, CA",
    metaDescription:
      "Consultation-led lip and dermal filler in downtown Napa. Review current filler pricing, treatment planning, and book Rella Aesthetics at 1541 3rd St.",
    heroTitle: "Lip & Dermal Filler in Napa",
    heroDescription:
      "Thoughtful facial balancing starts with your anatomy, your goals, and a plan that still looks like you.",
    primaryCta: "Book Napa filler",
    introKicker: "Balanced by design",
    introHeading: "Enhancement without a template",
    introBody:
      "Rella offers hyaluronic-acid filler options for areas such as lips, cheeks, and facial folds. The appropriate area, product, and amount are selected only after an in-person assessment.",
    highlights: [
      {
        title: "Lips",
        body: "Shape, hydration, and proportion are considered together rather than chasing a one-size-fits-all look.",
      },
      {
        title: "Cheeks & midface",
        body: "A consultation can assess age-related volume change and whether filler belongs in the plan.",
      },
      {
        title: "Facial balancing",
        body: "Treatment is based on the relationship between features and is recommended only when clinically appropriate.",
      },
      {
        title: "Clear planning",
        body: "Your provider reviews the proposed product, amount, expected total, and aftercare before treatment.",
      },
    ],
    pricingHeading: "Current filler pricing",
    pricingBody:
      "The final product and total depend on the treatment plan. These are the approved current public amounts—not an old promotional price.",
    priceCards: [
      {
        value: "$840",
        label: "base service amount",
        body: "The current dermal-filler base amount in Rella's approved public pricing canon.",
      },
      {
        value: "$540–$960",
        label: "active product range",
        body: "Available filler products span this range; the selected product determines the treatment total.",
      },
      {
        value: "Plan first",
        label: "before treatment",
        body: "Your provider explains the recommendation and expected total before anything is treated.",
        accent: true,
      },
    ],
    visitHeading: "What to expect",
    visitBody:
      "Your visit is built around assessment and informed choice. Treatment timing varies with the areas and plan selected.",
    visitSteps: [
      "Review your goals, health history, and prior injectable treatment",
      "Assess facial anatomy and discuss appropriate product options",
      "Confirm the plan, treatment total, and expected aftercare",
      "Proceed only when the recommendation and timing feel right",
    ],
    faqs: [
      {
        q: "How much does filler cost at Rella Napa?",
        a: "The current dermal-filler base service amount is $840. Active products range from $540 to $960, and your provider reviews the selected product and expected total before treatment.",
      },
      {
        q: "How much filler will I need?",
        a: "That depends on your anatomy, goals, treatment area, and the product selected. Your in-person assessment is where the provider can make a responsible recommendation.",
      },
      {
        q: "Will filler look obvious?",
        a: "The plan is designed around proportion and your stated goals. No clinic can promise a particular result, and individual outcomes vary.",
      },
      {
        q: "Is there downtime after filler?",
        a: "Temporary swelling, tenderness, or bruising can occur. Your provider will review timing and aftercare so you can plan around work, travel, or an event.",
      },
      {
        q: "Can hyaluronic-acid filler be dissolved?",
        a: "Hyaluronic-acid fillers may be dissolved when clinically indicated. The provider can explain when that is appropriate and what the process involves.",
      },
    ],
    legal:
      "Individual results vary. Treatment eligibility, product selection, and amount are determined during an in-person consultation with a licensed provider.",
  },
  laser: {
    slug: "laser",
    bookingService: "laser-treatments",
    trackingService: "laser",
    title: "Laser Skin Treatments",
    metaTitle: "Napa Laser Treatments | IPL & CoolPeel",
    metaDescription:
      "Explore IPL and CO2 CoolPeel options for pigment, redness, and texture in downtown Napa. See current public pricing and book a laser visit at Rella Aesthetics.",
    heroTitle: "Laser Skin Treatments in Napa",
    heroDescription:
      "Sun damage, visible pigment, redness, and texture call for the right device—not a generic treatment plan.",
    primaryCta: "Book Napa laser",
    introKicker: "Device before hype",
    introHeading: "Match the treatment to the concern",
    introBody:
      "Rella's Napa laser menu includes light- and energy-based options. Skin type, treatment goal, recent sun exposure, and downtime tolerance all affect what may be appropriate.",
    highlights: [
      {
        title: "IPL photofacial",
        body: "An option the team may consider for visible sun damage, brown spots, or redness after assessing your skin.",
      },
      {
        title: "CO2 CoolPeel",
        body: "A resurfacing option that may be considered for texture and fine lines, with timing planned around recovery and sun exposure.",
      },
      {
        title: "Season-aware planning",
        body: "Recent tanning, upcoming travel, and your ability to protect treated skin matter when choosing timing.",
      },
      {
        title: "Straight answers",
        body: "The team reviews the device, treatment area, expected downtime, and price before you proceed.",
      },
    ],
    pricingHeading: "Two verified full-face prices",
    pricingBody:
      "Other laser services depend on the treatment area, device, and plan. Rella reviews the current total before treatment.",
    priceCards: [
      {
        value: "$420",
        label: "IPL full face",
        body: "Current approved public amount for the full-face IPL service.",
      },
      {
        value: "$1,440",
        label: "CO2 CoolPeel full face",
        body: "Current approved public amount for the full-face CoolPeel service.",
      },
      {
        value: "Consult first",
        label: "device & timing",
        body: "Suitability and recovery vary, so the right path starts with a skin assessment.",
        accent: true,
      },
    ],
    visitHeading: "A plan you can schedule around",
    visitBody:
      "Treatment length and downtime vary by modality. The team should know about recent sun exposure, skin-care products, and upcoming events before recommending a date.",
    visitSteps: [
      "Identify the concern and review relevant skin and treatment history",
      "Assess skin type, recent sun exposure, and downtime tolerance",
      "Choose the appropriate device, area, settings, and schedule",
      "Review aftercare and sun-protection guidance before treatment",
    ],
    faqs: [
      {
        q: "Which laser treatment is right for me?",
        a: "It depends on your skin type, concern, recent sun exposure, and downtime tolerance. A skin assessment is needed before the team can recommend IPL, CoolPeel, or another available option.",
      },
      {
        q: "How much are full-face IPL and CoolPeel?",
        a: "IPL Full Face is $420 and CO2 CoolPeel Full Face is $1,440 under the current approved public pricing canon. Other areas or services are quoted for the selected plan.",
      },
      {
        q: "How much downtime should I expect?",
        a: "Downtime varies by device and treatment intensity. The team will explain the expected recovery for the exact option being considered before you schedule it.",
      },
      {
        q: "Can I schedule laser treatment after sun exposure?",
        a: "Recent tanning or significant sun exposure can affect treatment timing and safety. Share your exposure and travel plans during the assessment so the provider can advise you appropriately.",
      },
      {
        q: "How many sessions will I need?",
        a: "The number of sessions depends on the concern, modality, response, and goals. Rella does not promise a fixed series before evaluating your skin.",
      },
    ],
    legal:
      "Individual results vary. Laser and light-based treatment eligibility, device selection, settings, and timing require an in-person assessment by a licensed provider.",
  },
  hydrafacial: {
    slug: "hydrafacial",
    bookingService: "hydrafacial",
    trackingService: "hydrafacial",
    title: "HydraFacial",
    metaTitle: "HydraFacial in Napa | Pricing & Booking",
    metaDescription:
      "Book a HydraFacial in downtown Napa. Compare current Signature, Deluxe, and Platinum pricing at Rella Aesthetics, 1541 3rd St.",
    heroTitle: "HydraFacial in Napa",
    heroDescription:
      "A cleanse, exfoliation, extraction, and hydration treatment with three clearly priced tiers in downtown Napa.",
    primaryCta: "Book HydraFacial",
    introKicker: "Cleanse · extract · hydrate",
    introHeading: "Choose the tier that fits the visit",
    introBody:
      "HydraFacial uses a multi-step device treatment to cleanse, exfoliate, extract, and hydrate. Your esthetic provider can help match the available tier to your skin goals and schedule.",
    highlights: [
      {
        title: "Signature",
        body: "The 45-minute starting tier and the service preselected by this page's booking button.",
      },
      {
        title: "Deluxe",
        body: "A 45-minute upgraded tier listed at the current approved public amount of $300.",
      },
      {
        title: "Platinum",
        body: "The 75-minute tier for a longer appointment, listed at the current approved public amount of $390.",
      },
      {
        title: "No coupon confusion",
        body: "This page shows current menu prices and does not rely on the old mention-at-checkout promotion.",
      },
    ],
    pricingHeading: "Three current HydraFacial tiers",
    pricingBody:
      "Choose Signature online or ask the Napa team whether Deluxe or Platinum better fits what you want from the visit.",
    priceCards: [
      {
        value: "$240",
        label: "Signature · 45 min",
        body: "The current entry tier and the option preselected when you book from this page.",
      },
      {
        value: "$300",
        label: "Deluxe · 45 min",
        body: "The current approved public amount for the Deluxe tier.",
      },
      {
        value: "$390",
        label: "Platinum · 75 min",
        body: "The current approved public amount for the longest HydraFacial tier.",
        accent: true,
      },
    ],
    visitHeading: "A low-friction skin refresh",
    visitBody:
      "HydraFacial is commonly chosen when someone wants a device-based facial with little interruption to the rest of the day. Skin response still varies.",
    visitSteps: [
      "Review current skin concerns, sensitivities, and recent treatments",
      "Confirm the HydraFacial tier and any appropriate customization",
      "Cleanse, exfoliate, extract, and hydrate with the device protocol",
      "Finish with aftercare and product guidance for your skin",
    ],
    faqs: [
      {
        q: "How much is a HydraFacial at Rella Napa?",
        a: "Signature HydraFacial is $240, Deluxe is $300, and Platinum is $390 under the current approved public pricing canon.",
      },
      {
        q: "How long does a HydraFacial appointment take?",
        a: "Signature and Deluxe are listed as 45-minute services. Platinum is listed as a 75-minute service.",
      },
      {
        q: "Which HydraFacial tier should I choose?",
        a: "Signature is the starting tier preselected by this page. The Napa team can explain the current menu and help you decide whether Deluxe or Platinum better fits your goals and schedule.",
      },
      {
        q: "Is there downtime after a HydraFacial?",
        a: "Many patients plan HydraFacial as a low-downtime treatment, but temporary flushing or sensitivity can occur and individual response varies.",
      },
      {
        q: "Can I book before an event?",
        a: "Tell the team the event date and any recent skin treatments before booking. They can help you choose timing without promising a particular skin response.",
      },
    ],
    legal:
      "Individual results and skin response vary. Service tier and suitability should be reviewed with the treating provider, particularly after recent procedures or with active skin concerns.",
  },
  hyperhidrosis: {
    slug: "hyperhidrosis",
    bookingService: "hyperhidrosis",
    trackingService: "hyperhidrosis",
    title: "Excessive Sweating Consultation",
    metaTitle: "Excessive Sweating Care in Napa",
    metaDescription:
      "Private excessive-sweating consultation in downtown Napa. Learn about Rella's active MiraDry service, see its current public price, and book a consult-first visit.",
    heroTitle: "Excessive Sweating Care in Napa",
    heroDescription:
      "A private, practical consultation to understand the concern and whether Rella's active MiraDry service or another appropriate path should be considered.",
    primaryCta: "Book private consult",
    introKicker: "Private · practical · judgment-free",
    introHeading: "Start by matching the option to the goal",
    introBody:
      "One concern can have more than one possible path. The first step stays clear: book a private assessment, review the current active MiraDry service and price, and choose only after the differences are understood.",
    highlights: [
      {
        title: "MiraDry",
        body: "Rella's active 60-minute underarm service is the clearly priced device option on this page.",
      },
      {
        title: "Other options",
        body: "A provider can discuss whether another clinically appropriate approach belongs in the plan after reviewing the concern.",
      },
      {
        title: "Private conversation",
        body: "Your health history, symptoms, prior approaches, and goals can be reviewed without shame-based sales language.",
      },
      {
        title: "Stable booking path",
        body: "The CTA books a consultation instead of relying on a time-limited promotional service that may change.",
      },
    ],
    pricingHeading: "Current MiraDry service facts",
    pricingBody:
      "Archived or manager-only specials are not published as standard pricing. Any future public offer requires separate approval.",
    priceCards: [
      {
        value: "$2,400",
        label: "MiraDry",
        body: "The active service's current approved public amount in the July 2026 pricing canon.",
      },
      {
        value: "60 min",
        label: "active service length",
        body: "Rella’s current booking experience lists a 60-minute appointment.",
      },
      {
        value: "Consult first",
        label: "private assessment",
        body: "This page sends you to the verified Napa New Patient Consult rather than a rotating special.",
        accent: true,
      },
    ],
    visitHeading: "What the first visit is for",
    visitBody:
      "The consultation is the place to review the pattern of sweating, prior approaches, medical context, and which available option—if any—fits.",
    visitSteps: [
      "Discuss the concern, history, prior approaches, and treatment goals",
      "Review whether additional medical evaluation should come first",
      "Compare appropriate available paths, timing, cost, and aftercare",
      "Choose a next step only after the differences are clear",
    ],
    faqs: [
      {
        q: "What does this page book?",
        a: "It books the verified Napa New Patient Consult so a provider can review the concern and available options before any procedure is selected.",
      },
      {
        q: "How much is Rella's active MiraDry service?",
        a: "The current approved public amount is $2,400 for the active 60-minute MiraDry service. Any future promotion must be separately approved before it is advertised.",
      },
      {
        q: "Does booking a consultation commit me to treatment?",
        a: "No. The purpose of the consultation is to review the concern and available options so you can decide whether to proceed.",
      },
      {
        q: "Why does Rella require a consultation first?",
        a: "Excessive sweating can have different patterns and medical contexts. A consultation lets the provider review suitability instead of assuming one treatment is right for everyone.",
      },
      {
        q: "Is the consultation private?",
        a: "The visit is handled as a private clinical conversation. Do not send sensitive medical details through advertising or analytics forms; discuss them directly with the provider.",
      },
    ],
    legal:
      "Excessive sweating may have medical causes. A consultation does not guarantee eligibility for treatment and is not a substitute for urgent or emergency medical care.",
  },
} as const;

export const NAPA_CAMPAIGN_SERVICE_ORDER: readonly NapaCampaignServiceSlug[] = [
  "filler",
  "laser",
  "hydrafacial",
  "hyperhidrosis",
];

/**
 * Injectables category discovery content — verified from service-data (botox,
 * dermal-fillers), treatment-editorial, live inventory injectables section, and
 * approved Transform House results. Do not invent goal→product mappings.
 */

export interface InjectablesGoal {
  id: string;
  label: string;
  summary: string;
  possibleTreatments: readonly {
    name: string;
    href: string;
  }[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

export interface InjectablesTool {
  id: string;
  name: string;
  job: string;
  href: string;
}

export interface InjectablesFaqItem {
  question: string;
  answer: string;
}

export const BOTOX_HREF = "/services/botox";
export const FILLERS_HREF = "/services/dermal-fillers";

export const INJECTABLES_GOALS: readonly InjectablesGoal[] = [
  {
    id: "movement-lines",
    label: "Movement lines",
    summary:
      "Botox and Dysport may be considered to temporarily soften the appearance of dynamic expression lines — such as forehead lines, frown lines, and crow's feet — after facial movement is assessed.",
    possibleTreatments: [{ name: "Botox & Dysport", href: BOTOX_HREF }],
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "A Rella Aesthetics team member holding Botox and Dysport vials",
    imagePosition: "object-center",
  },
  {
    id: "volume-balance",
    label: "Volume & balance",
    summary:
      "Dermal fillers may be used to support cheek and midface volume, soft facial balancing, and folds such as nasolabial or marionette lines when clinically appropriate.",
    possibleTreatments: [{ name: "Dermal fillers", href: FILLERS_HREF }],
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "A provider performing an injectable treatment near a patient's lips",
    imagePosition: "object-center",
  },
  {
    id: "lips",
    label: "Lips",
    summary:
      "Lip enhancement and definition are planned with filler after a review of anatomy, goals, and the look you want to keep — amount and product are not one-size-fits-all.",
    possibleTreatments: [{ name: "Dermal fillers", href: FILLERS_HREF }],
    image: "/images/treatments/dermal-fillers.webp",
    imageAlt: "A provider performing an injectable treatment near a patient's lips",
    imagePosition: "object-[center_40%]",
  },
  {
    id: "facial-contour",
    label: "Facial contour",
    summary:
      "Contour goals may involve filler for structural support, and in some plans neuromodulator treatment such as jawline slimming — only after anatomy and goals are reviewed.",
    possibleTreatments: [
      { name: "Dermal fillers", href: FILLERS_HREF },
      { name: "Botox & Dysport", href: BOTOX_HREF },
    ],
    image: "/images/service-fillers.jpg",
    imageAlt: "Injectable treatment context at Rella Aesthetics",
    imagePosition: "object-center",
  },
  {
    id: "tired-looking",
    label: "Tired-looking features",
    summary:
      "When under-eye hollows or midface volume contribute to a tired look, filler may be considered after assessment. Movement lines that read as fatigue may point toward neuromodulator care instead — or alongside.",
    possibleTreatments: [
      { name: "Dermal fillers", href: FILLERS_HREF },
      { name: "Botox & Dysport", href: BOTOX_HREF },
    ],
    image: "/images/service-botox.jpg",
    imageAlt: "Injectable treatment context at Rella Aesthetics",
    imagePosition: "object-top",
  },
  {
    id: "not-sure",
    label: "Not sure yet",
    summary:
      "You do not need to arrive knowing the product name. A consultation maps what you want to soften, support, or leave alone — then names the options that fit.",
    possibleTreatments: [
      { name: "Botox & Dysport", href: BOTOX_HREF },
      { name: "Dermal fillers", href: FILLERS_HREF },
    ],
    image: "/images/treatments/botox-dysport.webp",
    imageAlt: "A Rella Aesthetics team member holding Botox and Dysport vials",
    imagePosition: "object-[center_30%]",
  },
] as const;

export const INJECTABLES_TOOLS: readonly InjectablesTool[] = [
  {
    id: "neuromodulators",
    name: "Botox & Dysport",
    job: "Temporarily reduce targeted muscle activity to soften dynamic lines — product and placement chosen after movement and goals are reviewed.",
    href: BOTOX_HREF,
  },
  {
    id: "fillers",
    name: "Dermal fillers",
    job: "Injectable gels that may add volume or support contour in areas such as the cheeks, lips, and facial folds when appropriate.",
    href: FILLERS_HREF,
  },
] as const;

export const INJECTABLES_FAQ: readonly InjectablesFaqItem[] = [
  {
    question: "How do I know if I need Botox or filler?",
    answer:
      "Movement lines that appear with expression often point toward neuromodulator options such as Botox or Dysport. Volume loss, lip shape, or contour goals often point toward filler. Many plans consider both — your consult decides based on your face, not a menu default.",
  },
  {
    question: "Will I look frozen or overfilled?",
    answer:
      "That is not the goal. Providers discuss the movement and proportions you want to keep before treatment. Individual results vary, and restraint is part of the plan when more product is not the better next step.",
  },
  {
    question: "How long do injectables last?",
    answer:
      "Neuromodulator results typically last about 3–4 months, but timing varies by person, area, and plan. Filler duration depends on the product, area, amount, and individual response — your provider reviews expectations for the exact product being considered.",
  },
  {
    question: "Do I need a consultation first?",
    answer:
      "Yes. Injectable care starts with a review of anatomy, history, goals, and product options before anything is injected.",
  },
  {
    question: "Can filler be reversed?",
    answer:
      "Some hyaluronic acid filler may be reduced or dissolved with hyaluronidase when clinically indicated. Removal is not risk-free and may be difficult or impossible for some materials, so it requires an individual evaluation.",
  },
] as const;

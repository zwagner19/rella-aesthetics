/**
 * The shared, editor-facing before-and-after manifest for both Rella websites.
 *
 * Keep patient names, consent forms, dates of birth, appointment details, and
 * other protected information out of this repository. A result is rendered
 * only after its status is changed to `approved`; that status means the signed
 * public-use authorization was verified in Rella's private records.
 */

export type ResultPlacement = "main-gallery" | "weight-loss";
export type ResultStatus = "draft" | "approved";

export interface BeforeAfterResult {
  id: string;
  status: ResultStatus;
  placement: readonly ResultPlacement[];
  treatment: string;
  /** Optional when the approved public record does not include a timeframe. */
  timeframe?: string;
  beforeSrc: `/${string}`;
  afterSrc: `/${string}`;
  beforeAlt: string;
  afterAlt: string;
  caption: string;
}

export interface PatientResultImage {
  id: string;
  status: ResultStatus;
  placement: readonly ResultPlacement[];
  src: `/${string}`;
  alt: string;
  /** A visible, non-clinical area label when the source does not identify a service. */
  treatmentArea: string;
  caption: string;
}

export const patientResultImages: readonly PatientResultImage[] = [
  {
    id: "patient-result-01",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-01.jpg",
    alt: "Patient before-and-after result photo showing a facial profile shared with Rella Aesthetics",
    treatmentArea: "Facial profile",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-02",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-02.jpg",
    alt: "Patient before-and-after result photo showing a side facial profile shared with Rella Aesthetics",
    treatmentArea: "Facial profile",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-03",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-03.jpg",
    alt: "Patient before-and-after result photo showing the cheeks and lower face shared with Rella Aesthetics",
    treatmentArea: "Cheeks & lower face",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-04",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-04.jpg",
    alt: "Patient before-and-after result photo showing the forehead and eye area shared with Rella Aesthetics",
    treatmentArea: "Forehead & eye area",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-05",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-05.jpg",
    alt: "Patient before-and-after result photo showing the overall face shared with Rella Aesthetics",
    treatmentArea: "Overall face",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-06",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-06.jpg",
    alt: "Patient before-and-after result photo showing the lips and lower face shared with Rella Aesthetics",
    treatmentArea: "Lips & lower face",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-07",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-07.jpg",
    alt: "Patient before-and-after result photo showing the lips shared with Rella Aesthetics",
    treatmentArea: "Lips",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-08",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-08.jpg",
    alt: "Patient before-and-after result photo showing the forehead and lower face shared with Rella Aesthetics",
    treatmentArea: "Forehead & lower face",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
  {
    id: "patient-result-09",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-09.jpg",
    alt: "Patient before-and-after result photo showing the under-eye area shared with Rella Aesthetics",
    treatmentArea: "Under-eye area",
    caption: "Patient result shared with permission. Service details and timing were not provided.",
  },
];
/**
 * Add new results here as `draft`. Do not change one to `approved` until Rella
 * has verified written permission for public marketing use.
 *
 * Example (keep commented until real, consented assets are available):
 * {
 *   id: "weight-loss-01",
 *   status: "draft",
 *   placement: ["weight-loss", "main-gallery"],
 *   treatment: "Medical weight management",
 *   timeframe: "After 6 months",
 *   beforeSrc: "/images/results/weight-loss/weight-loss-01-before.jpg",
 *   afterSrc: "/images/results/weight-loss/weight-loss-01-after.jpg",
 *   beforeAlt: "Before medical weight-management treatment",
 *   afterAlt: "Six months after beginning medical weight-management treatment",
 *   caption: "Treatment and results are individual. Individual results vary.",
 * },
 */
export const beforeAfterResults: readonly BeforeAfterResult[] = [
  {
    id: "chin-jawline-filler-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Chin & Jawline Filler",
    beforeSrc: "/images/results/before-after/chin-jawline-filler-before.webp",
    afterSrc: "/images/results/before-after/chin-jawline-filler-after.webp",
    beforeAlt: "Before chin and jawline filler treatment",
    afterAlt: "After chin and jawline filler treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "tattoo-removal-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Tattoo Removal",
    beforeSrc: "/images/results/before-after/tattoo-removal-before.webp",
    afterSrc: "/images/results/before-after/tattoo-removal-after.webp",
    beforeAlt: "Before tattoo removal treatment",
    afterAlt: "After tattoo removal treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "botox-dysport-neurotoxin-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Botox & Dysport Neurotoxin",
    beforeSrc: "/images/results/before-after/botox-dysport-neurotoxin-before.webp",
    afterSrc: "/images/results/before-after/botox-dysport-neurotoxin-after.webp",
    beforeAlt: "Before Botox and Dysport neurotoxin treatment",
    afterAlt: "After Botox and Dysport neurotoxin treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "coolpeel-co2-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "CoolPeel CO₂",
    beforeSrc: "/images/results/before-after/coolpeel-co2-before.webp",
    afterSrc: "/images/results/before-after/coolpeel-co2-after.webp",
    beforeAlt: "Before CoolPeel CO₂ treatment",
    afterAlt: "After CoolPeel CO₂ treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "full-co2-skin-resurfacing-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Full CO₂ Skin Resurfacing",
    beforeSrc: "/images/results/before-after/full-co2-skin-resurfacing-before.webp",
    afterSrc: "/images/results/before-after/full-co2-skin-resurfacing-after.webp",
    beforeAlt: "Before full CO₂ skin resurfacing treatment",
    afterAlt: "After full CO₂ skin resurfacing treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "prp-hair-restoration-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "PRP Hair Restoration",
    beforeSrc: "/images/results/before-after/prp-hair-restoration-before.webp",
    afterSrc: "/images/results/before-after/prp-hair-restoration-after.webp",
    beforeAlt: "Before PRP hair restoration treatment",
    afterAlt: "After PRP hair restoration treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "ipl-photofacial-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "IPL Photofacial",
    beforeSrc: "/images/results/before-after/ipl-photofacial-before.webp",
    afterSrc: "/images/results/before-after/ipl-photofacial-after.webp",
    beforeAlt: "Before IPL photofacial treatment",
    afterAlt: "After IPL photofacial treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "deka-advanced-co2-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "DEKA Advanced CO₂",
    beforeSrc: "/images/results/before-after/deka-advanced-co2-before.webp",
    afterSrc: "/images/results/before-after/deka-advanced-co2-after.webp",
    beforeAlt: "Before DEKA Advanced CO₂ treatment",
    afterAlt: "After DEKA Advanced CO₂ treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "deluxe-hydrafacial-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Deluxe HydraFacial",
    beforeSrc: "/images/results/before-after/deluxe-hydrafacial-before.webp",
    afterSrc: "/images/results/before-after/deluxe-hydrafacial-after.webp",
    beforeAlt: "Before Deluxe HydraFacial treatment",
    afterAlt: "After Deluxe HydraFacial treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "skin-stylus-microneedling-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Skin Stylus Microneedling",
    beforeSrc: "/images/results/before-after/skin-stylus-microneedling-before.webp",
    afterSrc: "/images/results/before-after/skin-stylus-microneedling-after.webp",
    beforeAlt: "Before Skin Stylus microneedling treatment",
    afterAlt: "After Skin Stylus microneedling treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "acne-facial-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Acne Facial",
    beforeSrc: "/images/results/before-after/acne-facial-before.webp",
    afterSrc: "/images/results/before-after/acne-facial-after.webp",
    beforeAlt: "Before acne facial treatment",
    afterAlt: "After acne facial treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "platinum-hydrafacial-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Platinum HydraFacial",
    beforeSrc: "/images/results/before-after/platinum-hydrafacial-before.webp",
    afterSrc: "/images/results/before-after/platinum-hydrafacial-after.webp",
    beforeAlt: "Before Platinum HydraFacial treatment",
    afterAlt: "After Platinum HydraFacial treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "signature-hydrafacial-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Signature HydraFacial",
    beforeSrc: "/images/results/before-after/signature-hydrafacial-before.webp",
    afterSrc: "/images/results/before-after/signature-hydrafacial-after.webp",
    beforeAlt: "Before Signature HydraFacial treatment",
    afterAlt: "After Signature HydraFacial treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "under-eye-tear-trough-filler-01",
    status: "approved",
    placement: ["main-gallery"],
    treatment: "Under-Eye & Tear-Trough Filler",
    beforeSrc: "/images/results/before-after/under-eye-tear-trough-filler-before.webp",
    afterSrc: "/images/results/before-after/under-eye-tear-trough-filler-after.webp",
    beforeAlt: "Before under-eye and tear-trough filler treatment",
    afterAlt: "After under-eye and tear-trough filler treatment",
    caption: "Patient result shared with permission. Individual results vary.",
  },
];

export function visibleResultsFor(
  results: readonly BeforeAfterResult[],
  placement: ResultPlacement,
): readonly BeforeAfterResult[] {
  return results.filter(
    (result) => result.status === "approved" && result.placement.includes(placement),
  );
}

export function resultPublishingIssues(result: BeforeAfterResult): readonly string[] {
  if (result.status !== "approved") return [];

  const issues: string[] = [];
  if (!result.treatment.trim()) issues.push("treatment");
  if (result.timeframe !== undefined && !result.timeframe.trim()) issues.push("timeframe");
  if (!result.beforeAlt.trim()) issues.push("beforeAlt");
  if (!result.afterAlt.trim()) issues.push("afterAlt");
  if (!result.caption.trim()) issues.push("caption");
  if (!result.beforeSrc.includes("-before.")) issues.push("beforeSrc naming");
  if (!result.afterSrc.includes("-after.")) issues.push("afterSrc naming");
  return issues;
}

function duplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicateValues = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }
  return [...duplicateValues];
}

const publishedResultIds = [
  ...patientResultImages.map((result) => result.id),
  ...beforeAfterResults.map((result) => result.id),
];
const publishedResultAssets = [
  ...patientResultImages.map((result) => result.src),
  ...beforeAfterResults.flatMap((result) => [result.beforeSrc, result.afterSrc]),
];
const duplicatePublishedResultIds = duplicates(publishedResultIds);
const duplicatePublishedResultAssets = duplicates(publishedResultAssets);

if (duplicatePublishedResultIds.length > 0 || duplicatePublishedResultAssets.length > 0) {
  throw new Error(
    `Published result content contains duplicates: ${[
      ...duplicatePublishedResultIds.map((id) => `id:${id}`),
      ...duplicatePublishedResultAssets.map((asset) => `asset:${asset}`),
    ].join(", ")}`,
  );
}

const invalidApprovedResults = beforeAfterResults.flatMap((result) =>
  resultPublishingIssues(result).map((issue) => `${result.id}: ${issue}`),
);

if (invalidApprovedResults.length > 0) {
  throw new Error(`Approved before-and-after content is incomplete: ${invalidApprovedResults.join(", ")}`);
}

export function approvedResultsFor(placement: ResultPlacement): readonly BeforeAfterResult[] {
  return visibleResultsFor(beforeAfterResults, placement);
}

export function approvedPatientResultImages(placement: ResultPlacement): readonly PatientResultImage[] {
  return patientResultImages.filter(
    (result) => result.status === "approved" && result.placement.includes(placement),
  );
}

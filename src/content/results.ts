/**
 * Public, consent-verified patient result images for the Rella gallery.
 *
 * Keep patient names, consent forms, dates of birth, appointment details, and
 * other protected information out of this repository. An image is rendered
 * only when its status is `approved`, which means Rella verified the signed
 * public-use authorization in its private records.
 */

export type ResultPlacement = "main-gallery" | "weight-loss";
export type ResultStatus = "draft" | "approved";

export interface PatientResultImage {
  id: string;
  status: ResultStatus;
  placement: readonly ResultPlacement[];
  src: `/${string}`;
  alt: string;
  /** Owner-confirmed public treatment label for the combined result image. */
  treatment: string;
  caption: string;
}

export const patientResultImages: readonly PatientResultImage[] = [
  {
    id: "patient-result-01",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-01.jpg",
    alt: "Before-and-after lip filler result shared with Rella Aesthetics",
    treatment: "Lip Filler",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-02",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-02.jpg",
    alt: "Before-and-after CoolPeel result shared with Rella Aesthetics",
    treatment: "CoolPeel",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-03",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-03.jpg",
    alt: "Before-and-after microneedling and CoolPeel result shared with Rella Aesthetics",
    treatment: "Microneedling + CoolPeel",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-04",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-04.jpg",
    alt: "Before-and-after Botox result shared with Rella Aesthetics",
    treatment: "Botox",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-05",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-05.jpg",
    alt: "Before-and-after result from three CoolPeel sessions four weeks apart shared with Rella Aesthetics",
    treatment: "3 sessions of CoolPeel 4 weeks apart",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-06",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-06.jpg",
    alt: "Before-and-after lip result shared with Rella Aesthetics",
    treatment: "Lips",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-07",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-07.jpg",
    alt: "Before-and-after Deluxe HydraFacial result shared with Rella Aesthetics",
    treatment: "Deluxe HydraFacial",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-08",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-08.jpg",
    alt: "Before-and-after Botox result shared with Rella Aesthetics",
    treatment: "Botox",
    caption: "Patient result shared with permission. Individual results vary.",
  },
  {
    id: "patient-result-09",
    status: "approved",
    placement: ["main-gallery"],
    src: "/images/results/patient-submissions/result-09.jpg",
    alt: "Before-and-after under-eye filler result shared with Rella Aesthetics",
    treatment: "Under Eye Filler",
    caption: "Patient result shared with permission. Individual results vary.",
  },
];

function duplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicateValues = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }

  return [...duplicateValues];
}

const duplicateResultIds = duplicates(patientResultImages.map((result) => result.id));
const duplicateResultAssets = duplicates(patientResultImages.map((result) => result.src));

if (duplicateResultIds.length > 0 || duplicateResultAssets.length > 0) {
  throw new Error(
    `Patient result content contains duplicates: ${[
      ...duplicateResultIds.map((id) => `id:${id}`),
      ...duplicateResultAssets.map((asset) => `asset:${asset}`),
    ].join(", ")}`,
  );
}

export function approvedPatientResultImages(
  placement: ResultPlacement,
): readonly PatientResultImage[] {
  return patientResultImages.filter(
    (result) =>
      result.status === "approved" && result.placement.includes(placement),
  );
}

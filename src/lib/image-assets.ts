/**
 * Per-image crop guidance for service cards and heroes.
 * Keeps faces, treatment areas, and product context in frame.
 */
export const serviceImageCrops: Record<string, string> = {
  botox: "center 30%",
  "dermal-fillers": "center 35%",
  "chemical-peels": "center 40%",
  facials: "center 45%",
  hydrafacial: "center 40%",
  microneedling: "center 35%",
  "iv-hydration": "center 50%",
  "laser-treatments": "center 40%",
  "weight-loss": "center 35%",
};

/** Required static marketing image paths that must exist in /public. */
export const requiredMarketingImages = [
  "/images/service-botox.jpg",
  "/images/service-fillers.jpg",
  "/images/service-peels.jpg",
  "/images/service-facials.jpg",
  "/images/service-hydrafacial.jpg",
  "/images/service-microneedling.jpg",
  "/images/service-iv.jpg",
  "/images/service-laser.jpg",
  "/images/service-weightloss.jpg",
  "/images/dr-zachary-wagner.jpg",
  "/brand/rella-logo-black.svg",
] as const;

export const WEIGHT_LOSS_HOST = "weightloss.experiencerella.com";

export function isWeightLossHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return host.split(":")[0].trim().toLowerCase() === WEIGHT_LOSS_HOST;
}

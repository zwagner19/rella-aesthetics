export const CONTACT_INTENTS = {
  membership: "Membership Questions",
  "private-parties": "Private Party Questions",
  "payment-plans": "Payment Plan Questions",
} as const;

export const EXTRA_CONTACT_INTERESTS = Object.values(CONTACT_INTENTS);

export function resolveContactIntent(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "";
  return CONTACT_INTENTS[value as keyof typeof CONTACT_INTENTS] ?? "";
}

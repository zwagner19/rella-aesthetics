/** A browser-local readiness hook; it contains no identifiers or event sink. */
let activePreparation: (() => Promise<void>) | null = null;

export function registerAestheticsBookingPreparation(prepare: () => Promise<void>): () => void {
  activePreparation = prepare;
  return () => { if (activePreparation === prepare) activePreparation = null; };
}

export async function prepareAestheticsBookingAttribution(): Promise<void> {
  if (activePreparation) await activePreparation();
}

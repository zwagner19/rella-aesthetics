import type { GuidedScheduledTreatment } from "./types";

/** Boulevard item times without an offset are already local to the clinic. */
export function formatScheduledStart(item: GuidedScheduledTreatment): string {
  const naive = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(item.startTime);
  const date = new Date(naive ? `${item.startTime}Z` : item.startTime);
  if (!Number.isFinite(date.getTime())) return "Time could not be verified";
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: naive ? "UTC" : item.timeZone,
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }).format(date);
  return `${label} Pacific time`;
}

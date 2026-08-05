const WEIGHT_LOSS_BOOKING_ORIGIN = "https://book.rellaweightloss.com";

const CLICK_ID_FIELDS = ["gclid", "gbraid", "wbraid", "gclsrc"] as const;
const MARKETING_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "campaignid",
  "adgroupid",
  "keyword",
  "matchtype",
  "device",
  "network",
] as const;

const MARKETING_ALIASES: Readonly<Record<string, (typeof MARKETING_FIELDS)[number]>> = {
  gad_campaignid: "campaignid",
  gad_adgroupid: "adgroupid",
  gad_keyword: "keyword",
  gad_matchtype: "matchtype",
  gad_device: "device",
  gad_network: "network",
};

const CLICK_ID_RE = /^[\w.~-]{1,200}$/;
const MARKETING_PARAM_RE = /^[A-Za-z0-9_ .~:+/-]{1,200}$/;
const EMAIL_LIKE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_LIKE = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;

function isApprovedMarketingValue(value: string): boolean {
  return (
    MARKETING_PARAM_RE.test(value) &&
    !EMAIL_LIKE.test(value) &&
    !PHONE_LIKE.test(value)
  );
}

function approvedAttribution(search: string): Map<string, string> {
  const incoming = new URLSearchParams(search);
  const approved = new Map<string, string>();

  for (const field of CLICK_ID_FIELDS) {
    const value = incoming.get(field)?.trim();
    if (value && CLICK_ID_RE.test(value)) approved.set(field, value);
  }
  for (const field of MARKETING_FIELDS) {
    const value = incoming.get(field)?.trim();
    if (value && isApprovedMarketingValue(value)) approved.set(field, value);
  }
  for (const [alias, canonical] of Object.entries(MARKETING_ALIASES)) {
    if (approved.has(canonical)) continue;
    const value = incoming.get(alias)?.trim();
    if (value && isApprovedMarketingValue(value)) approved.set(canonical, value);
  }

  return approved;
}

/**
 * Carry only approved Google click and campaign fields into Rella's first-party
 * booking app. The booking app encrypts click IDs before creating a Boulevard
 * cart, then removes them from its address bar after capture.
 */
export function withWeightLossAttribution(href: string, search: string): string {
  let destination: URL;
  try {
    destination = new URL(href);
  } catch {
    return href;
  }
  if (destination.origin !== WEIGHT_LOSS_BOOKING_ORIGIN) return href;

  for (const [field, value] of approvedAttribution(search)) {
    destination.searchParams.set(field, value);
  }
  return destination.toString();
}

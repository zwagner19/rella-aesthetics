import { readFile } from "node:fs/promises";

const planUrl = new URL(
  "../docs/paid-search/google-ads-recovery-plan-2026-08-04.json",
  import.meta.url,
);
const plan = JSON.parse(await readFile(planUrl, "utf8"));
const failures = [];

function fail(message) {
  failures.push(message);
}

if (plan.status !== "PAUSED_PENDING_GATES") {
  fail("The recovery plan must remain paused pending external gates.");
}

if (plan.accountControls.network !== "GOOGLE_SEARCH_ONLY") {
  fail("Only Google Search is allowed in the recovery plan.");
}

for (const key of ["searchPartners", "displayNetwork", "aiMax", "performanceMax", "demandGen"]) {
  if (plan.accountControls[key] !== false) fail(`${key} must remain disabled.`);
}

if (plan.accountControls.conversionRoles.bookingCtaClick !== "SECONDARY") {
  fail("A booking CTA click must remain a secondary observation signal.");
}

const liveSnapshot = plan.liveReadOnlyAccountSnapshot;
const observedEnabledBudget = liveSnapshot.enabledCampaigns.reduce(
  (total, campaign) => total + campaign.dailyBudgetUsd,
  0,
);
if (liveSnapshot.enabledCampaignCount !== liveSnapshot.enabledCampaigns.length) {
  fail("The live enabled-campaign count does not match the captured campaign list.");
}
if (observedEnabledBudget !== liveSnapshot.enabledAverageDailyBudgetUsd) {
  fail("The live enabled daily budget does not match the captured campaign sum.");
}
if (liveSnapshot.enabledAverageDailyBudgetUsd !== 207) {
  fail("The August 4 live account snapshot must preserve the observed $207/day risk state.");
}
if (liveSnapshot.controlFailuresObserved.spendingAdsFinalUrlSuffix !== "BLANK") {
  fail("The August 4 live snapshot must preserve the blank tracking-suffix finding.");
}
if (!liveSnapshot.controlFailuresObserved.bookingClickLocationMismatchObserved) {
  fail("The August 4 live snapshot must preserve the booking-click location mismatch.");
}

const forbiddenAudiences = new Set([
  "CUSTOMER_MATCH",
  "YOUR_DATA_SEGMENTS",
  "WEBSITE_VISITOR_REMARKETING",
  "LOOKALIKE_SEGMENTS",
  "AUDIENCE_EXPANSION",
]);
for (const audience of forbiddenAudiences) {
  if (!plan.accountControls.audienceExclusions.includes(audience)) {
    fail(`Missing sensitive-health audience exclusion: ${audience}`);
  }
}

for (const valueTrack of [
  "{campaignid}",
  "{adgroupid}",
  "{keyword}",
  "{creative}",
  "{matchtype}",
  "{device}",
]) {
  if (!plan.accountControls.finalUrlSuffix.includes(valueTrack)) {
    fail(`Final URL suffix is missing ${valueTrack}.`);
  }
}

const allowedPaths = new Set([
  "/napa",
  "/napa/botox",
  "/napa/filler",
  "/napa/hydrafacial",
  "/napa/hyperhidrosis",
  "/napa/laser",
]);
const allowedMatchTypes = new Set(["EXACT", "PHRASE"]);
const forbiddenCopy = [
  /\$\s*\d/,
  /\bbest\b/i,
  /guarantee/i,
  /same[- ]week/i,
  /zero downtime/i,
  /free 6[- ]unit/i,
  /natural[- ]looking results/i,
  /lasts months, not days/i,
  /quick in[- ]office treatment/i,
];

let proposedDailyTotal = 0;
for (const campaign of plan.campaigns) {
  proposedDailyTotal += campaign.proposedDailyBudget;

  if (!campaign.recommendedStatus.startsWith("PAUSED_")) {
    fail(`${campaign.name}: recommended status must remain paused.`);
  }

  const finalUrl = new URL(campaign.finalUrl);
  if (finalUrl.protocol !== "https:" || finalUrl.hostname !== "experiencerella.com") {
    fail(`${campaign.name}: final URL must use the public HTTPS Rella domain.`);
  }
  if (!allowedPaths.has(finalUrl.pathname) || finalUrl.search || finalUrl.hash) {
    fail(`${campaign.name}: final URL is not an approved exact landing path.`);
  }

  if (campaign.headlines.length < 3 || campaign.headlines.length > 15) {
    fail(`${campaign.name}: responsive ad requires 3–15 headlines.`);
  }
  if (campaign.descriptions.length < 2 || campaign.descriptions.length > 4) {
    fail(`${campaign.name}: responsive ad requires 2–4 descriptions.`);
  }

  for (const headline of campaign.headlines) {
    if (headline.length > 30) fail(`${campaign.name}: headline exceeds 30 characters: ${headline}`);
  }
  for (const description of campaign.descriptions) {
    if (description.length > 90) fail(`${campaign.name}: description exceeds 90 characters: ${description}`);
  }
  for (const copy of [...campaign.headlines, ...campaign.descriptions]) {
    for (const pattern of forbiddenCopy) {
      if (pattern.test(copy)) fail(`${campaign.name}: prohibited or stale ad promise: ${copy}`);
    }
  }

  for (const adGroup of campaign.adGroups) {
    if (!adGroup.keywords.length) fail(`${campaign.name}/${adGroup.name}: no keywords.`);
    for (const keyword of adGroup.keywords) {
      if (!allowedMatchTypes.has(keyword.matchType)) {
        fail(`${campaign.name}/${adGroup.name}: ${keyword.text} uses ${keyword.matchType}.`);
      }
    }
  }
}

if (proposedDailyTotal > plan.accountControls.budgetControls.proposedNapaCeilingDaily) {
  fail(`Proposed daily total ${proposedDailyTotal} exceeds the proposed Napa ceiling.`);
}

if (failures.length) {
  console.error("Paid-search recovery plan check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Paid-search recovery plan passed: ${plan.campaigns.length} campaigns remain paused, ` +
    `$${proposedDailyTotal}/day proposed after gates, exact/phrase Search only, ` +
    `booking clicks secondary, RSA limits/claims valid, and the live $${observedEnabledBudget}/day ` +
    "enabled-account risk is preserved for reconciliation.",
);

# Rella revenue operating scorecard — 2026-08-03

## Decision this scorecard supports

Every weekly review should answer one question: which service-and-clinic demand should Rella scale, fix, cap, or stop based on arrived-patient economics and real calendar capacity?

Clicks and booking-button events are useful diagnostics, not the business outcome. The scorecard therefore treats arrived new patients and collected revenue as the controlling results, then uses the website, CRM, and scheduler metrics to explain where the funnel is leaking.

## Selected primary KPIs

### 1. Cost per arrived new patient

**Definition**

`eligible acquisition spend ÷ unique new patients who arrived from that acquisition cohort`

Report by week, clinic, service family, and source/campaign. Use the patient's first arrived appointment in the attribution window; do not count reschedules, duplicate leads, booking clicks, canceled appointments, or no-shows as arrivals.

**Why it controls the decision**

This is the closest operating measure of whether paid demand is buying a real new-patient visit. It prevents a cheap click or booking-button event from being mistaken for revenue.

**Source of truth**

- spend: Google Ads or the relevant ad platform;
- arrival and new/returning status: Boulevard;
- attribution link: approved first-party/CRM reconciliation described below.

**Limitation**

It does not prove profitability when services have materially different revenue and variable cost. Pair it with first-visit contribution.

### 2. First-visit contribution after acquisition

**Definition**

`collected first-visit revenue − refunds − direct variable treatment cost − attributed acquisition spend`

Report both dollars and percentage of collected revenue. Keep membership dues, packages, and later visits separate until a reviewed cohort-retention method exists.

**Why it controls the decision**

This is the direct answer to “are we filling the book without losing money?” It distinguishes a high-value arrived visit from a low-value one and stops ROAS from overstating value when direct treatment costs differ.

**Source of truth**

- collected revenue/refunds: the practice's approved financial or point-of-sale record;
- direct variable cost: owner-approved service cost table;
- acquisition spend: ad platform;
- arrival: Boulevard.

**Limitation**

The required financial source and service-level variable-cost table have not been identified in this repository. Do not publish this KPI until those inputs have an owner.

### 3. Advertised capacity fill rate

**Definition**

`booked provider hours for the advertised service ÷ bookable provider hours intentionally made available for that service`

Report by clinic, service family, provider pool, and week. Exclude closed hours, approved leave, internal blocks, and capacity not intended for the advertised service from the denominator. Show arrived hours separately from booked hours.

**Why it controls the decision**

Growth should fill profitable open capacity, not overload one provider while another service remains empty. This KPI is the operating brake on budget expansion and availability copy.

**Source of truth**

- bookable hours and provider assignments: Boulevard schedule/admin configuration;
- booked and arrived hours: Boulevard appointment records;
- advertised service mapping: approved campaign-to-service map.

**Limitation**

The imported Napa capacity map is a useful baseline, not a current denominator. Recompute from the live provider schedule before launch and weekly thereafter.

## Driver metrics

| Driver | Calculation | Decision it informs | Source |
| --- | --- | --- | --- |
| Qualified leads | Unique new inquiries meeting the owner-approved qualification rule | Is demand relevant enough to work? | HighLevel |
| Median and 90th-percentile first-response time | First human response timestamp minus accepted lead timestamp, during staffed hours | Is follow-up speed causing lead loss? | HighLevel/call system |
| Qualified lead-to-book rate | Unique qualified leads with a booked appointment ÷ unique qualified leads | Is the team converting viable inquiries? | HighLevel + Boulevard reconciliation |
| Booked-to-arrived rate | Unique arrived appointments ÷ unique booked appointments | Are reminders, deposits, scheduling, and expectations producing attendance? | Boulevard |
| Landing-to-booking-intent rate | Unique booking-intent visitors ÷ eligible landing-page visitors | Is the website handoff persuasive and usable? | Approved GA4/GTM setup |
| Booking-intent-to-book gap | Booking-intent visitors versus attributable completed bookings | Is the scheduler or attribution bridge losing people? | GA4/GTM + Boulevard |
| Available appointment lead time | Earliest appropriate bookable slot minus inquiry/booking date | Is demand being sent to an overconstrained calendar? | Boulevard |

Qualified lead must be defined once by the owner. A workable starting definition is a real person, reachable by valid phone or email, seeking a service Rella currently offers in an appropriate clinic, with no duplicate inquiry inside the chosen deduplication window. Do not infer clinical candidacy from an online form.

## Guardrails

### Zero-tolerance release guardrails

- accepted website lead with no HighLevel contact: `0`;
- wrong-clinic or wrong-service booking handoff: `0`;
- analytics event containing name, email, phone, message, service choice, clinic choice, or health information: `0`;
- paid traffic to an unavailable service/location pairing: `0`;
- public price or claim conflicting with the approved source: `0`.

### Weekly quality guardrails

- cancellation rate;
- no-show rate;
- refund/chargeback rate;
- complaint or adverse-event escalation count, handled only in the appropriate clinical system;
- lead/contact duplication rate;
- CRM delivery and booking-route failure rate;
- provider capacity concentration, especially facial/HydraFacial demand concentrated in one esthetician.

These guardrails prevent a nominally lower acquisition cost from hiding poor attendance, poor fit, operational overload, or trust/compliance harm.

## Target-setting decision

Firm scale targets should not be invented yet. The required live inputs are missing:

- arrived new patients attributable to each campaign/service/location;
- collected first-visit revenue and refunds;
- direct variable cost by service;
- current bookable provider hours by service/location;
- current show, cancellation, and response-time baselines;
- an approved attribution method that links aggregate source to booking and arrival without exposing patient data to ad platforms.

Use this bottom-up formula once those inputs are approved:

`allowable cost per arrived patient = expected collected first-visit revenue − direct variable treatment cost − required first-visit contribution`

Then compare the allowable amount with actual cost per arrived patient and available capacity. A campaign is not scalable merely because it beats a booking-click target.

### Imported planning guardrails—not final operating targets

The July performance scoreboard recorded provisional booked-patient CAC bands:

- overall: `$100–$125`;
- HydraFacial: `<$75`;
- Botox/filler: `<$125`;
- laser/PRP/hyperhidrosis: `<$175`;
- diagnostic pause trigger: approximately 30 qualified clicks without a conversion signal or spend at least 3× expected CAC with no booking;
- budget movement: no more than 20% per campaign per 72 hours.

These figures were planning assumptions and the recorded “conversions” were often booking-button credits, not reconciled arrivals. Preserve them as historical reference only. Dr. Wagner or the financial owner must replace or explicitly reaffirm them after the first complete arrived-patient economics review.

## Attribution and privacy gap

The current contact API writes a generic HighLevel source (`Rella Website — Contact Form`) plus service and clinic routing. It does not persist campaign/source parameters. Campaign pages can emit privacy-bounded booking-intent events, but Boulevard remains the source of truth for completed appointments.

Therefore, campaign-level cost per arrived patient cannot yet be calculated reliably from the website alone. Before claiming campaign profitability, choose one approved approach:

1. a first-party attribution design reviewed for the health-services context and stored only in approved CRM fields;
2. an aggregate weekly reconciliation between ad campaign, landing page, HighLevel, and Boulevard;
3. a call-tracking/booking integration that has passed privacy, consent, and data-minimization review.

Do not send patient identity or health/service selections back to Google, Meta, or ordinary analytics to solve this gap. Do not add advertising click identifiers or campaign fields to the contact payload without a specific privacy/compliance decision and dedicated CRM destinations.

## Review cadence and decision rules

### Daily for the first seven days

Review spend, valid lead delivery, response time, booking-route health, appointment lead time, disapprovals/billing, and urgent capacity mismatches. Make no success claim from same-day click volume.

### Weekly operating review

1. Read primary KPIs by clinic and service.
2. Diagnose movement with the driver metrics.
3. Check every guardrail before recommending scale.
4. Choose exactly one action per service/campaign: scale, hold, repair, cap, or stop.
5. Record the action owner, date, evidence window, and next review date.

### Scale

Scale only when the current campaign has attributable arrivals, cost per arrived patient is below the owner-approved allowable amount, first-visit contribution is acceptable, and capacity remains intentionally available. Reconfirm billing and policy state first.

### Hold or cap

Hold when evidence is too thin. Cap when a provider/service is nearing the owner-approved capacity ceiling or appointment lead time is no longer acceptable.

### Repair

Repair when qualified demand exists but response time, lead-to-book, booking-to-arrival, scheduler routing, message match, or attribution is failing.

### Stop

Stop or pause affected traffic for a zero-tolerance guardrail breach, unavailable inventory, unapproved claim/price, unresolved billing suspension risk, or spend beyond the owner-approved loss limit without attributable arrivals.

## Required source owners

| Source | Required owner | Required fields |
| --- | --- | --- |
| Google Ads/other media | Marketing owner | date, account, campaign, spend, clicks, booking-intent signals, billing/policy status |
| GA4/GTM | Analytics/privacy owner | landing sessions and generic intent events only; no patient or health data |
| HighLevel | Lead-operations owner | accepted lead, qualification, first response, service/clinic routing, booking outcome |
| Boulevard | Practice operations | appointment, clinic, service, provider pool, status, duration, new/returning, bookable capacity |
| Financial/POS record | Financial owner | collected revenue, refunds, membership/package treatment, direct variable cost |

Until these owners and joins are approved, the scorecard is a measurement contract—not a claim that current campaigns are profitable.

## Evidence reviewed

- Imported `01 Napa Capacity Map.md` — provider/service capacity baseline and concentration risk.
- Imported `03 Performance Scoreboard.md` — prior KPI table and provisional acquisition guardrails.
- Imported `06 Daily Optimization Log.md` — spend, click, booking-intent, billing, campaign-state, and reconciliation gaps through August 3.
- Current website conversion and HighLevel delivery code — generic intent events, accepted-lead rule, service/clinic routing, and current attribution boundary.
- `docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md` — production, privacy, booking, and operating guardrails.

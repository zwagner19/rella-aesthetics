# Rella paid-acquisition recovery control pack — 2026-08-04

## Executive decision

Do not scale or reactivate paid search yet. Recover the existing Napa program only after the billing, campaign-state, website, measurement, capacity, and owner-economics gates in this packet are closed.

The current record proves spend and booking-button activity, not appointments or revenue. Until an ad click can be reconciled to a completed booking, an arrived patient, and collected revenue, Google Ads is a cash-exposure channel rather than a demonstrated growth engine.

No Google Ads setting, campaign, budget, billing method, CRM record, booking record, deployment, domain, or public website was changed while preparing this packet.

## What the imported record establishes

The figures below are a historical control snapshot from the imported Napa campaign records, last updated August 3, 2026. They are not a substitute for the current Google Ads interface.

| Evidence | Last recorded state | Operating conclusion |
| --- | ---: | --- |
| Napa build, trailing 7 days | `$499.23` spend, `108` clicks, `5` booking-CTA click credits | `$99.85` per click credit; no appointment proof |
| Napa build, recorded lifetime through August 2 | `$1,499.20` spend, `330` clicks, `18.84` booking-CTA click credits | `$79.58` per click credit; no confirmed appointment, arrival, or revenue attribution |
| Billing warning | `$893.82` past due; suspension-risk notice received August 3 at 06:49 PT | Resolve in the account before any campaign decision |
| Napa build campaign budgets | Brand `$5`, Botox/Dysport `$40`, laser `$25`, filler `$12` per day | `$82/day` recorded enabled exposure |
| Separately enabled, intent unconfirmed | Vacaville medical weight loss `$75/day`; Napa medical weight loss `$40/day` | `$115/day` must be confirmed or paused deliberately |
| Combined recorded exposure | `$197/day`, excluding the separate Vacaville brand campaign | Unacceptable to leave ambiguous while measurement is unproven |

A connected-email search found the August 3 past-due warning and no later payment receipt or resolution notice. That is not proof the balance remains unpaid; the current Google Ads billing screen and payment method are the source of truth.

For most Search campaigns, Google says the daily spending limit can be twice the average daily budget and the monthly spending limit is 30.4 times the average daily budget. On the recorded campaign configuration, the cash exposure is therefore:

| Scope | Average daily budget | Approximate monthly spending limit | Possible daily spending limit for most campaigns |
| --- | ---: | ---: | ---: |
| Napa build | `$82` | `$2,492.80` | `$164` |
| Unconfirmed weight-loss campaigns | `$115` | `$3,496.00` | `$230` |
| Combined | `$197` | `$5,988.80` | `$394` |

Source: [Google Ads spending limits](https://support.google.com/google-ads/answer/10486637). Actual account charges, credits, campaign types, and serving state must be checked in the account.

## One-screen owner decision card

Record every answer before an account operator touches campaign status or budget.

| Decision | Owner answer | Required evidence |
| --- | --- | --- |
| Is the `$893.82` balance resolved and the account free of suspension warnings? |  | Current billing-screen capture and active payment method |
| Should the Napa and Vacaville medical-weight-loss campaigns be enabled, paused, or retired? |  | Exact campaign names, current budgets, program facts, certification/policy state, and current city capacity |
| May the four stage-one Napa campaigns be prepared at a combined `$82/day`? |  | Explicit budget authorization; this packet does not grant it |
| What is the maximum weekly cash at risk before an arrived-patient review? |  | Dollar amount approved by Dr. Wagner |
| What is the allowable cost per arrived patient for Brand, Botox/Dysport, laser, and filler? |  | 90-day contribution margin and approved acquisition fraction for each service |
| What are the current staffed appointment openings and acceptable lead time by service? |  | Live provider calendar for the next 14 and 30 days |
| Are Napa hours Tuesday–Saturday, 9:00–5:00, and staffed phone coverage aligned? |  | Website, Boulevard, Google Business Profile, and call schedule agree |
| Is the exact hosted preview approved and has it passed the CRM/booking/analytics gate? |  | Commit, preview URL, completed run sheet, and synthetic lead evidence |

| Approval field | Record |
| --- | --- |
| Owner | Zachary Wagner, DO, Physician Owner and American Board of Obesity Medicine diplomate |
| Decision date/time |  |
| Approved operator |  |
| Exact approved campaigns and budgets |  |
| Signature/approval record |  |

## Recovery campaign map

Every campaign in the machine-readable build remains `PAUSED_PENDING_GATES`. The proposed budget is a planning limit, not authorization.

| Stage | Campaign | Proposed daily budget | Exact landing page | Activation ruling |
| --- | --- | ---: | --- | --- |
| 1 | Rella \| Napa \| Brand \| Search | `$5` | `/napa` | First defensive test after all gates |
| 1 | Rella \| Napa \| Botox-Dysport \| Search | `$40` | `/napa/botox` | First service test after capacity and measurement proof |
| 1 | Rella \| Napa \| Laser-Pigmentation \| Search | `$25` | `/napa/laser` | First service test after capacity and measurement proof |
| 1 | Rella \| Napa \| Filler \| Search | `$12` | `/napa/filler` | First service test after capacity and measurement proof |
| 2 | Rella \| Napa \| HydraFacial \| Search | `$0` proposed; imported campaign was `$10` | `/napa/hydrafacial` | Hold until provider-book capacity is confirmed weekly |
| 3 | Rella \| Napa \| Hyperhidrosis \| Search | `$0` proposed; imported campaign was `$8` | `/napa/hyperhidrosis` | Hold for policy, service mapping, and capacity review |

Proposed stage-one total: `$82/day`. Proposed hard planning ceiling: `$100/day`. No amount is authorized by this file.

The campaign build is in [`docs/paid-search/google-ads-recovery-plan-2026-08-04.json`](paid-search/google-ads-recovery-plan-2026-08-04.json). It contains the exact/phrase keywords, safe negative candidates, responsive-search-ad copy, landing pages, ValueTrack suffix, audience restrictions, and release gates. Validate it with:

```bash
npm run check:paid-search
```

## Account controls

Use Google Search only. Keep Search Partners, Display expansion, AI Max, Performance Max, and Demand Gen off during recovery. Use exact and phrase match only. Target a proposed 15-mile radius around the Napa clinic with the location option set to people in or regularly in the targeted area, not people merely interested in it. Google documents that the default location option can include interest; the recovery plan requires presence-only targeting. Source: [Google Ads location options](https://support.google.com/google-ads/answer/9376662).

Do not use Customer Match, website-visitor remarketing, customer lists, similar/lookalike expansion, or other advertiser-curated audiences for these health and injection campaigns. Google treats health, medical procedures, injections, and restricted drug terms as sensitive-interest categories and restricts those targeting methods. Ordinary Search keywords and allowed location targeting may still be used. Source: [Google personalized advertising policy](https://support.google.com/adspolicy/answer/143465).

Prescription-drug terms may appear in United States ad copy and landing pages subject to policy, but keyword targeting of prescription-drug terms requires certification. Do not add prescription-drug keywords or activate a campaign that depends on them until the account's certification state is verified. Source: [Google restricted drug terms policy](https://support.google.com/adspolicy/answer/15595717).

Use this final URL suffix without patient or health information:

```text
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_adgroup={adgroupid}&utm_term={keyword}&utm_content={creative}&utm_matchtype={matchtype}&utm_device={device}
```

Do not place a visitor's name, email, phone, message, chosen provider, treatment detail, or other health information in a URL, event parameter, audience, or analytics property.

## Measurement hierarchy

The conversion ladder is deliberately strict:

1. Booking CTA click — secondary observation only; never bid toward it.
2. Qualified call — secondary until duration and call quality are verified.
3. Completed booking — primary only after an end-to-end test proves the event and excludes patient/health data.
4. Arrived patient — operating source of truth.
5. Collected revenue — operating source of truth.

Google Ads uses primary actions for bidding and secondary actions for observation. Source: [Google Ads conversion goals](https://support.google.com/google-ads/answer/10995103).

Do not upload patient-level offline conversions, hashed customer lists, or enhanced-conversion data until Dr. Wagner has approved the privacy/compliance design and the exact data fields. Appointment and revenue reconciliation may be performed in a restricted operating report without feeding protected or sensitive data back to ad platforms.

## Economics and budget rules

Calculate service-level limits rather than inventing one blended lead target:

```text
Allowable arrived-patient CPA
  = 90-day contribution margin per new arrived patient
  × owner-approved acquisition fraction
```

```text
Weekly cash-at-risk limit
  = min(
      owner-approved cash-at-risk cap,
      open appointment slots × allowable arrived-patient CPA,
      confirmed ability to answer, book, and serve demand
    )
```

The owner must provide the acquisition fraction and cash-at-risk amount. Do not infer either from revenue, ticket price, or historical spend.

Budget operating rules:

- Do not increase a campaign based on booking-button clicks, CTR, CPC, or Google's modeled conversions.
- Start only the explicitly approved stage-one campaigns and remain within the approved combined cap.
- Require at least three reconciled arrived patients and preferably 14 stable days before any scale decision.
- Increase no more than 20% at a time and wait at least 72 hours between increases.
- Review search terms, spend, calls, bookings, arrivals, collected revenue, and open capacity by clinic and service every business day during recovery.
- Pause a service campaign when its calendar cannot absorb demand within the owner-approved lead time.

## Website and offer reconciliation

The imported ad packet contains offers and promises that are superseded by the rebuilt source and must not be reused.

| Area | Superseded ad record | Current controlled source/ruling |
| --- | --- | --- |
| Botox/Dysport | `$15` Botox, `$5` Dysport | Public site: `$18`/unit and `$6`/unit; member pricing and terms remain on the approved page. Recovery ads make no price claim. |
| Filler | approximately `$700` | Public base `$840`; current active-product range `$540–$960`. Recovery ads make no price claim. |
| Laser | `$700` or `$800` | Current named-service pricing differs by service, including full-face IPL `$420` and CoolPeel `$1,440`. Land on the exact current page. |
| Hyperhidrosis | approximately `$1,000` sweat treatment | Current active MiraDry path is consult-first and lists `$2,400`. Do not map stale copy to the new path. |
| HydraFacial | `$50 off` offer | Removed. Current tiers are `$240`, `$300`, and `$390`; campaign remains capacity-gated. |
| Timing/outcomes | same-week, zero downtime, free touch-up, guaranteed-style language | Prohibited in the recovery build. Individual eligibility, plan, timing, response, and recovery require assessment. |

Before activation, compare every final ad and landing page with the exact public commit and Boulevard inventory. Fail the release for a stale price, unavailable service, wrong clinic, unsupported promise, or mismatched booking route.

## Negative-keyword control

Safe first-pass exclusions are included for clearly irrelevant intent such as jobs, training, wholesale purchasing, DIY/at-home products, LASIK/vision, tattoo removal, and known wrong-city traffic. Apply them only after checking the live search-term report for accidental loss of relevant clinical intent.

The following require an owner/operator decision rather than automatic exclusion:

- competitor names;
- broad device and treatment names that may map to a real Rella service;
- research terms that may still lead to a qualified consultation;
- microneedling in Napa until the exact Napa inventory and landing-page map are confirmed;
- medication names or prescription-drug terms until certification and campaign intent are verified.

## Hard stop rules

Pause affected traffic and investigate immediately when any of the following occurs:

- billing failure, suspension warning, or an unknown enabled campaign/budget;
- campaign status, network, location option, final URL, or conversion role differs from this approved plan;
- booking-click credits cannot be reconciled to completed bookings, arrivals, and revenue;
- the wrong city, service, professional path, or booking inventory renders;
- a stale price, offer, schedule, membership term, or medical/outcome promise appears;
- patient, contact, provider, treatment, or health information reaches analytics or advertising systems;
- material spend accumulates on irrelevant search terms;
- missed calls, slow response, unavailable calendars, or unacceptable appointment lead time prevent the practice from serving demand;
- cost per arrived patient or weekly cash exposure breaches the owner-approved limit.

## Launch sequence

1. Verify the current Google Ads billing screen, payment method, suspension state, all enabled campaigns, daily budgets, networks, location settings, goals, and change history. Capture evidence.
2. Resolve the owner decision card, including the two medical-weight-loss campaigns and the HydraFacial hold.
3. Deploy the exact reviewed website commit to an approved hosted preview and complete the release run sheet.
4. Prove contact delivery, each exact booking route, and privacy-safe completed-booking measurement on that commit.
5. Confirm current service capacity, staffed phone coverage, public hours, offers, and allowable arrived-patient CPA.
6. Reconcile the machine-readable campaign plan with the current account; request a second-person review.
7. Obtain explicit written authorization naming campaigns, budgets, operator, start time, cash cap, and stop rules.
8. Activate only the authorized stage-one campaigns. Record the before/after state and review the first search terms, calls, booking completions, and spend the same business day.
9. Reconcile to arrivals and collected revenue weekly. Keep stage two and three paused until their specific gates are approved.

## Prepared validation record

- Recovery plan status: `PAUSED_PENDING_GATES`
- Campaigns: `6`, all paused in the plan
- Proposed stage-one daily total: `$82`
- Proposed planning ceiling: `$100/day`, not authorized
- Match types: exact and phrase only
- Networks: Google Search only
- Booking CTA role: secondary
- RSA validation: headline count/length, description count/length, and prohibited-claim checks enforced
- Account mutation: none
- Billing action: none
- Campaign activation: none

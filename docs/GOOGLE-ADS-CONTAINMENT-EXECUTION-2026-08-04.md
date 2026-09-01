# Google Ads containment execution — August 4, 2026

## Executive result

At approximately 5:30 AM PDT, Dr. Wagner authorized scaling Google Ads down because spend was not producing trustworthy conversions. Five nonbrand Search campaigns were paused. The account's enabled daily campaign budgets fell from **$207/day to $15/day**, a reduction of **$192/day (92.8%)**.

No payment, payment-method, bidding, keyword, ad, landing-page, or other account changes were made during the initial campaign-containment step. Dr. Wagner subsequently authorized the focused conversion-action corrections recorded below.

## Campaign changes

| Campaign ID | Campaign | Prior daily budget | Result |
|---|---|---:|---|
| `24028426046` | Rella \| Napa \| Botox-Dysport \| Search (Claude build) | $40 | Paused |
| `24023435748` | Rella \| Napa \| Laser-Pigmentation \| Search (Claude build) | $25 | Paused |
| `24028432208` | Rella \| Napa \| Filler \| Search (Claude build) | $12 | Paused |
| `21910161581` | Rella \| Napa \| Medical Weight Loss \| Search | $40 | Paused |
| `22574926787` | Rella \| Vacaville \| Medical Weight Loss \| Search | $75 | Paused |

## Verified enabled state

Immediately after the changes, a fresh account read returned only these enabled campaigns:

| Campaign ID | Campaign | Daily budget | Location mode |
|---|---|---:|---|
| `24028424075` | Rella \| Napa \| Brand \| Search (Claude build) | $5 | Presence |
| `21094335050` | Rella Aesthetics \| Vacaville \| Branded Campaign | $10 | Presence or interest |

The Vacaville brand campaign's `Presence or interest` location mode remains a known cleanup item. It was not changed in this containment step.

## Spend observed before containment

For August 4 through the morning read, Google Ads reported **$29.92 of spend, 6 clicks, and 0 conversions**. Of that, **$29.38** was in the nonbrand campaigns that were subsequently paused.

## Conversion-tracking findings

The conversion tag plumbing is only partially functional and is not a trustworthy appointment or revenue measurement system yet.

- The account contains roughly 40 conversion actions, including duplicate, removed, inactive, and no-recent-conversion actions.
- `Napa - Booking Click (Boulevard)` is **Active**, **Primary**, included in account-level goals, and counted as the sole primary `Book appointment` action used across all 27 campaigns.
- That action measures a click to Boulevard, not a confirmed appointment. For the Google Ads UI's selected July 2–29 window, it displayed 16 conversions and a total conversion value of **$7,200**, implying a configured value of **$450 per booking-button click**.
- `Napa - Appointment Booked` is an offline click import but is **Inactive**, **Secondary**, excluded from account-level goals, and has recorded **0** conversions.
- `Appointment Completed` is Primary but shows **No recent conversions** and **0** conversions.
- From August 1–4, the account recorded 3 `Napa - Booking Click (Boulevard)` events as primary conversions, while the booked and completed appointment actions recorded 0.

Conclusion: some click and call signals fire, but Google currently cannot prove how many ad-driven appointments were booked, arrived, or produced revenue. Nonbrand campaigns must not be scaled back up until the primary goal is a verified booked or arrived appointment and appointment-level reconciliation is operating.

## Billing finding

The signed-in Billing Summary showed:

- Balance: **$1,373.47**
- August net cost: **$479.65**
- Alert: **New form of payment required — current payment methods cannot be charged**
- Last payment: **$500 on July 24**

No payment or payment-method action was taken.

## Required recovery sequence

1. Keep nonbrand campaigns paused.
2. Remove booking-button clicks from primary bidding optimization and remove their artificial appointment value.
3. Establish one primary conversion for a verified booked appointment, with an arrived-patient/revenue reconciliation outside the ad platform.
4. Validate phone-call tracking and qualified-call duration.
5. Correct the Vacaville brand location setting to presence-only.
6. Resolve billing separately with explicit owner approval.
7. Relaunch one tightly controlled service/location test only after measurement is validated and an allowable cost per arrived patient is approved.

## Authorized conversion correction — approximately 5:57 AM PDT

Dr. Wagner explicitly authorized fixing the conversion setup. The following focused changes were made and verified in the signed-in Google Ads account:

| Conversion action | Prior state | Corrected state |
|---|---|---|
| `Napa - Booking Click (Boulevard)` (`7684358335`) | Primary `Book appointment`; $450 per click | **Secondary**; **no value** |
| `Napa - Appointment Booked` (`7692310986`) | Secondary; no value | **Primary** `Book appointment`; no value |
| `Napa - Qualified Call` (`7684358338`) | Primary 60-second call; $1 placeholder value | **Primary** 60-second call; **no value** |

The booked-appointment action uses `Import from clicks`. Google Ads showed **no upload history and no upload schedules**, so promoting the action establishes the truthful optimization hierarchy but does not activate the data feed. It will remain inactive until a privacy-approved process sends verified booked appointments with the required ad-click attribution. No patient data or test conversions were uploaded.

The two brand campaigns remained the only enabled campaigns after these conversion changes, with $15/day in total enabled budgets.

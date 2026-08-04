# Google Ads live read-only audit — 2026-08-04

## Executive finding

The live connected Google Ads reporting account showed seven enabled campaigns with `$207/day` in average daily budgets at approximately 02:22 PT on August 4, 2026. Google says most Search campaigns can spend up to twice the average daily budget on a day and 30.4 times the average daily budget in a month. That puts the observed configuration at up to `$414` on a high-serving day and approximately `$6,292.80` in a month. Source: [Google Ads spending limits](https://support.google.com/google-ads/answer/10486637).

From August 3 through the partial August 4 reporting window, the account reported `$182.07` in spend, `31` clicks, and one Google Ads conversion. That conversion was not a proven appointment: it was the `Napa - Booking Click (Boulevard)` action credited to the `Rella Aesthetics | Vacaville | Branded Campaign`.

No campaign, budget, keyword, negative, goal, conversion action, audience, ad, final URL, billing method, or payment was changed. The Google Ads billing interface still requires an interactive sign-in, so the prior `$893.82` warning cannot yet be marked resolved.

## Live enabled campaigns

| Campaign ID | Campaign | Status | Daily budget | Location option |
| --- | --- | --- | ---: | --- |
| `24028424075` | Rella \| Napa \| Brand \| Search (Claude build) | Enabled | `$5` | Presence |
| `24028426046` | Rella \| Napa \| Botox-Dysport \| Search (Claude build) | Enabled | `$40` | Presence |
| `24023435748` | Rella \| Napa \| Laser-Pigmentation \| Search (Claude build) | Enabled | `$25` | Presence |
| `24028432208` | Rella \| Napa \| Filler \| Search (Claude build) | Enabled | `$12` | Presence |
| `22574926787` | Rella \| Vacaville \| Medical Weight Loss \| Search | Enabled | `$75` | Presence |
| `21910161581` | Rella \| Napa \| Medical Weight Loss \| Search | Enabled | `$40` | Presence |
| `21094335050` | Rella Aesthetics \| Vacaville \| Branded Campaign | Enabled | `$10` | Presence or interest |

Observed total: `$207/day`.

The separate `[POLICY HOLD] Rella | Vacaville | Medical Weight Loss | Search` campaign was paused at `$50/day`. Napa HydraFacial was paused at `$5/day`, not the `$10/day` in the older imported snapshot. Napa hyperhidrosis was paused at `$8/day`.

## Live performance slice

Reporting window: August 3 through partial August 4, account currency USD.

| Campaign | Spend | Clicks | Google Ads conversions |
| --- | ---: | ---: | ---: |
| Vacaville medical weight loss | `$69.37` | 2 | 0 |
| Napa medical weight loss | `$41.13` | 7 | 0 |
| Napa laser/pigmentation | `$29.14` | 5 | 0 |
| Napa filler | `$19.58` | 3 | 0 |
| Napa Botox/Dysport | `$10.59` | 2 | 0 |
| Napa brand | `$6.74` | 4 | 0 |
| Vacaville brand | `$5.52` | 8 | 1 |
| **Total** | **`$182.07`** | **31** | **1** |

The one conversion was named `Napa - Booking Click (Boulevard)` and was credited to the Vacaville brand campaign. Google Ads placed it in the `Conversions` column as well as `All conversions`. It is a location-mismatched click signal, not proof of a completed appointment, arrival, or revenue.

## Control failures observed

### 1. Conversion location mismatch

The only reported conversion in the live slice was a Napa booking-click action credited to a Vacaville campaign. Until campaign goals and event routing are corrected and tested, the account cannot safely optimize from Google's conversion column.

### 2. Blank tracking suffix

Every spending ad row returned a blank Final URL suffix. The service ads used the expected public paths and the weight-loss ads used their existing city pages, but there is no consistent campaign/ad-group/keyword/creative/device suffix for reconciliation.

### 3. Broad-match weight-loss spend

The Napa medical-weight-loss campaign spent on enabled broad-match keywords, including `weight loss clinic near me` and `semaglutide weight loss clinic`. Visible matched terms included:

- `how many calories should i eat` — `$8.29`;
- `maintenance calories` — `$6.07`;
- `apple cider vinegar baking soda and lemon juice weight loss` — `$2.93`;
- `best supplement drink for weight loss` — `$0.58`.

Those four terms alone consumed `$17.87`, or about 43% of the Napa medical-weight-loss campaign's `$41.13` spend in the reporting slice, with zero Google Ads conversions.

### 4. Restricted drug keyword requires certification verification

The Vacaville medical-weight-loss campaign spent `$46.17` for one click from the enabled phrase keyword and matched term `tirzepatide near me`, with zero conversions. Google permits restricted drug terms in United States ad copy and landing pages subject to policy, but targeting restricted drug terms as keywords requires certification. Verify the account's certification before this keyword or its campaign serves again. Source: [Google restricted drug terms policy](https://support.google.com/adspolicy/answer/15595717).

### 5. Location option mismatch

The Vacaville brand campaign used `Presence or interest`, while the recovery standard requires presence-only targeting. Google's default can include people who show interest in a location without being there. Source: [Google Ads location options](https://support.google.com/google-ads/answer/9376662).

### 6. Billing remains unverified

The connected reporting source proves the account is producing data, but it does not expose the billing balance or suspension banner. A prior email and imported account record showed `$893.82` past due on August 3. The billing page requires interactive Google sign-in and has been left open for Dr. Wagner. Do not infer that current serving means the balance is resolved.

## Recommended immediate containment

Pending explicit owner authorization, the safest loss-control decision is:

1. Pause the five enabled nonbrand campaigns—Napa Botox/Dysport, Napa laser/pigmentation, Napa filler, Napa medical weight loss, and Vacaville medical weight loss—reducing enabled average daily budgets from `$207` to the two brand campaigns' combined `$15`.
2. Keep the two brand campaigns only as a short defensive bridge, subject to correcting the Vacaville location option and removing the Napa booking-click action from bidding.
3. Verify and resolve billing in the Google Ads interface.
4. Correct conversion roles and location routing; prove a completed booking without patient or health data; add the approved URL suffix.
5. Verify restricted-drug-term certification, remove broad match, add reviewed negatives, and confirm program facts and capacity before considering medical-weight-loss reactivation.
6. Reopen only the explicitly approved stage-one campaigns after the hosted website and arrived-patient economics gates pass.

This is a recommendation, not authorization to mutate the account.

## Read-only sources and limits

- Account: Google Ads `686-891-8996`, Rella Aesthetics.
- Source: connected Google Ads reporting connector.
- Queries: campaign status/budget/type/location option; August 3–4 campaign, ad, keyword, search-term, conversion-type, and currency reports; conversion resource list.
- Billing limitation: interactive Google sign-in required.
- Privacy: no patient record, booking record, contact field, audience list, or offline conversion was accessed.
- Account mutation: none.

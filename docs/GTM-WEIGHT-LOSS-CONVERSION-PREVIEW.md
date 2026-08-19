# GTM Preview: Napa weight-loss confirmed booking → AW-6868918996

Use this runbook in **GTM Preview** before publishing. Legacy tags on
`AW-11321678537` stay **active** until the new conversion is verified in Google
Ads.

## Prerequisites

1. Conversion snippet from Google Ads account **AW-6868918996**  
   Goals → Conversions → **Book Appointment - Form Submit - New** → Tag setup  
   Copy `AW-6868918996/<CONVERSION_LABEL>`.
2. Booking app deployed with:
   - `NEXT_PUBLIC_WEIGHT_LOSS_GTM_ID=GTM-N4R7NHBJ`
   - `WeightLossBookingGtm` + `WeightLossBookingConversionTracker` mounted when
     checkout returns `CONFIRMED`.
3. Do **not** submit real patient information during testing.

## Container

`GTM-N4R7NHBJ` (rellaweightloss.com + book.rellaweightloss.com)

## Step 1 — Add NEW Google tag (do not edit legacy AW tag)

| Field | Value |
|---|---|
| Tag type | Google tag |
| Tag ID | `AW-6868918996` |
| Trigger | All Pages |

Leave existing **Google tag `AW-11321678537`** unchanged.

## Step 2 — Update Conversion Linker (existing tag)

Edit the active **Conversion Linker** tag:

| Setting | Value |
|---|---|
| Enable cross-domain linking | **On** |
| Auto-link domains | `rellaweightloss.com`, `book.rellaweightloss.com`, `weightloss.experiencerella.com` |
| Decorate forms | On (if available) |

Do not disable the linker or legacy tags.

## Step 3 — Add NEW Google Ads conversion tag

| Field | Value |
|---|---|
| Tag type | Google Ads Conversion Tracking |
| Conversion ID | `6868918996` |
| Conversion label | `<CONVERSION_LABEL from Google Ads>` |
| Conversion linker | On |
| Trigger | Custom Event (see Step 4) |

Do **not** repoint existing conversion tags (`BB0RCPP…`, `ybYeCJum…`, phone
`dHIFCPyr…` on `11321678537`).

## Step 4 — Create trigger (confirmed booking, Napa only)

**Trigger type:** Custom Event

| Field | Value |
|---|---|
| Event name | `weight_loss_booking_confirmed` |
| Fire on | All Custom Events |

**Trigger conditions (AND):**

| Variable | Operator | Value |
|---|---|---|
| `location` (Data Layer Variable) | equals | `napa` |
| `booking_confirmed` (DLV) | equals | `true` |

Create DLVs if missing:

- `location` → Data Layer Variable → `location`
- `booking_confirmed` → Data Layer Variable → `booking_confirmed`

## Step 5 — Duplicate-fire guard (GTM side)

In the new conversion tag → **Advanced Settings → Tag firing options**:

- **Once per event** (default)

The booking app also sets `sessionStorage.rella_wl_booking_conv_fired` so React
re-renders of the “done” step do not double-push.

## Step 6 — Preview test flow

1. Open GTM → **Preview** → connect `rellaweightloss.com`.
2. In Preview, append a test `gclid` to the landing URL (e.g.
   `?gclid=test-preview-001`).
3. Click **See Napa Call Times** → land on
   `book.rellaweightloss.com/book/napa/weight-loss-consult`.
4. Confirm Preview shows **Conversion Linker** on both domains.
5. Walk the scheduler UI **without entering real patient data**.
6. When confirmation fires, verify Preview shows exactly **one**
   `weight_loss_booking_confirmed` event with sterile payload (`location`,
   `service`, `booking_confirmed` only).
7. Confirm the **new** AW-6868918996 conversion tag fires **once**.
8. Confirm **legacy** AW-11321678537 tags behave as before (still active).

## Step 7 — After Preview passes (requires explicit “publish”)

1. User says **“publish”**.
2. Publish GTM container version with note:  
   `Add AW-6868918996 Napa confirmed booking conversion; legacy tags retained.`
3. In Google Ads → Conversions:
   - Set **Book Appointment - Form Submit - New** (`AW-6868918996`) as **Primary**
     after it records a test conversion.
   - Move legacy click/form/call actions on `AW-11321678537` to **Secondary**
     only after validation.

## gclid handoff checklist

The booking app already:

1. Reads approved click IDs from the landing URL.
2. Sends them to `/api/booking-v2/cart` before checkout.
3. Strips them from the address bar via `replaceState` **after** capture.

Marketing-site links must continue using `withWeightLossAttribution()` so
`gclid` reaches the booking URL. Conversion Linker on both domains covers
cookie-based linking when URL params are stripped.

## Current vs proposed (pre-publish)

| | Current | Proposed |
|---|---|---|
| **Trigger** | Legacy: init/click/form/thank-you (marketing site only) | `weight_loss_booking_confirmed` + `location = napa` |
| **Destination** | `AW-11321678537` | **New tag:** `AW-6868918996/<label>` |
| **Confirmation domain** | Not tracked (booking subdomain has no GTM) | `book.rellaweightloss.com` with shared GTM + dataLayer push |
| **Legacy tags** | Active | **Remain active** until new conversion records |

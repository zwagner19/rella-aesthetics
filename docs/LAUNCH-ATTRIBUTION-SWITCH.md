# Launch-day attribution switch

The new site removes the Boulevard booking widget. Boulevard's own Google
Analytics tracker fires the `cart_completed` event, which Google Ads imports
today as a Primary conversion (GA4 action 7728361891). That signal stops the
moment experiencerella.com points to this site. Booking conversions then come
only from the first-party upload chain:

ad click → consent panel on an ad landing page (`Allow`) → booking app →
Rella HQ uploader → Google Ads action for that clinic.

## Ad landing pages (consent panel + no third-party trackers)

| Clinic | Pages |
|---|---|
| Napa | /napa/botox, /locations/napa, /napa/facials, /napa/filler, /napa/hydrafacial, /napa/hyperhidrosis, /napa/laser |
| Vacaville | /locations/vacaville, /vacaville/botox, /vacaville/chemical-peels, /vacaville/facials, /vacaville/filler, /vacaville/hydrafacial, /vacaville/laser, /vacaville/microneedling |

The source of truth is `AESTHETICS_AD_LANDING_PAGES` in
`src/lib/aesthetics-attribution.ts`. The homepage is not an ad landing page.

## Google Ads actions (account 686-891-8996)

| Action | ID | Today | At launch |
|---|---|---|---|
| Napa - Appointment Booked | 7692310986 | Primary | Stays Primary |
| Vacaville - Appointment Booked | 7831432700 | Secondary | Make Primary |
| GA4 cart_completed import | 7728361891 | Primary | Make Secondary, then remove after 30 days |

## Launch-day order (same day as the DNS switch)

1. Before DNS: confirm the Napa ads land on approved pages. /napa/
   redirects to /locations/napa, which is approved.
2. DNS switch.
3. Right after DNS:
   - Change the Vacaville Branded ad (campaign 21094335050) final URL from
     `https://experiencerella.com` to
     `https://experiencerella.com/locations/vacaville`. Do this after DNS,
     because WordPress still redirects /locations/vacaville/ to the homepage.
   - Update the Napa Brand ad final URL from /napa/ to /locations/napa, to
     skip the redirect.
4. Same day: in Google Ads → Goals → Conversions:
   - Set "Vacaville - Appointment Booked" to Primary.
   - Set the GA4 `cart_completed` import to Secondary, so it stops driving
     bidding (it no longer receives data).
5. Within 24 hours: book once from a test ad link on each clinic's landing
   page (test client, then cancel). Check in order: consented attribution row,
   booking outcome, upload job, and the conversion showing on that clinic's
   action within 1–3 days.
6. Week 1: review the opt-in rate and the conversions by clinic. Expect lower
   conversion counts than the old GA4 import, because only visitors who tap
   `Allow` can be counted.

## Rollback

Point DNS back to WP Engine (keep it for 30 days). Then set the GA4
`cart_completed` import back to Primary and "Vacaville - Appointment Booked"
back to Secondary.

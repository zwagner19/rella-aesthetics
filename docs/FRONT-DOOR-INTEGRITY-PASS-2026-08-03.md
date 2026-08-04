# Rella front-door integrity pass — 2026-08-03

## Outcome

This pass removes the remaining public-homepage overclaims and dead ends, aligns the navigation and membership language to the approved 2026 plan, and verifies the primary contact facts against Rella's current public site and transferred operating archive.

No deployment, environment change, ad change, DNS change, push, merge, or public cutover was performed.

## Homepage conversion changes

- Replaced the generic `Care Built Around You` first-screen headline with `Physician-Owned Aesthetic Care` and explicit Vacaville/Napa context.
- Tightened the trust strip to factual, defensible statements: physician ownership, two local clinics, clear guidance, and personalized plans.
- Added a premium physician-owner module with the authentic Dr. Wagner portrait, full name, DO credential, ABOM diplomate wording, and a direct About-page path.
- Removed the unsupported blanket claim that every aesthetic treatment is physician-supervised.
- Removed `artist's eye` and guaranteed/natural-lasting-results language from broad practice copy.
- Reframed the location section around clinic details, directions, and booking paths.
- Changed header and footer navigation from broad `VIP Membership` language to the accurate `Tox Membership` label.

## Membership accuracy

The homepage banner no longer advertises complimentary treatments, wellness perks, or undefined benefits.

It now states only the approved 2026 public facts:

- $30/month;
- one-year commitment;
- Botox at $13/unit for members;
- Dysport at $4.40/unit for members;
- complete terms should be reviewed before enrollment.

The membership page title and H1 now say `2026 Tox Membership`.

## Education dead end removed

When Sanity was not configured or returned no posts, the prior `/blog` page displayed three placeholder articles with dates and links to articles that did not exist.

The fallback now explains that the education library is growing and routes visitors to three real, verified guides:

- Botox & Dysport;
- medical weight management;
- HydraFacial.

No placeholder date, fake article, or broken blog slug remains.

## Contact and trust corrections

- Replaced unverified `hello@experiencerella.com` references with the current public inbox `info@experiencerella.com` across Contact, fallback messaging, Privacy, Terms, Sanity seed data, tests, and the launch gate.
- Added a message-field warning not to include sensitive medical information and not to use the form for urgent or emergency care.
- Confirmed the public phone, Vacaville address, Napa address, weekday hours, and Saturday hours against Rella's live contact page.
- Restored three homepage Google-review quotations to the exact archived public wording. The previous implementation had silently paraphrased quoted reviews and removed portions of them.
- Removed remaining blanket `physician-led` aesthetic language from filler metadata, Botox acquisition copy, and the site footer; physician-led wording remains where it is specifically verified for medical weight management.

## Verification

- 217 automated tests passed across 15 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Final Next.js 16.2.12 production build generated all 27 routes.
- Sitemap regenerated successfully.
- Desktop homepage first-screen review passed.
- Mobile homepage first-screen review passed at 390 × 844 with no horizontal overflow and an operable quick-action bar.
- Desktop full-page education fallback review passed; all three cards point to real service guides.
- Mobile Contact DOM and recovery review confirmed `info@experiencerella.com`, no `hello@` reference, the sensitive-information warning, and failure rather than success when CRM configuration is absent.

## Source basis

- Current Rella contact page: <https://experiencerella.com/contact/>
- Current Rella team page: <https://experiencerella.com/our-team/>
- Archived public testimonial source: `Marketing/Google Ads/Napa Campaign/backups/experiencerella-2026-07-13/pages-any.json`
- Binding public pricing canon: `reference/RELLA-PUBLIC-PRICING-CANON-2026-07-24.md`

## Next operational gate

The remaining unblocked action is a preview deployment plus the production-like CRM and Boulevard smoke tests defined in `docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md`. Paid traffic should remain off until those checks pass.

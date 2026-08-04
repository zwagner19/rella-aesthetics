# Rendered booking-destination audit — 2026-08-03

## Outcome

The old business-level Boulevard widget URL is not a safe booking destination. It returns HTTP 200 but renders Boulevard's `#/not-found` screen with “things have moved.” Rella's generic booking actions now open a first-party `/book` clinic chooser, and the Napa/Vacaville choices use location-pinned Boulevard menu routes that include `path=/cart/menu`.

That URL shape matches [Boulevard's published full-screen instructions for multi-location businesses](https://support.boulevard.io/en/articles/7993280-installing-the-self-booking-overlay-square). Boulevard also instructs businesses to copy item/category links from each location's Sharing Options and verify that the item is sold and bookable at that location; see [Self-Booking: Link to Specific Items or Categories](https://support.boulevard.io/en/articles/5941527-self-booking-link-to-specific-items-or-categories).

The attempted Vacaville `Peels` category deep link failed the same rendered-UI test and was not shipped. Chemical-peel CTAs deliberately keep the working Vacaville menu fallback.

## Browser-rendered checks

Checked against the live Boulevard booking application in the in-app browser on August 3, 2026.

| Source intent | Rendered result | Decision |
| --- | --- | --- |
| Legacy business widget with no `path` | `#/not-found`; “things have moved” | Removed from public CTAs |
| Vacaville `/cart/menu/Peels` deep link | `#/not-found`; “things have moved” | Rejected; not shipped |
| Location-pinned Napa `/cart/menu` | Live `Menu` screen | Used for generic Napa booking; repeat with a clean and returning browser at launch |
| Location-pinned Vacaville `/cart/menu` | Live `Menu` screen | Used for generic Vacaville booking; repeat with a clean and returning browser at launch |
| `/vacaville/chemical-peels` → Vacaville menu → visible `Peels` category | `Peels` rendered MicroPeel Sensitive, MicroPeel Plus 20, TCA Peel, and Universal Peel | Kept as a two-step handoff; the externally loaded category shortcut remains rejected |
| Vacaville Initial Laser Consult | Heading `Initial Laser Consult`; `Select a professional` | Kept; removes a menu step while honoring the live IPL consult requirement |
| Vacaville Signature HydraFacial | Heading `Signature Hydrafacial`; `Select a professional` | Kept; removes a menu step while preserving the Signature starting tier |
| `/vacaville/facials` → Vacaville Initial Skin Health Consult | Heading `Initial Skin Health Consult`; `Select a professional` | Kept; begins with assessment and planning instead of guessing a facial |
| Vacaville Initial Microneedling Consult | Heading `Initial Microneedling Consult`; `Select a professional` | Kept; starts before modality selection. Owner should remove stray `right but` text from Boulevard's service description |
| Napa Signature HydraFacial service | Heading `Signature Hydrafacial`; `Select a professional` | Kept |
| Napa dermal-filler service | Heading `Dermal Fillers`; `Select a professional` | Kept |
| Napa Laser category | Live `Laser` menu | Kept |
| Napa hyperhidrosis consult-first route | Heading `New Patient Consult`; `Select a professional` | Kept |

The separate Napa Botox and medical-weight-loss booking applications were already verified in their dedicated route audits and remain outside Boulevard's migrated widget handoff.

Boulevard retains active booking/cart state in a returning browser. During the audit, a menu-only handoff could display the previously active clinic's inventory after a service-specific journey. This is a vendor-state behavior that repository tests cannot prove away. The site uses Boulevard's official multi-location URL shape, but production validation must cover both a clean browser and a browser that first began a journey at the other clinic.

## Guardrails added

- Location-level Boulevard links must carry a `path` parameter.
- Route tests require both clinic menus to use `/cart/menu`.
- A regression test pins Vacaville chemical peels to the clinic menu and forbids the broken `Peels` deep link.
- The dedicated Vacaville chemical-peel page requires all three booking actions and its mobile bar to use that same clinic-menu fallback.
- A regression test pins explicit Vacaville laser intent to the rendered Initial Laser Consult and forbids Napa or generic routing.
- A regression test pins explicit Vacaville HydraFacial intent to the rendered Signature service and forbids Napa or generic routing.
- A regression test pins explicit Vacaville facial intent to the rendered Initial Skin Health Consult and forbids Napa or generic routing.
- A regression test pins explicit Vacaville microneedling intent to the rendered Initial Microneedling Consult and forbids Napa or generic routing.
- The external link checker now fails any rendered public Boulevard URL that omits `path`.
- The link checker states its limit explicitly: redirect/HTTP success does not prove that the client-rendered booking screen works.
- The production launch gate requires a real-browser check of every distinct external booking destination on the exact deployment.

## Production gate

Before paid traffic or cutover, open both `/book` clinic actions in a clean browser session and confirm the intended clinic inventory. Repeat after starting (but not completing) a booking journey at the other clinic. Then repeat every distinct external booking URL and fail the launch if Boulevard renders `#/not-found`, “things have moved,” the wrong clinic, or no selectable next step.

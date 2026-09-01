# Vacaville injectable booking-friction pass — 2026-08-03

## Outcome

The dedicated Vacaville Botox and filler pages now send ready visitors directly to the exact verified services instead of dropping them at Boulevard's broad clinic menu.

| Page | Previous handoff | Current verified handoff |
| --- | --- | --- |
| `/vacaville/botox` | Vacaville `/cart/menu` | `New Patient Tox` → `Select a professional` |
| `/vacaville/filler` | Vacaville `/cart/menu` | `Dermal Fillers` → `Select a professional` |

The change removes one high-intent menu-selection step, retains the intended Vacaville clinic, and gives the page CTA the same service name visitors see after the handoff.

## Verified destination contract

- Boulevard business: `a12f397a-6db3-4b18-bc34-01f02dfb7216`
- Vacaville location: `0f146f87-364e-4dfd-b938-61ba49528820`
- New Patient Tox service: `s_2fee10b1-1831-4c00-83e9-9c05a7071b15`
- Dermal Fillers service: `s_e3564b2f-c00d-47c2-8ca0-665b6d6f25e4`

Each destination was rendered in a real browser without selecting a professional, treatment area, add-on, appointment, or form field. The tox route displayed `New Patient Tox`; the filler route displayed `Dermal Fillers`; both displayed `Select a professional` and remained at the Vacaville location.

Typed resolver aliases now keep Botox, tox, new-patient-tox, new-patient-botox, dermal-fillers, and filler intent on the corresponding verified service. Page and conversion tests pin both service IDs and the Vacaville location ID.

## Page and measurement changes

- Every `/vacaville/botox` booking action says `Book New Patient Tox`.
- Every `/vacaville/filler` booking action says `Book Dermal Fillers`.
- The mobile conversion bar uses the same service-specific label and destination as its page.
- FAQ and handoff copy explain the exact next screen without promising availability, a price total, or a completed appointment.
- Booking clicks remain intent signals. They contain no form contents, identity, health information, treatment areas, or patient data.

## Vendor cleanup required before traffic

Both live injectable service screens contain a Boulevard-side ProNox price conflict:

- the service description says the add-on may be added at checkout for `$50`;
- the selectable add-on displays `+$60.00`.

The website repeats neither amount. Before paid traffic, the owner must correct the conflicting Boulevard content or deliberately approve the intended price, then repeat both rendered-browser checks. This is a booking-system content issue, not a repository routing failure.

The live filler description also uses broader price and treatment-area language than the approved website canon. The website continues to use the reviewed `$840` base, `$540–$960` active-product range, and conservative individualized-assessment copy; vendor text was not imported into public page claims.

## Verification

- 342 automated checks passed across 31 test files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 47 routes.
- Legacy crawl passed with 31 moved routes and 2 preserved public records.
- Internal crawl passed across 36 pages and 46 unique destinations.
- Booking crawl passed across 36 pages and 18 unique external destinations.
- SEO crawl passed across 36 pages, 13 social images, and 54 JSON-LD blocks.
- Mobile QA passed at 390 × 844 on both pages with clean CTA labels and no layout failure.
- Real preview clicks reached `New Patient Tox` and `Dermal Fillers`, each with `Select a professional`.

## Production gate

On the exact deployment commit, repeat each click in both a clean browser and a returning browser that previously began a Napa journey. Fail the launch if either route shows the wrong clinic, the wrong service, `#/not-found`, “things have moved,” an empty shell, or no selectable professional. Resolve or explicitly approve the ProNox price conflict before sending paid traffic.

No deployment, push, merge, appointment selection, form submission, ad/account change, billing action, campaign mutation, or public cutover was performed in this pass.

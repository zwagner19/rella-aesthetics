# Boulevard admin cleanup packet — 2026-08-03

## Purpose

The website's outbound routing is working. These are the remaining booking-system content and state issues that should be corrected or deliberately accepted before the related traffic is promoted.

Complete changes in Boulevard Admin using an authorized owner account. Do not use patient information during validation. After each correction, repeat the clean-browser and returning-browser checks on the exact hosted preview.

## P0 — resolve before paid traffic

### 1. ProNox price conflict on Vacaville injectable services

Observed on both the live `New Patient Tox` and `Dermal Fillers` screens:

- service description: add ProNox at checkout for `$50`;
- selectable add-on: `+$60.00`.

Required action:

- [ ] Decide the authoritative current price.
- [ ] Make the description and selectable add-on agree.
- [ ] Confirm whether the same add-on appears on any other injectable services and correct them consistently.
- [ ] Reopen `/vacaville/botox` and `/vacaville/filler`; confirm the corrected amount before selecting anything.

Website handling: the public pages promise neither ProNox amount, so no website price change is required unless the owner deliberately wants one published from a new approved canon.

### 2. IV service-name and description review

Both Napa and Vacaville `IV Hydration` categories currently display:

- Myers' Cocktail
- Hangover Cure
- Immunity Blend
- Beauty/Glow Blend
- Migraine/Pain Relief
- NAD + Therapy

Required action:

- [ ] Dr. Wagner reviews every current name and description for clinical accuracy and advertising/compliance risk.
- [ ] Rename, rewrite, deactivate, or deliberately approve each item.
- [ ] Confirm the intended provider, clinic, duration, price, contraindication/screening workflow, and availability for each active item.
- [ ] Keep paid IV promotion off until this review is complete.

Website handling: the public IV page remains screening-led and does not repeat `Hangover Cure`, `Immunity Blend`, or `Migraine/Pain Relief`.

## P1 — correct before public cutover

### 3. Microneedling description typo

The live Vacaville `Initial Microneedling Consult` description contains stray text: `right but`.

Required action:

- [ ] Remove the stray words and proofread the complete service description.
- [ ] Reopen `/vacaville/microneedling` and confirm `Initial Microneedling Consult` plus `Select a professional` still render.

Service ID: `s_762959b6-0015-4904-be74-78d563b5651a`

### 4. Chemical-peel category shortcut failure

The location-pinned Vacaville clinic menu works and visibly exposes the `Peels` category. The externally loaded `/cart/menu/Peels` shortcut rendered Boulevard's not-found screen and is not used by the website.

Required action:

- [ ] Leave the website's working two-step menu handoff in place for launch.
- [ ] If a one-step category link is desired, copy the official category link from Boulevard Sharing Options and test it in a clean browser before asking for a website change.
- [ ] Do not substitute a guessed slug or the previously rejected URL.

### 5. Multi-location returning-browser state

Boulevard can retain cart or clinic state in a returning browser. A valid location-pinned source URL can therefore require more than an HTTP test.

Required action for every release:

- [ ] Open Napa from a clean browser and confirm Napa inventory.
- [ ] Open Vacaville from a clean browser and confirm Vacaville inventory.
- [ ] Begin—but do not complete—a Napa journey, then open a Vacaville action and confirm the clinic switches correctly.
- [ ] Repeat in the opposite direction.
- [ ] Fail the release for the wrong clinic, wrong service, empty shell, `#/not-found`, “things have moved,” or no selectable next step.

## P2 — operating reconciliation

- [ ] Confirm active provider assignments and bookable days for every destination published by the website.
- [ ] Confirm Napa and Vacaville hours match the approved public schedules.
- [ ] Confirm prices and deposit/add-on terms match the current written public canon or record an approved replacement source.
- [ ] Confirm HydraFacial/facial calendar lead time before scaling demand around a single-provider constraint.
- [ ] Confirm Napa microneedling remains absent until provider/device/service/capacity evidence exists.
- [ ] Confirm each inactive, archive, event, or internal service is excluded from public self-booking.

## Validation record

| Item | Corrected by | Date | Clean browser | Returning browser | Evidence/notes |
| --- | --- | --- | --- | --- | --- |
| ProNox pricing |  |  | [ ] | [ ] |  |
| IV names/descriptions |  |  | [ ] | [ ] |  |
| Microneedling typo |  |  | [ ] | [ ] |  |
| Chemical-peel handoff |  |  | [ ] | [ ] |  |
| Multi-location state |  |  | [ ] | [ ] |  |

No Boulevard setting or service content was changed during the website implementation or this audit.

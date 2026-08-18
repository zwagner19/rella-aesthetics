# Rella Aesthetics — Design Audit (Pass 0)

**Branch:** `cursor/design-audit-pass`  
**Date:** 2026-08-17  
**Figma reference:** Not provided in handoff (placeholder URL only). Audit uses repository implementation + stated brand rules as source of truth.

## Baseline health check

| Check | Result |
|-------|--------|
| `npm run lint` | Pass (1 warning: unused `projectId` in `blog/page.tsx`) |
| `npm test` | Pass — 195 tests |
| `npx tsc --noEmit` | Pass |
| `npm run build` | Pass — 27 routes generated |

## Route map notes

| Requested route | Actual route | Notes |
|-----------------|--------------|-------|
| `/` | `/` | Standard marketing homepage |
| `/about` | `/about` | Team content lives here; no separate team page |
| `/team` | **Missing** | "Meet Our Team" CTA links to `/about` |
| `/book` | `/booking` → external Boulevard widget | Quarantined redirect; no embedded wizard |
| `/services`, `/membership`, `/gallery`, `/blog`, `/contact` | Present | All in `(site)` route group |

## Brand system vs implementation

### Approved palette (target)

- Rose `#F7A19A`, Ink `#1A1A1A`, Silver `#83888D` (captions/large display only), White paper backgrounds
- Poppins, no gradients, no card shadows, square image edges (pill buttons only)
- Rose buttons use Ink labels when contrast requires

### Current drift

| Issue | Where | Severity |
|-------|-------|----------|
| Legacy `--color-rose-dark`, `--color-rose-light`, `--color-rose-blush` used widely | `globals.css`, pages, booking UI | Medium — blush reads as alternate paper tone; dark/light rose used for hovers |
| Clay `#b04a40` | Napa campaign `napa-botox.css` only (intentional campaign shell) | Low on marketing site; campaign is separate |
| Card shadows + hover lift | `ServiceCard`, `BlogCard` | High — violates no-shadow rule |
| Rounded card/image corners (`rounded-lg`, larger radii) | Cards, gallery, about placeholder, blog, weight-loss funnel | High |
| Gradients + decorative shadows | `WeightLossServicePage.tsx` | High on weight-loss host/funnel |
| Eyebrows: bold all-caps, not italic Title Case | All page heroes, `SectionHeader`, `Hero` | High |
| Display H1s use rose color; section H2s use silver-dark | Consistent pattern but differs from Figma intent (unverified) | Medium |
| White text on rose CTAs | Header, buttons — contrast ~2.8:1 (may fail AA for small text) | High — Ink labels needed per brand rules |
| `rella-brand.mdc` referenced in cursor rules | **Missing from repo** | Process gap |

## Component-level findings

### Header / mobile nav

- Sticky header (`z-50`) — works; no scroll-padding on anchor targets
- Hamburger control ~32×32px effective hit area (`p-2` + 24px bars) — **under 44px**
- Mobile menu: scroll lock ✓, Escape close ✓, **no focus trap**, **no focus return**, `aria-modal` missing
- No active nav state for current route

### Sticky conversion / chat

- Marketing site: no mobile sticky book bar (CTA only in header + page sections)
- GHL chat widget loads when env var set — may overlap footer CTAs on mobile (env-dependent)
- Weight-loss funnel: fixed bottom CTA bar (`lg:hidden`) — separate styling system

### Typography

- Eyebrows: `font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver` — should be **italic Title Case** with tracking
- Hero H1s: tracked uppercase rose — aligns with "all-caps display text"
- Section titles: sentence/title case, medium weight — reasonable for subheads
- Body: generally sentence case ✓

### Images

- Service cards: uniform `aspect-[4/3] object-cover`, no per-image `object-position`
- About / location pages: grey placeholders with rounded corners
- Gallery: placeholder tiles only (referenced JPG paths do not exist in `public/`)
- Hero: no background image on homepage (Figma may show photography — unverified)

### Booking handoff

- All public CTAs use `resolveBookingHref()` — routing safe ✓
- `/booking` redirects to Boulevard widget — behavior preserved ✓
- Embedded wizard styles (`booking-styles.ts`) use rounded-xl, shadow-sm — visual mismatch with marketing site

### Popup / motion

- **No Rella Reveal popup** implemented
- Service cards use hover scale/translate — should be restrained; respect `prefers-reduced-motion`

## Visual QA checklist (pre-fix)

Legend: ✅ Pass · ⚠️ Partial · ❌ Fail · N/A

### Mobile 390×844

| Route | Overflow | Tap targets | Mobile menu | Sticky overlap | Typography | Images |
|-------|----------|-------------|-------------|----------------|------------|--------|
| `/` | ✅ | ⚠️ hamburger | ⚠️ no focus trap | ✅ | ❌ eyebrows | ⚠️ rounded cards |
| `/about` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ❌ placeholder rounded |
| `/services` | ✅ | ⚠️ learn-more in card | ⚠️ | ✅ | ❌ | ⚠️ uniform crop |
| `/services/botox` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | N/A |
| `/membership` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | N/A |
| `/gallery` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ❌ placeholders |
| `/blog` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | ⚠️ card shadows |
| `/contact` | ✅ | ⚠️ | ⚠️ | ✅ | ❌ | N/A |
| `/booking` | N/A redirect | N/A | N/A | N/A | N/A | N/A |

### Desktop 1440×1000

| Route | Overflow | Nav/CTA | Typography | Brand colors | Shadows/gradients |
|-------|----------|---------|------------|--------------|-------------------|
| `/` | ✅ | ✅ | ❌ | ⚠️ rose-dark hovers | ❌ card shadows |
| `/about` | ✅ | ✅ | ❌ | ⚠️ | ❌ rounded placeholder |
| `/services` | ✅ | ✅ | ❌ | ⚠️ | ❌ card shadows |
| `/services/botox` | ✅ | ✅ | ❌ | ⚠️ | ✅ |
| `/membership` | ✅ | ✅ | ❌ | ⚠️ | ⚠️ tier cards rounded |
| `/gallery` | ✅ | ✅ | ❌ | ⚠️ | ❌ |
| `/blog` | ✅ | ✅ | ❌ | ⚠️ | ❌ |
| `/contact` | ✅ | ✅ | ❌ | ⚠️ | ⚠️ form radii |
| `/booking` | N/A | N/A | N/A | N/A | N/A |

## Priority fix order (implementation passes)

1. **Pass 1 — Mobile layout:** overflow guard, 44px targets, accessible mobile menu, scroll-padding, chat safe-area
2. **Pass 2 — Images:** per-service object-position, square crops, asset regression tests
3. **Pass 3 — Branding:** eyebrow utility, remove shadows/rounded cards, Ink-on-rose buttons, booking visual alignment
4. **Pass 4 — Popup & motion:** Rella Reveal dialog on marketing pages only, reduced-motion, session cap

## Owner decisions required

1. **Figma file URL** — needed to verify spacing, photography, and hero art direction
2. **`/team` route** — create dedicated page or confirm `/about` is canonical
3. **Gallery photography** — real before/after assets and consent; placeholders cannot ship
4. **About / location hero images** — photography assets for placeholders
5. **Homepage hero photography** — Figma likely shows image; confirm asset + crop
6. **Weight-loss funnel restyle** — separate visual system; scope for brand pass?
7. **Napa campaign (`/napa/botox`)** — clay palette is intentional B01 shell; rebrand or keep isolated?
8. **`rella-brand.mdc`** — add to repo as canonical handoff doc?
9. **Rose CTA contrast** — confirm Ink labels on all rose buttons vs exceptions for large display CTAs only
10. **Reveal popup offer copy** — consult-focused headline, CRM field mapping, legal/privacy review

---

## Post-implementation QA (Passes 1–4)

Legend: ✅ Pass · ⚠️ Partial · ❌ Fail · N/A

### Mobile 390×844 (after fixes)

| Route | Overflow | Tap targets | Mobile menu | Sticky overlap | Typography | Images |
|-------|----------|-------------|-------------|----------------|------------|--------|
| `/` | ✅ | ✅ min-h-11 controls | ✅ trap + Escape | ✅ | ✅ eyebrows/display | ✅ square + crops |
| `/about` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ square placeholder |
| `/services` | ✅ | ✅ card + learn-more | ✅ | ✅ | ✅ | ✅ per-service crop |
| `/services/botox` | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| `/membership` | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| `/gallery` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ placeholders only |
| `/blog` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ square cards |
| `/contact` | ✅ | ✅ form fields | ✅ | ✅ | ✅ | N/A |
| `/booking` | N/A redirect | N/A | N/A | N/A | N/A | N/A |

### Desktop 1440×1000 (after fixes)

| Route | Overflow | Nav/CTA | Typography | Brand colors | Shadows/gradients |
|-------|----------|---------|------------|--------------|-------------------|
| `/` | ✅ | ✅ active nav | ✅ | ✅ Ink-on-rose CTAs | ✅ no card shadows |
| `/about` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/services` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/services/botox` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/membership` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/gallery` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/blog` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/contact` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/booking` | N/A | N/A | N/A | N/A | N/A |

### Popup & motion

| Check | Result |
|-------|--------|
| Reveal on `/` after delay/scroll | ✅ |
| Excluded on `/contact` | ✅ |
| Excluded on `/services/weight-loss` | ✅ |
| Focus trap + Escape + scroll lock | ✅ |
| Session frequency cap | ✅ |
| Reduced-motion respected | ✅ |
| Uses `/api/leads` (existing CRM path) | ✅ |

### Out of scope (unchanged)

- `/napa/botox` campaign shell (clay B01 palette) — isolated campaign route
- `WeightLossServicePage` gradient/shadow system — weight-loss host funnel
- `/team` route — still absent; team CTA points to `/about`
- Gallery real photography — awaiting owner assets

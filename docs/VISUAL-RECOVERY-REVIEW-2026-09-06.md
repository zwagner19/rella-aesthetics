# Rella Visual Recovery Review

- Date: September 6, 2026
- Branch: `codex/restore-pr14-visuals-with-attribution`
- Current-main base: `4743e4e8d5ee49cdfb0509a4dc60af7337d7f5bd`
- Approved visual source: `085d293e73321643285ed3e50fd12d2004916ee4`
- Visual regression merge: `54c9257f8af1740f40dcba3ba622ec3101bcab22`

## Decision

Ready for a Vercel preview and explicit owner visual review. Not approved for a production-domain switch.

The recovery is selective. It restores the visual language reviewed before PR 20 without reverting PR 20 wholesale and without restoring deprecated tracking, embedded booking, or preview-only systems.

## Restored

- Rose Rella logos in the ordinary-site header, footer, and mobile navigation.
- Rose headings and labels that PR 20 changed to black.
- White type on owner-approved Rose bands and Rose buttons.
- Approved site header, footer, navigation, shared buttons, cards, FAQ, gallery, membership, and booking-call-to-action styling.
- Scroll-entry movement with a reduced-motion fallback.
- The mobile Call / Book bar, with safe clinic/category intent and no advertising identifiers.
- The approved Napa reception image; the rejected exterior/house image remains excluded.

## Preserved

The following production-safety surfaces have zero diff from current main:

- `src/app/(campaign)`
- `src/components/integrations/AestheticsAttributionConsent.tsx`
- `src/components/integrations/AestheticsAttributionConsent.module.css`
- `src/lib/aesthetics-attribution.ts`
- `src/lib/booking-routes.ts`
- `src/proxy.ts`
- `src/app/api`
- `next.config.ts`
- `next-sitemap.config.js`
- `legacy-redirects.json`

The Napa Botox campaign therefore retains its isolated shell, exact booking destination, consent controller, cache policy, and attribution handoff. Ordinary-site CTAs continue to use the current branded booking-route resolver. No Boulevard, cart, checkout, payment, conversion-uploader, or Google Ads logic was added.

The ordinary-site GoHighLevel chat loader is again desktop-only so it cannot execute underneath the restored mobile conversion bar.

## Verification

- Vitest: 29 files, 288 tests passed.
- ESLint: passed.
- TypeScript: passed.
- Next.js production build: passed, 45 routes generated.
- Sitemap postbuild: passed.
- `git diff --check`: passed.
- Frozen safety-path diff against `4743e4e`: empty.
- Independent code review: no blocking findings remain.
- Mobile review at 320px and 390px: no hydration warning, horizontal overflow, footer obstruction, or control-size failure.
- Campaign runtime review: five booking CTAs resolve to `https://book.experiencerella.com/book/napa/botox`; the campaign keeps its black logo and does not inherit ordinary-site chrome or the generic mobile bar.

## Explicit Limit

The exact approved visual uses white text on `#F7A19A` Rose in several branded bands and buttons. That combination is approximately 2:1 and does not meet WCAG AA for normal text. This is recorded as a visual-owner approval exception, not as an accessibility pass. Ink and Silver body copy retain AA contrast.

## Attribution Status

This branch preserves the existing attribution implementation by leaving its protected code paths unchanged and by testing campaign isolation. It does not create a real booking or a real Google Ads conversion. End-to-end booked-appointment conversion proof remains a separate operational test and must not be inferred from this visual recovery.

## Release Boundary

- Do not merge until Zach and Amie approve the Vercel preview visually.
- Do not point `experiencerella.com` at this application as part of this pull request.
- Do not change Google Ads, WordPress, booking production, Supabase, Vercel production flags, or the uploader as part of this pull request.
- After visual approval, merge and production-domain work still require their own controlled release decision.

# Conversion accessibility pass — 2026-08-04

## Outcome

Rella's ordinary-site booking actions are now easier to read, the contact form accepts the same phone-or-email lead contract as the server, and the full-screen mobile menu keeps keyboard focus inside the open menu and returns it to the trigger when closed.

These are conversion repairs: visitors must be able to read the action, use their preferred contact method, and operate the navigation before traffic is purchased.

## Defects found

### Primary booking contrast

The ordinary site used the decorative peach `#F7A19A` behind small white uppercase booking text. That pairing measured `2.00:1`, below the WCAG AA `4.5:1` requirement for this text size. The darker hover color measured only `2.54:1` against white.

The same low-contrast pairing appeared in the desktop header, mobile navigation, fixed mobile booking bar, shared buttons, membership treatment, service close sections, and local acquisition pages.

### Contact-method friction

The lead API correctly accepts a name plus either email or phone. The visible form nevertheless marked email as required and phone as optional, rejecting a phone-first prospect before the request could reach the lead system. The name, email, and phone fields also lacked the standard browser autofill hints that reduce mobile typing.

### Mobile-menu keyboard containment

The full-screen mobile menu identified itself as a dialog but did not mark itself modal, move focus into the menu, contain Tab navigation, or return focus to the menu button after closing. A keyboard visitor could move into controls hidden behind the overlay.

## Repair

- Preserved Rella's soft peach for decorative accents and dark-surface highlights.
- Added a dedicated `#A34F49` action/text tone: `5.57:1` against white and `5.25:1` against the blush surface.
- Added a `#8F403B` hover tone: `7.08:1` against white.
- Moved every white-text ordinary-site booking action from decorative peach to the compliant action tone.
- Moved white-button rose labels, step markers, membership ribbons, rating stars, check marks, and FAQ controls to readable tokens where needed.
- Changed the contact form to require name plus at least one reachable channel: email or phone.
- Added accessible inline validation, `name`, `email`, and `tel` autofill hints, phone/email mobile keyboard hints, a full-width mobile submit action, and a polite success announcement.
- Connected the mobile-menu button to a true modal dialog, focused the close control on open, trapped Tab/Shift+Tab inside the menu, restored prior body-scroll state, and returned focus to the trigger on close.
- Added a source-wide regression gate that calculates token contrast and rejects a decorative-peach/white-text CTA pairing.

## Verification

- 14 focused conversion/accessibility checks passed.
- 349 automated checks passed across 32 test files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 47 routes.
- Legacy crawl passed with 31 moved routes and 2 preserved public records.
- Internal crawl passed across 36 sitemap pages and 47 unique internal destinations.
- Internal graph passed with zero orphaned indexed pages and maximum homepage crawl depth 2.
- Booking crawl passed across 36 pages and 20 unique external destinations.
- SEO crawl passed across 36 pages, 13 social images, and 54 valid JSON-LD blocks.

The hosted-preview keyboard, screen-reader, CRM-delivery, and real-device checks remain launch gates. No deployment, push, merge, DNS change, CRM mutation, ad/account change, campaign mutation, or public cutover was performed.

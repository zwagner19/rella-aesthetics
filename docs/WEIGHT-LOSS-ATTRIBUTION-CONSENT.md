# First-party attribution consent contract

## Scope

The marketing site does not add a consent banner or choose consent on a visitor's
behalf. It consumes an explicit state from the production consent-management
platform (CMP) and fails closed when that integration is absent, uninitialized,
malformed, or unavailable.

This contract covers the first-party handoffs from `experiencerella.com` to
`book.experiencerella.com` and from `rellaweightloss.com` to
`book.rellaweightloss.com`. It does not establish whole-site consent compliance.
The existing GA and Meta components have separate consent and deployment review
requirements.

The weight-loss host suppresses the direct GA, Meta Pixel, and browser intent
writer completely. It also suppresses the LeadConnector/GHL chat loader until
that third party has a verified CMP-owned consent gate. Suppressing the three
measurement components does not change page content or layout. GHL chat is a
conditional visible integration: when `NEXT_PUBLIC_GHL_CHAT_WIDGET_ID` or
`NEXT_PUBLIC_GHL_CHAT_WIDGET_URL` is configured, its loader can add a desktop
launcher. Before release, either prove both production variables are unset or
record explicit owner approval for the launcher's temporary removal and a
CMP-owned, consent-gated replacement. Do not restore the loader merely to avoid
a visual change. A future measurement stack must have one owner: either a
verified consent-gated GTM container or reviewed consent-gated direct
components, never both.

Paid medical-weight-loss traffic must use the location-bearing URLs
`https://rellaweightloss.com/medical-weight-loss-napa/` or
`https://rellaweightloss.com/medical-weight-loss-vacaville/`. Their canonical
and Open Graph URLs remain location-specific. The legacy aesthetics route
redirects to the weight-loss apex and is not a paid-traffic destination.
Cross-registrable redirects strip click/source parameters before leaving their
original host.

## CookieYes bridge

The application mounts a null-rendering bridge that exposes the internal
adapters for both marketing domains. It does not load CookieYes, render a
banner, or choose consent. The externally managed production CookieYes
integration must expose its official public getter:

```ts
window.getCkyConsent(): {
  isUserActionCompleted: boolean;
  categories: { advertisement: boolean };
};
```

The bridge maps a completed explicit advertisement grant to `"granted"` and a
completed explicit advertisement refusal to `"denied"`. A missing getter,
exception, incomplete user action, missing category, or malformed value maps to
`"unknown"`. It never reads or infers consent from CookieYes cookie text.

The bridge re-reads `getCkyConsent()` after CookieYes banner-load and
consent-update events, then dispatches the matching internal domain events. The
internal adapter shape remains:

```ts
interface AttributionConsentAdapter {
  getState(): "granted" | "denied" | "unknown";
}
```

In `"unknown"`, the marketing site does not access session storage, parse or
store incoming attribution, mutate booking links, or call the attribution API.
Clean booking links continue to work. An explicit completed `"denied"` choice
performs only the deny-specific cleanup and revocation described below.

## Booking API acknowledgement

After an explicit grant, the applicable marketing site may POST approved
attribution fields to one of these exact endpoints:

`https://book.experiencerella.com/api/booking-v2/attribution`

`https://book.rellaweightloss.com/api/booking-v2/attribution`

The request body is minimized to location, `consentAdUserData: "granted"`, an
opaque `revocationHandle`, exactly one validated `gclid`/`gbraid`/`wbraid`, and
optional validated numeric `campaignid`/`adgroupid` attached to that click.
Ordinary first grants and retries omit `revocationPredecessorHandle`. The first
grant after a finalized denial rotation, and only its retries, also send the
immutable tombstoned predecessor H1 so the server can bind concurrent H2/H3
successors to one consent scope. Both handles use the same opaque bounded
format and contain no click, campaign, client, or health data.
Campaign IDs alone are neither
stored nor posted. If more than one click-ID class is present, the browser fails
closed: it sends no capture request, does not use an older session touch, leaves
the landing URL intact for diagnosis, removes the older session fallback so a
later navigation cannot resurrect it, and still never decorates booking links.
UTM labels, keyword, match type, device, network, `gclsrc`,
arbitrary query parameters, contact data, and health/treatment labels are never
put into the session fallback, booking URL, or server request. Booking links are
never decorated with raw attribution values because a URL cannot carry the
consent proof required by the booking application. For requests containing a
click ID, the browser accepts capture as complete only when the JSON response
contains all of:

```json
{
  "ok": true,
  "attributionId": "non-empty identifier",
  "consentAdUserData": "granted",
  "clickIdentifiersStored": true
}
```

Any HTTP error, malformed response, missing identifier, or absent/false
`clickIdentifiersStored` retains the consented same-session and current-page
state for a later capture retry. A capture attempt is abortable and has a
10-second client bound; an explicit denial aborts it immediately so a fetch
that never settles cannot starve the serialized revocation. It never delays or
blocks booking and never
forwards raw identifiers in a booking URL, so capture failures intentionally
undercount attribution. Raw click identifiers are removed from the page only
after the applicable acknowledgement. Before starting a grant request, the
browser creates 32 random bytes and stores `rvh_` plus their 43-character
base64url encoding in the bounded parent-domain cookie
`rella_ad_attribution_revoke` (`Path=/; Max-Age=2592000; Secure;
SameSite=Lax`). The handle is opaque, contains no click, campaign, client, or
health data, and is revocation-only: it is neither consent nor grant proof. It
must read back from the cookie with exact equality immediately after the write;
a blocked, ignored, or altered cookie fails closed and no grant request starts.
An already retained handle must pass the same exact format validation. Outside
the post-denial rotation described below, it is rewritten with the bounded
30-day lifetime on each granted capture. It is retained after both a successful
capture and a lost capture acknowledgement so a later denial can revoke a grant
that committed without a usable response.
An acknowledgement means attribution was
stored; it is never a booking, appointment, reservation, lead, or Google Ads
conversion.

On a completed advertisement denial, the browser strips client attribution and
first writes the client-readable deny-only cookie
`rella_ad_user_data_denied=1` on the applicable parent domain. The cookie uses
`Path=/; Max-Age=2592000; Secure; SameSite=Lax`; it is never grant proof. The
browser then POSTs location, `consentAdUserData: "denied"`, and the existing
opaque `revocationHandle` when one exists. An initial or legacy denial with no
handle sends only location and denied consent. Neither form contains click,
campaign, UTM, or client fields. Capture and revocation share a serialized
request queue, and
the deny sentinel remains authoritative if an aborted request later settles.
While the page remains visible, online, and in the same consent generation, a
failed revocation receives four automatic retries after 1, 2, 4, and 8 seconds.
Each revocation request has a 10-second client bound and is aborted on timeout,
unknown consent, or unmount; even an abort-ignored fetch releases the serialized
client queue before retry. The retry timer is canceled on unknown consent,
generation change, terminal acknowledgement, or unmount. A later CMP, online,
or visible-page trigger may make one immediate attempt without resetting that
finite automatic budget. No retry logs or sends click IDs. The server
acknowledgement must report
`ok: true`, `consentAdUserData: "denied"`, a boolean `revoked`, and
`clickIdentifiersStored: false`, plus `revocationFinalized: true`. The terminal
field is emitted only after the atomic server operation revoked every resolved
scope and/or durably stored the keyed-HMAC denial tombstone. `revoked: false`
without terminal proof is retried. A terminal response for the current denial
generation completes the client retry state but never mutates or deletes the
shared revocation-handle cookie. The tombstoned H1 and the deny sentinel both
remain through denial and across reloads. An acknowledgement returning late in
another tab therefore has no cookie mutation path and cannot affect a newer
handle.

On a later explicit grant, any pending revocation finishes before capture. The
initial denial remains handle-free when no prior grant created a handle. If a
later grant sees the retained deny sentinel but no handle, the client first
generates and exactly reads back H1, sends a revocation-only denial preflight
containing location, denied consent, and H1, and waits for terminal tombstone
proof. Attribution is not read and no grant is sent unless that preflight
succeeds. A blocked or altered H1 cookie, nonterminal response, timeout, or
exhausted retry therefore leaves the sentinel authoritative and intentionally
undercounts the grant.

After terminal proof, the
client synchronously replaces tombstoned H1 with a freshly generated H2, checks
that H2 reads back exactly from the bounded parent-domain cookie, and only then
sends the grant request with H2 as `revocationHandle` and H1 as
`revocationPredecessorHandle`. Immediately before enqueueing the network request,
the client also requires the request handle to remain the current cookie value.
A blocked, ignored, repeated, altered, or concurrently replaced rotation fails
closed and sends nothing. Capture retries in that same post-denial grant reuse
the verified current handle instead of rotating again and retain the same
immutable H1 until stored-click acknowledgement or a newer denial supersedes
the generation. Ordinary grants never send a predecessor. Denial requests
never send a predecessor, click ID, campaign ID, or any other attribution field.
Only a current-generation truthful stored-click acknowledgement may clear the
deny sentinel. A late grant response after denial cannot clear either control.
Client code never reads or exposes the opaque HttpOnly
`rella_ad_attribution_scope` cookie.

If the page stops after rotating H1 to H2 but before the grant is acknowledged,
a reload has no in-memory proof that H2 was granted or tombstoned. With the deny
sentinel still present, the fresh client must send a revocation-only denial
preflight for H2, wait for terminal proof, then rotate H2 to H3 before any grant.
This conservative recovery may undercount but never weakens withdrawal.

## Production dependencies

Production activation remains blocked until all of the following are verified:

- CookieYes is loaded and configured externally on both marketing domains; this repository does not add its banner.
- `getCkyConsent()` and the CookieYes banner/update events are verified in each production host context.
- No external GTM, direct analytics, or chat loader runs on the weight-loss host before its reviewed consent gate; GTM and direct components must never both own the same event.
- The booking API CORS allowlist accepts `consentAdUserData` from exact origins `https://experiencerella.com`, `https://www.experiencerella.com`, and `https://rellaweightloss.com`, with no wildcard.
- The booking API returns `consentAdUserData: "granted"` and `clickIdentifiersStored: true` only after durable click-ID storage.
- Both booking endpoints accept only `rvh_` plus 43 base64url characters as `revocationHandle`, retain only the server-side keyed representation, and use it solely for family-wide revocation.
- Both booking endpoints accept grant-only `revocationPredecessorHandle` in the same opaque format, require the body successor to match the current request cookie, and atomically bind concurrent successors of one tombstoned predecessor to a single consent scope. Denial requests reject the predecessor field.
- Both booking endpoints return `revocationFinalized: true` only after the keyed-HMAC denial tombstone is durable, reject late grants resolved to that tombstone, and expire/purge tombstones under the approved 91-day policy.
- Booking/cart honors `rella_ad_user_data_denied=1` across the parent domain even when revocation is unreachable, and only the current marketing client clears it after a truthful stored-click acknowledgement.
- The cart-to-appointment offline-conversion pipeline is enabled and proven against a synthetic booking.
- Denial revocation is proven to clear the shared HttpOnly cookie and redact the server record on both booking hosts.
- Cookie write/read behavior for the deny sentinel is verified on apex and www host journeys.
- Cloudflare, Vercel, CDN, WAF, access-log, and log-drain query retention is inventoried for both medical-weight-loss city paths with Google click IDs. Query logging must be redacted/disabled or explicitly approved under policy before paid traffic is enabled; app-level query cleanup does not remove edge or infrastructure logs.

Without the CMP adapter, capture intentionally remains off. Without the booking
acknowledgement contract, no raw-ID booking fallback is permitted and reporting
intentionally undercounts capture failures.

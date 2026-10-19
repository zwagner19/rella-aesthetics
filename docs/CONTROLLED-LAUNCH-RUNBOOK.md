# Controlled launch: preserve WordPress landings, release the remaining site

Prepared October 18, 2026 PDT / October 19 UTC. **Preparation only: no DNS, Worker routes, production deployment, runtime flags, advertising uploads or bookings were changed.** Amie’s visual design remains locked. Deposit policy/reconciliation belongs to the separate deposit workstream.

## Verified topology and rollback anchors

Authenticated Vercel reads and Cloudflare GETs establish the following snapshot. Refresh these exact mappings immediately before an authorized release.

| Surface | Current owner / immutable reference |
|---|---|
| Apex and www | Cloudflare zone `b49a5feaea8d0846f784c14a4f5f1167`, authoritative nameservers `art.ns.cloudflare.com` / `romina.ns.cloudflare.com`; public GETs returned WordPress HTML. Neither host is assigned to the Vercel website project. |
| Existing edge | **Zero zone Worker routes.** `napa-botox-edge` deployment `96dd4599-c484-4b5b-a1da-5c8f4656bffe` serves 100% inert version `856ba0c0-ab01-4cb4-a3e6-fd6393d4890a`, whose version-specific `EDGE_ENABLED` is false. Uploaded/latest settings are not the deployed version. |
| Website Vercel project | `rella-aesthetics`, `prj_3ppAinB6Uzy0i0WA1OxB81rubmnD`, team `team_hjRUOcZZh1yP3f3tT9pXaOYW`. Production `dpl_BRd6qjA2WGHsvkPQ9JmXfBYKHxyh`, commit `2dd68cad107fb91ecea9e1dc3de6ecda4fd5a71f`, immutable host `rella-aesthetics-19g8aqegu-zwagner19s-projects.vercel.app`. Its existing custom domain is **weightloss.experiencerella.com**. |
| Booking Vercel project | `rella-booking`, `prj_3breRn5YTfW3P5K559KU7FCOygKV`, same team. Production `dpl_FzvsMLVsfMNFdxn6EuEzPpZQPCmP`, commit `b7b722c82d9234be50ca391a63d32e5008eaa8d1`, immutable host `rella-booking-dlkqt3fby-zwagner19s-projects.vercel.app`. Both `book.experiencerella.com` and `book.rellaweightloss.com` alias it. |
| Audited website preview | `dpl_DqX9qjP1raJunph9VJ2he1Pu6S3d`, commit `4400589c56b9e24b649b3c3b05a940f38e896e73`, branch `codex/amie-shared-booking`. This precedes the controlled-launch fixes; it is not the release candidate. |
| Other website projects | `rella-nextjs` and `rella-aesthetics-hblc` also auto-build this repository. Their current production deployments are `dpl_HuFjQ6VeaNZBUYD9iUwMAoaYo4ce` and `dpl_6kaLGWx52NmpSg7J3W4kESXc1UzL`, also commit `2dd68cad…`. Do not accidentally publish one of these. |

Historical reviewed DNS provenance records apex/www as proxied O2O CNAMEs to `wp.wpenginepowered.com`, with booking DNS-only. The current authenticated DNS-record GET returned **403**, so that historical record content is not certified current. Obtain a current owner-side zone export/readback before activating routes. Leave nameservers, web records, mail records, TLS mode and booking DNS unchanged. Public HTTP automation also encountered an intermittent Cloudflare 403; that alone does not establish an origin outage.

## Day-one routing contract

Keep these six existing WordPress entry paths, **both slash forms and their query strings**, on WordPress:

`/napa`, `/napa/botox`, `/napa/laser`, `/napa/filler`, `/napa/hydrafacial`, `/napa/hyperhidrosis`.

Current GETs returned 200 WordPress HTML for their slash forms. They are protected historical campaign URLs; this audit did **not** retrieve current active-ad final URLs and does not claim all six currently receive ads. Obtain the ads owner’s current final-URL inventory before retiring any of them. The attached prelaunch audit reports capture on these pages; preserving them does not independently prove a granted click or an accepted conversion.

The new module is `edge/controlled-launch-worker.mjs`, with independent tests in `edge/controlled-launch-worker.test.mjs`. It is prepared but not uploaded. A separately reviewed Worker can bind only `experiencerella.com/*` and `www.experiencerella.com/*` after the gates below. Its behavior is:

| Request | Destination / behavior |
|---|---|
| Six exact WordPress paths | Unchanged same-zone origin fetch; no Next redirect or body replay. |
| `/wp-content`, `/wp-includes`, `/wp-json`, `/wp-admin` and descendants; login/XML-RPC/cron/comment endpoints | WordPress, with original method, body, cookies and query. |
| Root or `/index.php` with classic WordPress `rest_route`, post/page, search or preview query keys | WordPress. These query keys cannot divert an `/api` body to WordPress. |
| Other apex pages and Next assets | One fixed immutable full-site Vercel deployment host, not the mutable project/branch alias. |
| New `/api/**` | Same fixed origin, original body/cookies once, manual redirects, no cache, no retry or WordPress fallback after failure. |
| www GET/HEAD | One 308 to the same apex path/query, preserving entry identifiers on the same site. New www POSTs are not redirected/replayed; existing WordPress POSTs retain their destination. |
| Disabled edge | Original request passes to the existing zone origin. |

Keep `global_fetch_private_origin` explicit so WordPress passthrough reaches the zone origin rather than recursively invoking the public Worker. Do not activate the historical `4aefcb87…` Napa-only artifact: its scope, cookie stripping and GET-only proxy do not support the new APIs. [Cloudflare compatibility flags](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#global-fetch-strictly-public)

### Origin, SEO, cookies and financial boundaries

The full-site Next build must send `X-Rella-Site-Origin: next-controlled-launch-v1`; retain the separate historical campaign marker. The Worker removes the Vercel transport header **only when it is exactly `noindex`**, the response is 200 `text/html`, the new marker matches, and there is exactly one canonical equal to `https://experiencerella.com` plus the requested pathname. Absolute HTTPS canonicals are normalized with `URL.href`, without query, fragment or credentials, so the homepage's omitted trailing slash is equivalent. The single fixed exception is `/services/weight-loss` → `https://weightloss.experiencerella.com/`, preserving that page's existing approved external canonical without redirecting or changing its query. Other cross-domain canonicals remain blocked. Public document reads drop conditional validators so a 304 cannot substitute for that complete-page proof; asset validators remain unchanged. Explicit document robots policies remain. API, Studio, booking, card and Next internal paths never gain public indexability. Incorrect/missing markers or canonicals fail closed.

Private API responses retain HttpOnly/Secure cookies as separate headers, stay `no-store, private` and `noindex, nofollow`; immutable assets keep their upstream cache policy. Subrequests bypass Cloudflare cache. [Cloudflare fetch/cache behavior](https://developers.cloudflare.com/workers/runtime-apis/fetch/)

The Worker validates the incoming browser `Origin` by exact equality to the public request origin before translating it to the fixed upstream origin required by Next’s same-origin guards. Foreign/missing origins are not legitimized. It removes spoofable forwarding/bypass headers and injects a server-held bypass secret only if configured. Redirect rewriting replaces only that fixed upstream origin; it never appends the incoming query to a booking or external URL.

There is no automatic retry or fallback for an uncertain POST. Rollback must not re-submit a payment, create another appointment, discard an unresolved financial session, or imply that a queued upload was accepted.

## Configuration readiness

Inspect names/targets in the intended team/project; never print secret values or copy them into this document.

| Owner | Required configuration / current finding |
|---|---|
| Website | `RELLA_BOOKING_BACKEND_ORIGIN`: currently branch-Preview-only, pointing to the paired booking Preview. A staged production build must pin the approved production backend. The code defaults to `https://book.experiencerella.com`. |
| Booking | `BOOKING_V2_FULL_MENU_ENABLED`, existing runtime/policy gates, canonical `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`, existing Boulevard credentials and crypto keys. Full-menu enablement was listed only on the feature Preview; absence from Production must be resolved explicitly, not assumed inherited. Preserve deposit-owner configuration. |
| Card iframe | `BOOKING_V2_MARKETING_ORIGIN` currently names the website branch Preview. `/secure-card` hardcodes exact apex/www production parents; Preview needs its exact configured origin. `BOOKING_V2_ALLOWED_PREVIEW_ORIGIN` / `BOOKING_V2_PREVIEW_SITE_SCOPE` are Preview host/request controls. Test the intended public parent and foreign-parent refusal against the staged backend. Production `/secure-card` currently returns **404**. |
| Contact/CRM | `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_CUSTOM_FIELD_SERVICE_ID`, `GHL_CUSTOM_FIELD_LOCATION_ID`, `GHL_CUSTOM_FIELD_MESSAGE_ID` are all present for generic Preview and absent from Production (zero hidden production variables reported). Existing Sensitive credential readback returned403; its business identity, notes permissions and workflow behavior remain unverified. No Production target was added. Verify this exact credential securely before the authorized target-only extension; retain Preview values/scopes and do not substitute an HQ token. |
| Tracking | Production lists `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`, `CLARITY_PROJECT_ID`; no Meta/GHL widget ID/URL was listed. Confirm the reviewed build prevents those loaders from observing booking/contact/card details. Consent receipt persistence and marketing=false must not be treated as a global CRM/DND change. |
| New edge | `EDGE_ENABLED` exact string `true`; `ORIGIN_HOST` exact immutable `rella-aesthetics-<deployment>-zwagner19s-projects.vercel.app`; optional `VERCEL_AUTOMATION_BYPASS_SECRET`. No secret belongs in source. Keep workers.dev/preview ingress disabled and pin the compatibility contract. |

## Execution sequence after explicit release authorization

1. Freeze the reviewed website/backend commits, retain the other chat’s approved policy/GA changes, rerun required tests/builds/security checks, and record new immutable deployment IDs. Run `node --test edge/controlled-launch-worker.test.mjs` separately; the website test command does not run this Node suite.
2. Confirm current zone records/routes and record the new Worker’s disabled version ID before any activation. The observed rollback route set is empty. Keep the old Napa Worker inert. Record approved production flag state without changing paid eligibility or upload settings as part of route work.
3. Resolve Production GHL readiness and verify consent receipt migration/persistence; securely prove the existing credential belongs to Rella and has the required contacts/notes access. Inspect downstream trigger behavior before calling marketing opt-in enforcement complete.
4. Stage the backend as a **production-environment build without assigning domains**. Verify secure-card parent isolation, both aesthetics clinics and the unchanged weight-loss backend behavior. Do not promote the old Preview and assume its environment/build is identical. Stage and test the reviewed website the same way. [Vercel staged production/promotion](https://vercel.com/docs/deployments/promoting-a-deployment)
5. Complete the specifically approved supervised financial/ownership/outcome tests with human card entry. Deposit approval and accepted-upload proof remain separate gates; never enable uploads merely to make a launch check pass. Record any pending state and its recovery evidence.
6. Release the approved backend before new website traffic. Remember this aliases both booking domains. The website can remain a staged immutable production build behind the Worker, leaving the existing weight-loss website alias on its prior deployment until separately verified. A general website project promotion would also change that weight-loss domain.
7. Verify the new public-origin marker/canonical contract on the immutable website build. Upload a reviewed new Worker disabled first, record disabled/enabled version IDs and exact source hash, then obtain the final route-activation decision. No DNS cutover is needed for the proposed plan.
8. Activate only the two reviewed zone routes. Smoke every preserved WordPress path/asset/form namespace plus homepage, both locations, services, API guards, same-origin cookies, card frame, no-JS fallback, www/query continuity, robots/sitemap and canonical/indexability. Use a physical iPhone Safari check; viewport simulation is separate evidence. Do not create new holds/payments during ordinary smoke testing.

## Rollback

The quickest site rollback is removal of the **two newly added route IDs**, restoring the verified empty route set and existing WordPress origin; alternatively deploy the new Worker’s specifically recorded disabled version. Do not change DNS or activate the obsolete Napa artifact. Verify the six landings and existing WordPress assets/admin/API again. Preserve unresolved financial evidence; route rollback does not cancel appointments or reverse charges.

If an authorized Vercel promotion also occurred, restore the exact deployment anchors above with the relevant project’s rollback, then verify both domains sharing that project. Prefer keeping the last known compatible backend available for already-started visits rather than blindly rolling it back during pending checkout. Vercel rollback stops automatic production-domain assignment until explicitly restored; record that state. [Vercel rollback](https://vercel.com/docs/deployments/rollback-a-deployment)

Do not delete the additive consent/package ledgers during rollback. New Worker version IDs, release deployment IDs, route IDs, current flag values and the owner’s go/no-go decision must be entered in the release record before activation; they are intentionally not invented here.

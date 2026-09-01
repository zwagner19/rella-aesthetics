# Microsoft Clarity launch runbook

Status: project created and privacy settings prepared; tracking intentionally inactive.

Clarity is not a launch requirement and must not be enabled merely because the code exists. The
site requires both `CLARITY_ENABLED=true` and a valid server-side `CLARITY_PROJECT_ID`; neither
belongs in Preview. The project ID is configured in Vercel Production, but the enable flag is
absent, so no Clarity code can load. The loader also requires the exact public
`experiencerella.com` host, explicit
visitor consent, and a reviewed low-sensitivity route.

## Current project record

- Owner account: `info@experiencerella.com` (`Rella Aesthetics`).
- Project: `Rella Aesthetics — Public Website`.
- Project ID: `y3oafpgl31`.
- Website: `https://experiencerella.com`.
- Industry: Health & Wellness.
- General Clarity Terms and the Health & Wellness Additional Terms were accepted on 2026-08-17
  after Zach explicitly authorized acceptance.
- Masking mode: **Strict** (all text masked).
- Project cookies: **Off** by default; explicit Consent V2 remains required.
- Microsoft Ads, Google Ads, and Google Analytics integrations: not connected.
- `CLARITY_PROJECT_ID` exists in Vercel **Production only**. `CLARITY_ENABLED` does not exist.
- Still required before activation: internal-IP exclusions, final privacy approval, exact public
  release, and the complete clean-browser network/cookie smoke below.

## Owner/account gate

1. **Complete:** Zach explicitly authorized acceptance of Microsoft's Clarity Terms and the
   Health & Wellness Additional Terms; the project was created under the Rella-owned account.
2. Keep Microsoft Ads, Google Ads, Google Analytics, and advertising audiences disconnected at
   launch.
3. Keep the booking app, weight-loss domains, and contact/intake systems out of the project.

## Required project settings before activation

1. Settings → Setup: turn the default cookie setting **off** so Consent Mode is required.
2. Settings → Masking: choose **Strict**. Do not add unmask rules.
3. Settings → IP blocking: exclude clinic, home-office, designer, and QA-team IPs or ranges.
4. Give the minimum necessary people access. Do not use Identify, friendly names, patient IDs,
   custom session IDs, service-interest tags, or appointment events.
5. Record the project owner, administrators, project ID, masking mode, and activation date in the
   release packet without recording credentials.

## Vercel configuration

The following is already present in the canonical `rella-aesthetics` project in **Production
only**:

- `CLARITY_PROJECT_ID=y3oafpgl31`

Do not add it to Preview or Development. Add `CLARITY_ENABLED=true` to Production only after every
remaining gate in this runbook passes. Then redeploy the already approved release commit; do not
promote a build compiled before the enable flag existed.

## Mandatory smoke test

Use a clean browser profile and verify all of the following before leaving the gate enabled:

1. Protected Vercel previews load no `clarity.ms` request and show no Clarity preference banner.
2. Public homepage before a choice loads no Clarity script, `_clck`, or `_clsk` cookie.
3. **No thanks** stores the preference and produces no Clarity script, cookie, or collect request.
4. **Allow analytics** loads one `clarity.ms/tag/<project-id>` request, grants analytics storage,
   keeps ad storage denied, and shows masked content in the Clarity live view.
5. The footer **Clarity Choices** control reopens the preference panel. Withdrawing consent ends
   the session and removes `_clck` and `_clsk`.
6. `/contact`, `/book`, every `/services/<detail>`, every `/napa/*` and `/vacaville/*` treatment
   page, the booking app, and the weight-loss host load no Clarity code or collect request.
7. Moving from an eligible page into an excluded page uses a full document navigation and leaves
   the destination free of Clarity.
8. No request includes names, email, phone, form content, provider, appointment, payment, health
   answers, or a treatment-specific custom tag.

If any item fails, set `CLARITY_ENABLED=false`, redeploy, and investigate before collecting data.

## First review cadence

- Day 1: confirm consent and exclusion behavior; inspect only masked sessions.
- Day 7: review mobile scroll depth, dead clicks, rage clicks, and the homepage clinic chooser.
- Day 14: document changes worth testing. Do not infer patient intent or connect sessions to CRM.
- Monthly: review access, masking, allowed pages, retention, privacy language, and internal IPs.

Microsoft references:

- Consent management: https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-management
- Consent API V2: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2
- Masking: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking
- IP exclusion: https://learn.microsoft.com/en-us/clarity/setup-and-installation/ip-exclusion

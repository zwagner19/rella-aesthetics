# Amie content and design handoff

## What this workspace controls

One codebase now contains both customer-facing experiences:

1. The full Rella Aesthetics replacement site for `experiencerella.com` (still a nonpublic staging project until Zach approves a future cutover).
2. The medical weight-loss experience at `weightloss.experiencerella.com`.

The employee-only Rella HQ app is a different repository and is not part of this workspace.

Customer booking also lives in its own Rella-owned application. This website
passes only clinic/service intent to that application; Boulevard remains
server-side behind the booking app. The old embedded Boulevard widget, browser
SDK, public widget environment variables, and widget UI components have been
deleted from this workspace. Do not add them back. IV hydration intentionally
uses the Rella call path until a clinically appropriate selection flow is
verified.

## Owner-approved positioning boundary

- Keep the main homepage recognizably Rella. Its dominant promise is broad aesthetic and wellness care, not Dr. Wagner or obesity medicine.
- ABOM certification, obesity-medicine authority, medical qualification, and GLP-1 education belong primarily in the weight-loss experience.
- Do not make claims about guaranteed eligibility, prescriptions, pricing, or outcomes.

## Adding before-and-afters

1. Confirm Rella has written permission for public marketing use. Keep the consent record outside this repository.
2. Remove identifying information from the image and filename.
3. Put general results in `public/images/results/main/` and weight-loss results in `public/images/results/weight-loss/`.
4. Add one entry to `src/content/results.ts` with `status: "draft"`.
5. Confirm the treatment, honest timeframe, alt text, caption, crop, lighting, and side-by-side order.
6. Only after Rella verifies public-use permission, change the status to `approved`.

Approved results can appear in the main Results page, the weight-loss page, or both. Drafts stay invisible. Do not use fake or stock before-and-afters.

## Other safe content edits

- Weight-loss Google review excerpts and the patient video: `src/content/social-proof.ts`
- Main homepage sections: `src/app/(site)/page.tsx`
- Main Results page: `src/app/(site)/gallery/page.tsx`
- Weight-loss page: `src/components/pages/WeightLossServicePage.tsx`
- Shared colors and typography: `src/app/globals.css`

## Do not edit without Zach's explicit approval

- Booking destinations or conversion labels
- Analytics, attribution, or QA-exclusion logic
- Ads, campaign status, budgets, bids, or conversion actions
- Domains, DNS, production aliases, or deploy settings
- Rella HQ links, interfaces, or backend code
- Medical claims, prices, review totals, or credential language that has not been verified

## Clean collaboration workflow

Use `output/pdf/RELLA-AMIE-WEBSITE-REVIEW-PACK-2026-08-08.pdf` for the first design pass. It contains the current staging build as numbered screenshots plus fillable change-request boxes. Amie can type notes such as `W3 — replace the middle review` without editing the application or touching booking and analytics safeguards.

When working through the shared ChatGPT project, upload the completed review PDF and approved assets. Say which placement each asset should use: `main gallery`, `weight loss`, or `both`. Ask the assistant to keep the booking/tracking safeguards unchanged, render a preview, and return the preview for Zach's approval. Production remains a separate approval step.

A private live preview link should be added to the shared project after Zach explicitly approves a preview-only deployment. The PDF is the review layer; the live preview remains the click-through validation layer.

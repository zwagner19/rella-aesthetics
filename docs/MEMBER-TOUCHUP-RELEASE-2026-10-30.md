# Member touch-up FAQ release — October 30, 2026

Owner clarification: the complimentary benefit is members only, up to 6 Botox units or 18 Dysport units when clinically appropriate, in an area treated at the original appointment, within four weeks. No complimentary units after four weeks or for a new area.

Application `6b90e34` (PR #49, merged into `codex/amie-shared-booking` as `b71e35a`) changes copy only. Existing FAQ components and matching schema are reused. Production deployment `dpl_CxUYnZifXFJDeyPSGYq9fjkTfW3B`, immutable origin `rella-aesthetics-d0j2d4nn5-zwagner19s-projects.vercel.app`, is served by Worker version `2a9adbf0-ed44-4178-9389-2ce343c19496` at 100%. Previous rollback Worker: `06d07697-d5af-4107-989e-7e57428ffa5c`.

Public `/membership`, `/services/botox` and `/blog/botox-cost-napa` contain the clarified answer. The cost article remains noindex pending other factual and clinical review. The Next `/napa/botox` campaign source is corrected for consistency, but public `/napa/botox/` still routes to the separate WordPress page; this release does not change that route or WordPress content. No six-unit/touch-up promise was found in that public legacy page during verification.

Scoped lint, 43 existing rendering/schema tests, TypeScript and production build passed. Nine staged route comparisons retained identical CSS references, canonical/indexability and links; home, both locations, cancellation policy and booking text were unchanged. Chrome 390px emulation verified readable FAQ expansion with no horizontal overflow. No physical-device checkout was performed. Amie's visual components, global styles, booking behavior, deposits, Ads and budgets were not changed.

Fresh release evidence is in the task workspace `outputs/rella-seo-90-day/member-touchup-*-2026-10-30.*`. The original seven SEO baseline hashes remain unchanged. Follow the newest production release record and re-read the live Worker deployment before future releases; do not blindly restore an older origin.

# Post-Launch Monitoring Plan

## Week 1 — Immediate Verification

### DNS & Hosting
- [ ] `experiencerella.com` resolves to Vercel
- [ ] SSL certificate active (https works)
- [ ] `www` redirects to apex domain (or vice versa)
- [ ] All pages load without errors

### Redirects and retired URLs
- [ ] `/treatments/` → `/services` (200 OK)
- [ ] `/botox/` → `/services/botox` (200 OK)
- [ ] `/dermal-fillers/` → `/services/dermal-fillers` (200 OK)
- [ ] `/weight-loss/` → `/services/weight-loss` (200 OK)
- [ ] `/iv-hydration/` → `/services/iv-hydration` (200 OK)
- [ ] `/laser-treatments/` → `/services/laser-treatments` (200 OK)
- [ ] `/membership/` → `/membership` (200 OK)
- [ ] `/testimonials/` → `/gallery` (200 OK)
- [ ] `/events/` returns the owner-approved exact `410 Gone`
- [ ] `/upcoming-events/` returns the owner-approved exact `410 Gone`
- [ ] `/results/` → `/gallery` (permanent redirect, then 200 OK)
- [ ] `/our-team/` → `/team` (permanent redirect, then 200 OK)
- [ ] `/private-parties/` follows the separately approved Private Parties migration decision; do not silently collapse it into generic Contact
- [ ] `/about/` → `/about` (200 OK)
- [ ] `/contact/` → `/contact` (200 OK)

### Google Search Console
- [ ] Submit new sitemap: `https://experiencerella.com/sitemap.xml`
- [ ] Request indexing for homepage and key service pages
- [ ] Monitor "Coverage" for crawl errors
- [ ] Verify no manual actions

### Structured Data
- [ ] Test homepage with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify MedicalBusiness schema renders
- [ ] Test service pages — FAQPage schema renders
- [ ] Test location pages — LocalBusiness schema renders
- [ ] Test blog posts — Article schema renders

### Performance
- [ ] Run Lighthouse on homepage (target: Performance 95+, Accessibility 95+)
- [ ] Run Lighthouse on 2–3 service pages
- [ ] Check Core Web Vitals in PageSpeed Insights
- [ ] Confirm LCP < 2.5s, INP < 200ms, CLS < 0.1

### Integrations
- [ ] Main-site booking CTAs open the Rella-owned custom-booking app; no customer-facing Boulevard/JoinBLVD or Rella HQ link is exposed
- [ ] Website `/book` exposes exactly the Napa and Vacaville clinic choices
- [ ] Custom-booking `/book` exposes the approved 15-item aesthetics catalog (8 Napa, 7 Vacaville); IV remains call-assisted
- [ ] Both weight-loss city CTAs open the correct `book.rellaweightloss.com` consultation route
- [ ] Paid click IDs are acknowledged by the booking capture endpoint, stored behind an opaque first-party cookie, and removed from the address bar only after acknowledgement
- [ ] Submit one approved synthetic nonpatient lead via Contact → exactly one accepted record appears in the intended GHL sub-account
- [ ] GA4/GTM loads once; no duplicate bootstrap and no form or health data enters analytics
- [ ] Any approved GHL chat widget does not cover the mobile navigation, fixed booking bar, form controls, or legal text
- [ ] `/studio` is either blocked on the public apex or explicitly approved, authenticated, and dependency-audited

### WordPress rollback boundary
- [ ] Export Elementor Custom Code posts 1237 and 1239 before cutover
- [ ] After Vercel attribution is proven, deactivate the temporary WordPress capture/router scripts; never run both implementations in the same customer response
- [ ] Keep the WordPress export and prior hosting target intact through the rollback window

## Week 2 — Monitoring & Optimization

### Search Console
- [ ] Check for new crawl errors daily
- [ ] Monitor impression/click trends (comparing to previous data)
- [ ] Verify moved URLs show "Page with redirect"; verify `/events` and `/upcoming-events` show `Gone` instead
- [ ] Check mobile usability report

### Analytics
- [ ] Verify Vercel Analytics collecting data
- [ ] Track organic traffic volume vs. pre-launch baseline
- [ ] Monitor bounce rate on key landing pages
- [ ] Check conversion funnel: service page → booking page

### Content
- [ ] Publish first blog post via Sanity
- [ ] Verify on-demand ISR revalidation works (publish → live within seconds)
- [ ] Add real patient photos to Gallery (when available)

## Month 1–3 — Ongoing

- [ ] Weekly Search Console check for crawl errors
- [ ] Monthly Lighthouse audits on 5+ pages
- [ ] Monthly content publishing cadence (2–4 blog posts)
- [ ] Monitor keyword rankings for target terms
- [ ] Update Sanity content as pricing or services change
- [ ] Review GHL lead pipeline — ensure no leads are falling through
- [ ] A/B test CTA copy and placement based on conversion data

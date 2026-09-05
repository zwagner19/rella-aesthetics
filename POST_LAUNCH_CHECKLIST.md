# Post-Launch Monitoring Plan

## Week 1 — Immediate Verification

### DNS & Hosting
- [ ] `experiencerella.com` resolves to Vercel
- [ ] SSL certificate active (https works)
- [ ] `www` redirects to apex domain (or vice versa)
- [ ] All pages load without errors

### 301 Redirects
- [ ] `/treatments/` → `/services` (200 OK)
- [ ] `/botox/` → `/services/botox` (200 OK)
- [ ] `/dermal-fillers/` → `/services/dermal-fillers` (200 OK)
- [ ] `/weight-loss/` → `/services/weight-loss` (200 OK)
- [ ] `/iv-hydration/` → `/services/iv-hydration` (200 OK)
- [ ] `/laser-treatments/` → `/services/laser-treatments` (200 OK)
- [ ] `/membership/` → `/membership` (200 OK)
- [ ] `/testimonials/` → `/gallery` (200 OK)
- [ ] `/upcoming-events/` returns retired content status (410 Gone)
- [ ] `/private-parties/` serves the Private Parties page (200 OK)
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
- [ ] Canonical `book.experiencerella.com` booking app opens from public CTAs
- [ ] Configure the five GHL contact variables documented in `.env.example`
- [ ] Submit a test lead via contact form → appears in GHL
- [ ] GHL chat widget loads on ordinary marketing pages only, never the focused Napa campaign route
- [ ] Run `npm run audit:production`; release only with zero high/critical production advisories
- [ ] Deploy Sanity Studio separately with `npm run studio:deploy`
- [ ] Set `SANITY_STUDIO_URL` to its `https://*.sanity.studio` URL
- [ ] `/studio` redirects to that hosted Studio (and returns 404 when the variable is absent or unsafe)

## Week 2 — Monitoring & Optimization

### Search Console
- [ ] Check for new crawl errors daily
- [ ] Monitor impression/click trends (comparing to previous data)
- [ ] Verify old URLs show "Page with redirect" status (not 404)
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

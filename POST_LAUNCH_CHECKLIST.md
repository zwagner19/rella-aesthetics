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
- [ ] `/upcoming-events/` → `/` (200 OK)
- [ ] `/private-parties/` → `/contact` (200 OK)
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
- [ ] Boulevard booking widget loads and opens
- [ ] Submit a test lead via contact form → appears in GHL
- [ ] GHL chat widget loads on all pages
- [ ] Sanity Studio accessible at `/studio`

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

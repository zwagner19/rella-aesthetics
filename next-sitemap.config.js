const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/blog/botox-cost-napa",
  "/cancellation-policy",
  "/contact",
  "/gallery",
  "/locations/napa",
  "/locations/vacaville",
  "/membership",
  "/napa/botox",
  "/napa/facials",
  "/payment-plans",
  "/privacy-policy",
  "/private-parties",
  "/services",
  "/services/botox",
  "/services/chemical-peels",
  "/services/dermal-fillers",
  "/services/facials",
  "/services/hydrafacial",
  "/services/iv-hydration",
  "/services/laser-treatments",
  "/services/microneedling",
  "/team",
  "/terms",
  "/vacaville/botox",
  "/vacaville/chemical-peels",
  "/vacaville/facials",
  "/vacaville/filler",
  "/vacaville/hydrafacial",
  "/vacaville/laser",
  "/vacaville/microneedling",
];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://experiencerella.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  // Build time is not content modification time. Omitting lastmod keeps the
  // checked-in sitemap reproducible and avoids sending crawlers a false signal.
  autoLastmod: false,
  exclude: [
    "/studio",
    "/studio/**",
    "/booking",
    "/events",
    "/upcoming-events",
    "/giveaway-terms-and-conditions",
    "/wpbc-booking-received",
    "/locations.kml",
    "/services/weight-loss",
    "/opengraph-image",
    "/twitter-image",
  ],
  changefreq: "weekly",
  priority: 0.7,
  // Build discovery can omit dynamic routes. Keep the public canonical surface,
  // especially the homepage, deterministic and let next-sitemap de-duplicate it.
  additionalPaths: async (config) =>
    Promise.all(publicRoutes.map((path) => config.transform(config, path))),
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/"],
      },
    ],
    additionalSitemaps: [],
  },
  transform: async (config, path) => {
    const priorityMap = {
      "/": 1.0,
      "/services": 0.9,
      "/locations/napa": 0.9,
      "/locations/vacaville": 0.9,
      "/napa/botox": 0.9,
      "/napa/facials": 0.9,
      "/vacaville/botox": 0.9,
      "/vacaville/filler": 0.9,
      "/vacaville/laser": 0.9,
      "/vacaville/facials": 0.9,
      "/vacaville/hydrafacial": 0.9,
      "/vacaville/chemical-peels": 0.9,
      "/vacaville/microneedling": 0.9,
      "/contact": 0.8,
      "/about": 0.8,
      "/team": 0.8,
      "/membership": 0.8,
      "/private-parties": 0.8,
      "/payment-plans": 0.7,
      "/cancellation-policy": 0.7,
    };

    return {
      loc: path,
      changefreq: path.startsWith("/blog") ? "daily" : config.changefreq,
      priority:
        priorityMap[path] ??
        (path.startsWith("/services/") ? 0.8 : config.priority),
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

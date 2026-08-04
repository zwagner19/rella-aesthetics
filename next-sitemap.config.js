/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://experiencerella.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: [
    "/studio",
    "/studio/**",
    "/book",
    "/booking",
    "/giveaway-terms-and-conditions",
    "/locations.kml",
    "/opengraph-image",
    "/twitter-image",
  ],
  changefreq: "weekly",
  priority: 0.7,
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
      "/services/weight-loss": 0.9,
      "/locations/napa": 0.9,
      "/locations/vacaville": 0.9,
      "/napa/botox": 0.9,
      "/napa": 0.9,
      "/napa/filler": 0.9,
      "/napa/laser": 0.9,
      "/napa/hydrafacial": 0.9,
      "/napa/hyperhidrosis": 0.9,
      "/vacaville/botox": 0.9,
      "/vacaville/filler": 0.9,
      "/contact": 0.8,
      "/about": 0.8,
      "/membership": 0.8,
      "/cancellation-policy": 0.7,
    };

    return {
      loc: path,
      changefreq:
        path.startsWith("/blog") ? "daily" : config.changefreq,
      priority: priorityMap[path] ?? (path.startsWith("/services/") ? 0.8 : config.priority),
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};

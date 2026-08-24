import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep sharp as a native external so Vercel can load libvips correctly.
  serverExternalPackages: ["sharp"],

  images: {
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
    proxyClientMaxBodySize: "4mb",
  },


  /**
   * Host-aware response headers for the campaign route.
   *
   * TWO separate concerns, deliberately not conflated:
   *
   * 1. `X-Rella-Origin: next-marketing-wave3` — an unconditional marker on the
   *    campaign HTML. The release runbook and the edge Worker use it to tell the
   *    Next.js document apart from the WordPress fallback WITHOUT scraping
   *    visible text, which would break the moment copy changes.
   *
   * 2. `X-Robots-Tag: noindex` for DIRECT `*.vercel.app` requests only.
   *    The three Vercel aliases currently serve crawlable duplicates of the
   *    marketing site (risk R-30). This makes them noindex at the transport
   *    layer while leaving the page's own `index, follow` meta intact, because
   *    the FUTURE public response must remain indexable. The `has` host matcher
   *    means the header is attached only when the request arrives on a
   *    `.vercel.app` host — never on `experiencerella.com`.
   *
   *    THREAT MODEL for the public path. Cloudflare will fetch this origin using
   *    its `*.vercel.app` hostname, so the alias-only `noindex` WILL be present
   *    on the upstream response. The Worker therefore strips that one header for
   *    the exact public HTML response, and only after it has verified both
   *    `X-Rella-Origin` and the expected public canonical. That ordering matters:
   *    a stray upstream response that is not our page can never have its noindex
   *    removed. The alternative — a shared-secret header contract — was rejected
   *    as the primary mechanism because it puts a credential in edge config for
   *    a page that is entirely public anyway; the marker+canonical assertion
   *    gives the same protection against mis-proxying without a secret to leak
   *    or rotate. The residual risk is that anyone can call the alias directly
   *    and see the page — which is already true and is exactly what the noindex
   *    addresses.
   */
  async headers() {
    return [
      {
        source: "/napa/botox",
        headers: [{ key: "X-Rella-Origin", value: "next-marketing-wave3" }],
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<vercelhost>.*\\.vercel\\.app)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },

  async redirects() {
    return [
      // Old WordPress → new Next.js routes
      { source: "/treatments/", destination: "/services", permanent: true },
      { source: "/treatments", destination: "/services", permanent: true },
      { source: "/botox/", destination: "/services/botox", permanent: true },
      { source: "/botox", destination: "/services/botox", permanent: true },
      { source: "/dermal-fillers/", destination: "/services/dermal-fillers", permanent: true },
      { source: "/dermal-fillers", destination: "/services/dermal-fillers", permanent: true },
      { source: "/weight-loss/", destination: "/services/weight-loss", permanent: true },
      { source: "/weight-loss", destination: "/services/weight-loss", permanent: true },
      { source: "/iv-hydration/", destination: "/services/iv-hydration", permanent: true },
      { source: "/iv-hydration", destination: "/services/iv-hydration", permanent: true },
      { source: "/laser-treatments/", destination: "/services/laser-treatments", permanent: true },
      { source: "/laser-treatments", destination: "/services/laser-treatments", permanent: true },
      { source: "/membership/", destination: "/membership", permanent: true },
      { source: "/upcoming-events/", destination: "/", permanent: true },
      { source: "/upcoming-events", destination: "/", permanent: true },
      { source: "/private-parties/", destination: "/contact", permanent: true },
      { source: "/private-parties", destination: "/contact", permanent: true },
      { source: "/testimonials/", destination: "/gallery", permanent: true },
      { source: "/testimonials", destination: "/gallery", permanent: true },
      { source: "/about/", destination: "/about", permanent: true },
      { source: "/contact/", destination: "/contact", permanent: true },
      { source: "/privacy-policy/", destination: "/privacy-policy", permanent: true },
    ];
  },
};

export default nextConfig;

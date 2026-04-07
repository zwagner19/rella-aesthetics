import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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

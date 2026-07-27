import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/integrations/GoogleAnalytics";
import { MetaPixel } from "@/components/integrations/MetaPixel";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rella Aesthetics Med Spa | Vacaville & Napa CA",
    template: "%s | Rella Aesthetics",
  },
  description:
    "Northern California's luxury med spa offering Botox, dermal fillers, medical weight loss, laser treatments, and advanced skin care in Vacaville and Napa.",
  metadataBase: new URL("https://experiencerella.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rella Aesthetics",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <head>
        <GoogleAnalytics />
        <MetaPixel />
      </head>
      {/*
        The root layout owns only the document, the font, and the
        marketing-root analytics. Site chrome (SkipNav / Header / MobileNav /
        Footer / GHL chat) lives in the `(site)` route group, so the `(campaign)`
        group can render the focused B01 shell instead of hiding chrome with CSS.
        Both groups keep their URLs unchanged — route groups are path-invisible.
      */}
      <body className="min-h-screen flex flex-col font-sans text-silver-dark bg-white">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipNav } from "@/components/layout/SkipNav";
import { GhlChatWidget } from "@/components/integrations/GhlChatWidget";
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
      <body className="min-h-screen flex flex-col font-sans text-silver-dark bg-white">
        <SkipNav />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <GhlChatWidget />
      </body>
    </html>
  );
}

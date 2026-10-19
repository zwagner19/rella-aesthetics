import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { BookingExperienceProvider } from "@/components/guided-booking/BookingExperienceProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

// Reuse the approved two-location artwork through Next's image optimizer;
// social crawlers should not have to download the 5.9 MB source PNG.
const socialImage = "/_next/image?url=%2Fimages%2Fclinic%2Frella_two_locations_with_text_4k.png&w=1200&q=75";

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
    images: [{
      url: socialImage,
      width: 1200,
      height: 675,
      alt: "Rella Aesthetics in Napa and Vacaville",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: [socialImage],
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
      {/*
        The root layout owns ONLY the document and the font — no analytics.
        All routes can open the in-site booking document. Marketing loaders
        remain structurally absent, independent of environment configuration.
        Site chrome (SkipNav / Header / MobileNav / Footer) lives in the `(site)`
        route group, so the `(campaign)` group
        can render the focused B01 shell instead of hiding chrome with CSS.
        Both groups keep their URLs unchanged — route groups are path-invisible.
      */}
      <body className="min-h-screen flex flex-col font-sans text-silver-dark bg-white">
        <BookingExperienceProvider>{children}</BookingExperienceProvider>
      </body>
    </html>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipNav } from "@/components/layout/SkipNav";
import { GhlChatWidget } from "@/components/integrations/GhlChatWidget";
import { GoogleAnalytics } from "@/components/integrations/GoogleAnalytics";
import { MetaPixel } from "@/components/integrations/MetaPixel";
import { ConversionTracker } from "@/components/integrations/ConversionTracker";
import { MobileConversionBar } from "@/components/layout/MobileConversionBar";

/**
 * Global site chrome for every ordinary marketing route.
 *
 * This is the layout that used to live in the root. It was moved here so that
 * the `(campaign)` group can present the accepted B01 shell instead — a policy
 * the route tree now states directly, rather than something global CSS hides
 * after the fact. Every route in this group keeps its existing URL, chrome, and
 * behaviour; route groups do not appear in the path.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {/* Direct GA + Meta belong to ordinary marketing routes ONLY. Moved here
          from the root layout so the campaign group cannot inherit them. */}
      <GoogleAnalytics />
      <MetaPixel />
      <ConversionTracker />
      <SkipNav />
      <Header />
      <main id="main" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      <Footer />
      <GhlChatWidget />
      <MobileConversionBar />
    </>
  );
}

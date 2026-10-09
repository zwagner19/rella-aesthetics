import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipNav } from "@/components/layout/SkipNav";
import { MobileConversionBar } from "@/components/layout/MobileConversionBar";
import { AestheticsAttributionConsent } from "@/components/integrations/AestheticsAttributionConsent";
import { AdLandingTrackerGuard } from "@/components/integrations/AdLandingTrackerGuard";

/**
 * Ad landing routes: the clinic location pages and clinic-specific treatment
 * pages that Google Ads may send visitors to.
 *
 * Same site chrome as `(site)`, with two deliberate differences:
 *
 *  1. NO third-party browser analytics, advertising, or chat scripts (GA4,
 *     Meta Pixel, GHL chat), for every visitor. Treatment-specific page
 *     addresses and paid-click identifiers must never reach ad platforms
 *     through a browser tag. This mirrors the live WordPress privacy plugin on
 *     the Napa pages.
 *  2. The ad-measurement consent panel. It stays hidden unless the visitor
 *     arrived with exactly one Google click identifier (or has an existing
 *     choice). With "Allow" it sends one bounded payload to Rella's first-party
 *     booking endpoint; that is the complete measurement boundary.
 *
 * The approved path list lives in `AESTHETICS_AD_LANDING_PAGES`; a page added
 * to this group must also be added there (enforced by tests).
 */
export default function AdLandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SkipNav />
      <Header />
      <main
        id="main"
        className="flex-1 bg-ivory pb-20 pt-[72px] lg:pt-[84px] xl:pb-0"
        data-site-motion="true"
      >
        {children}
      </main>
      <Footer />
      <MobileConversionBar />
      <AdLandingTrackerGuard />
      <AestheticsAttributionConsent />
    </>
  );
}

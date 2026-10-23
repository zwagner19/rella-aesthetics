import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipNav } from "@/components/layout/SkipNav";
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
      {/* Booking opens in this document on every site route. Keep browser
          marketing and chat loaders outside this document for the controlled
          launch, regardless of configured integration IDs. Existing paid
          landing pages retain their bounded first-party attribution path. */}
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
    </>
  );
}

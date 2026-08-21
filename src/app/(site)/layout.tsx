import { headers } from "next/headers";
import { AestheticsAttributionHandoff } from "@/components/integrations/AestheticsAttributionHandoff";
import { CookieYesAttributionConsentBridge } from "@/components/integrations/CookieYesAttributionConsentBridge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipNav } from "@/components/layout/SkipNav";
import { GhlChatWidget } from "@/components/integrations/GhlChatWidget";
import { GoogleAnalytics } from "@/components/integrations/GoogleAnalytics";
import { MetaPixel } from "@/components/integrations/MetaPixel";
import { ConversionTracker } from "@/components/integrations/ConversionTracker";
import { WeightLossAttributionHandoff } from "@/components/integrations/WeightLossAttributionHandoff";
import { ClarityAnalytics } from "@/components/integrations/ClarityAnalytics";
import { MobileConversionBar } from "@/components/layout/MobileConversionBar";
import { PreviewClinicChooser } from "@/components/preview/PreviewClinicChooser";
import { isPreviewExperienceHost } from "@/lib/preview-experience";
import { isWeightLossHost } from "@/lib/site-hosts";
import {
  getClarityProjectId,
  isClarityEligibleHost,
  isClarityEnabled,
} from "@/lib/clarity-policy";

/**
 * Global site chrome for every ordinary marketing route.
 *
 * This is the layout that used to live in the root. It was moved here so that
 * the `(campaign)` group can present the accepted B01 shell instead — a policy
 * the route tree now states directly, rather than something global CSS hides
 * after the fact. Every route in this group keeps its existing URL, chrome, and
 * behaviour; route groups do not appear in the path.
 */
export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const host = (await headers()).get("host");
  const weightLossExperience = isWeightLossHost(host);
  const previewExperience =
    !weightLossExperience && isPreviewExperienceHost(host);
  const clarityProjectId = getClarityProjectId(process.env.CLARITY_PROJECT_ID);
  const clarityAvailable =
    isClarityEnabled(process.env.CLARITY_ENABLED) &&
    Boolean(clarityProjectId) &&
    isClarityEligibleHost(host);

  return (
    <>
      <CookieYesAttributionConsentBridge />
      <AestheticsAttributionHandoff />
      <WeightLossAttributionHandoff />
      {/* Direct analytics and third-party chat belong to aesthetics routes only. */}
      {!weightLossExperience ? (
        <>
          <GoogleAnalytics />
          <MetaPixel />
          <ConversionTracker />
        </>
      ) : null}
      <SkipNav />
      <Header weightLossExperience={weightLossExperience} />
      <main
        id="main"
        className="flex-1 pb-20 xl:pb-0"
        data-preview-motion={previewExperience ? "true" : undefined}
      >
        {children}
      </main>
      <Footer
        weightLossExperience={weightLossExperience}
        clarityPreferencesAvailable={clarityAvailable}
      />
      {!weightLossExperience ? <GhlChatWidget /> : null}
      <MobileConversionBar weightLossExperience={weightLossExperience} />
      {previewExperience ? <PreviewClinicChooser /> : null}
      {clarityAvailable && clarityProjectId ? (
        <ClarityAnalytics projectId={clarityProjectId} />
      ) : null}
    </>
  );
}

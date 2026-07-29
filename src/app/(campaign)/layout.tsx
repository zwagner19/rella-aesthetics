import { CampaignGtm, CampaignGtmNoScript } from "@/components/integrations/CampaignGtm";

/**
 * Campaign routes — policy layout.
 *
 * Deliberately renders NO general-site navigation, hamburger menu, generic
 * footer, or floating chat widget. Three reasons this is a policy and not a
 * preference:
 *
 *  1. The site header/MobileNav "Book Consultation" and the footer "Book Online"
 *     both resolve to the GENERIC Boulevard widget. On a Napa-Tox campaign page
 *     that is a competing booking destination sitting beside the canonical one.
 *  2. A floating chat bubble sits on top of the mobile sticky Book/Call bar.
 *  3. The accepted B01 design is a focused campaign page: logo, phone, one
 *     primary action.
 *
 * It is a FRAGMENT, not a `<main>` wrapper. The campaign header and footer are
 * page-level landmarks and must be siblings of `<main>`, not descendants of it;
 * wrapping here would nest them inside `<main>` and produce a document with no
 * top-level banner or contentinfo. Each campaign page owns its own
 * skip-link / header / main / footer / sticky-actions shell.
 *
 * GTM is mounted HERE and only here. When this route is proxied onto the public
 * WordPress host the browser gets the Vercel document, which does not inherit
 * WordPress's GTM — so campaign routes must carry their own container or public
 * marketing measurement is lost. It renders nothing unless `NEXT_PUBLIC_GTM_ID`
 * is set, so the ordinary site and today's staging are unchanged. GTM is a tag
 * container only: no GHL chat widget appears on this page.
 */
export default function CampaignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CampaignGtmNoScript />
      <CampaignGtm />
      {children}
    </>
  );
}

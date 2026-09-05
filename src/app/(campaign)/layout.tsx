import { AestheticsAttributionConsent } from "@/components/integrations/AestheticsAttributionConsent";

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
 * The exact-Napa pilot deliberately loads no third-party browser analytics,
 * advertising, chat, or call-tracking stack, even after consent. The consent
 * component may send one bounded, consented click payload to Rella's first-party
 * booking endpoint; that is the complete measurement boundary.
 */
export default function CampaignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <AestheticsAttributionConsent />
    </>
  );
}

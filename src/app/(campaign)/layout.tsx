/**
 * Campaign routes — the accepted focused B01 shell.
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
 * Each campaign page supplies its own header, footer, and sticky actions.
 */
export default function CampaignLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main id="main" className="flex-1">{children}</main>;
}

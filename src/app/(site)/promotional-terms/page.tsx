import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promotional Terms & Conditions",
  description: "Review the promotional terms and conditions for Rella Aesthetics, including exclusive offers, treatment packages, giveaways, eligibility, and redemption policies.",
  alternates: { canonical: "/promotional-terms" },
};

// Owner-supplied policy text. Dates remain placeholders until approved.
const sections = [
  {
    "heading": "1. General Promotional Terms",
    "paragraphs": [
      "Promotional offers are available only during the dates and times specified in the corresponding advertisement, event, email, or announcement.",
      "All offers are subject to stated eligibility requirements, appointment availability, applicable location restrictions, and the terms of the individual promotion.",
      "Promotional pricing applies only to the products, treatments, quantities, and services expressly included in the offer. Services, products, or upgrades not specifically included may incur additional charges, which will be disclosed before purchase or treatment.",
      "Unless otherwise stated, promotions may not be combined with other discounts, memberships, loyalty rewards, promotional credits, or special offers.",
      "Rella Aesthetics reserves the right to correct genuine typographical or administrative errors and to modify, suspend, or discontinue future promotions as permitted by law. Changes will not retroactively eliminate rights arising from a completed, valid purchase."
    ]
  },
  {
    "heading": "2. Medical Eligibility & Provider Discretion",
    "paragraphs": [
      "All medical and aesthetic treatments are subject to an appropriate consultation, medical evaluation, and determination of eligibility by a qualified healthcare provider.",
      "Purchasing, booking, or winning a treatment does not guarantee that a particular procedure, product, medication, dosage, or treatment plan will be medically appropriate or provided.",
      "Rella Aesthetics' licensed medical professionals retain independent clinical judgment regarding treatment recommendations, product selection, dosage, technique, and patient safety.",
      "A provider may recommend an alternative treatment, postpone treatment, or decline to perform a service when medically indicated.",
      "If a purchased treatment cannot be provided due to medical ineligibility, Rella Aesthetics will discuss any appropriate alternatives and applicable refund or credit options consistent with the purchase agreement and governing law. No substitute treatment will be performed without the patient's informed consent."
    ]
  },
  {
    "heading": "3. Injectable Treatments & Product Selection",
    "paragraphs": [
      "Promotional offers involving dermal fillers, neuromodulators, biostimulators, or other injectable treatments apply only to the products and quantities expressly included in the promotion.",
      "When a promotion identifies a general treatment category rather than a specific brand or formulation, the eligible product options will be determined by Rella Aesthetics and disclosed to the patient before purchase or treatment.",
      "The treating provider will recommend an appropriate product based on the patient's anatomy, goals, medical history, and clinical evaluation.",
      "A promotional offer for one syringe of filler does not automatically include every filler brand, formulation, or product offered by Rella Aesthetics.",
      "Premium products, additional syringes, additional units, and treatments outside the advertised offer may require additional payment, with the patient's prior approval.",
      "Rella Aesthetics does not guarantee a specific aesthetic result. Outcomes vary by individual."
    ]
  },
  {
    "heading": "4. Treatment Packages & Programs",
    "paragraphs": [
      "Promotional packages include only the treatments, services, products, and quantities expressly listed in the applicable offer.",
      "Package services may require multiple appointments, specific treatment intervals, medical clearance, or completion within an identified redemption period.",
      "Treatment schedules and clinical recommendations may be adjusted based on individual medical needs and provider judgment.",
      "Medical weight-loss, wellness, and other medically supervised programs require a clinical evaluation. Prescription medications, laboratory testing, and additional medical services are included only when expressly identified in the offer or program agreement.",
      "Participation in a program does not guarantee a particular weight-loss outcome, body measurement, treatment response, or other result.",
      "Any package expiration, cancellation terms, unused-service policies, or refund conditions will be governed by the applicable written purchase agreement and California law."
    ]
  },
  {
    "heading": "5. Booking, Payment & Redemption",
    "paragraphs": [
      "Each promotion will identify its applicable booking deadline, payment or deposit requirements, and redemption period.",
      "When a promotion requires booking by a specific deadline, the appointment must be confirmed through an accepted Rella Aesthetics booking method by that deadline.",
      "Booking a promotional appointment does not necessarily constitute payment. Any required deposit or prepayment will be disclosed before confirmation.",
      "Appointments scheduled after a promotional deadline do not qualify for expired promotional pricing unless the specific promotion expressly permits later booking.",
      "Rescheduling, cancellations, late arrivals, and missed appointments are subject to Rella Aesthetics' separately disclosed appointment policies and applicable law."
    ]
  },
  {
    "heading": "6. Refunds, Credits & Transfers",
    "paragraphs": [
      "Refunds, credits, cancellations, and transfers are subject to the terms disclosed at the time of purchase and applicable California law.",
      "Promotional purchases are not automatically refundable or transferable solely because the purchaser changes their mind or prefers a different treatment.",
      "Where Rella Aesthetics is unable to provide a purchased service, or a patient is medically ineligible, the appropriate resolution will be determined in accordance with the purchase agreement, services already provided, and applicable legal requirements.",
      "Nothing in these terms limits a patient's nonwaivable statutory rights."
    ]
  },
  {
    "heading": "7. Giveaways, Contests & Prizes",
    "paragraphs": [
      "Giveaways, sweepstakes, and contests are subject to the specific eligibility criteria, entry instructions, deadlines, prize descriptions, winner-selection procedures, and official rules published for each promotion.",
      "For chance-based sweepstakes, no purchase or payment is necessary to enter or win, and making a purchase will not improve the chances of winning.",
      "Prizes have no cash redemption value unless expressly stated otherwise.",
      "Treatment prizes are subject to medical eligibility and provider approval. A winner who is not medically eligible for a treatment will be handled according to the substitution or alternative-prize provisions disclosed in that giveaway's official rules.",
      "Winners must comply with the claim deadlines and verification requirements specified in the applicable official rules.",
      "Social media giveaways are not sponsored, endorsed, administered by, or associated with Instagram, Facebook, or other platforms unless expressly stated otherwise.",
      "Each giveaway's official rules govern in the event of any conflict with these general promotional terms."
    ]
  },
  {
    "heading": "8. Results, Photography & Advertising",
    "paragraphs": [
      "Individual results vary. No treatment, service, or program guarantees a specific cosmetic or medical outcome.",
      "Before-and-after photographs and testimonials represent individual patient experiences and should not be interpreted as guarantees of similar results.",
      "Patient photographs and testimonials will be used in accordance with applicable privacy, consent, and advertising requirements."
    ]
  },
  {
    "heading": "9. Errors, Availability & Changes",
    "paragraphs": [
      "Rella Aesthetics reserves the right, to the extent permitted by law, to correct genuine errors, address technical problems, and establish reasonable procedures for administering promotions fairly and consistently.",
      "Product shortages, scheduling constraints, or other unforeseen circumstances may affect treatment availability. If an advertised service cannot be provided as purchased, Rella Aesthetics will communicate the available options and comply with applicable consumer-protection requirements.",
      "Rella Aesthetics will not substitute a materially different product or treatment without appropriate disclosure and patient consent."
    ]
  },
  {
    "heading": "10. Questions & Contact",
    "paragraphs": [
      "For questions regarding a promotional offer, product eligibility, booking requirements, or redemption, please contact Rella Aesthetics before purchasing or booking.",
      "Rella Aesthetics",
      "Vacaville & Napa, California",
      "Phone: (707) 358-2928",
      "These general promotional terms apply together with the specific terms disclosed in each applicable offer. In the event of a conflict, the more specific promotion terms control, except where prohibited by law."
    ]
  }
] as const;

export default function PromotionalTermsPage() {
  return (
    <article className="py-16 md:py-24" aria-labelledby="promotional-terms-heading">
      <div className="mx-auto max-w-[848px] px-6 md:px-8">
        <header className="mb-12 md:mb-16">
          <p className="rella-editorial-eyebrow mb-4">RELLA AESTHETICS</p>
          <h1 id="promotional-terms-heading" className="text-3xl font-medium leading-tight tracking-tight text-ink md:text-4xl lg:text-5xl">
            Promotional Terms &amp; Conditions
          </h1>
          <p className="mt-6 text-base font-light leading-relaxed text-silver md:text-lg">
            Important information about our exclusive offers, special pricing, giveaways, and promotional treatments.
          </p>
          <p className="mt-8 text-sm leading-relaxed text-ink">
            Rella Aesthetics | Vacaville &amp; Napa, California
          </p>
          <p className="mt-2 text-sm leading-relaxed text-silver">
            Effective Date: [INSERT DATE]
          </p>
        </header>
        <div className="space-y-10 text-base font-light leading-relaxed text-ink md:space-y-12 md:text-lg">
          <div className="space-y-5">
            <p>{"At Rella Aesthetics, we love offering our patients exclusive promotions, special pricing, giveaways, and limited-time opportunities. To ensure transparency, consistency, and the highest standards of patient care, the following terms and conditions apply to promotional offers issued by Rella Aesthetics unless otherwise stated in the specific promotion."}</p>
            <p>{"By participating in or purchasing an eligible promotion, patients acknowledge the applicable terms and conditions."}</p>
          </div>
          {sections.map((section, index) => (
            <section key={section.heading} aria-labelledby={`promotional-section-${index + 1}`}>
              <h2 id={`promotional-section-${index + 1}`} className="mb-5 text-xl font-medium leading-snug text-ink md:text-2xl">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {paragraph === "Phone: (707) 358-2928" ? (
                      <>Phone: <a href="tel:+17073582928" className="underline underline-offset-4 hover:opacity-70">(707) 358-2928</a></>
                    ) : paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
          <p className="text-sm text-silver">Last Updated: [INSERT DATE]</p>
        </div>
      </div>
    </article>
  );
}

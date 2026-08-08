import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grand Opening Giveaway Terms",
  description: "Preserved terms for Rella Aesthetics' October 2024 Grand Opening Giveaway.",
  alternates: { canonical: "/giveaway-terms-and-conditions" },
  robots: { index: false, follow: true },
};

const headingClass = "font-medium text-xl text-silver-dark mt-8";

export default function GiveawayTermsPage() {
  return (
    <>
      <section className="py-24 bg-rose-blush">
        <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
          <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-4">
            Preserved public record · October 2024
          </p>
          <h1 className="font-bold text-3xl md:text-4xl tracking-[0.06em] uppercase text-rose-text mb-5">
            Grand Opening Giveaway
          </h1>
          <p className="text-lg font-light text-silver max-w-[680px] leading-relaxed">
            Terms and conditions published for Rella Aesthetics&apos; October 2024 promotion.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[800px] px-6 md:px-8 lg:px-12">
          <div className="prose prose-lg text-silver max-w-none space-y-6">
            <h2 className="font-medium text-2xl text-silver-dark">Terms and Conditions</h2>

            <h3 className={headingClass}>1. Eligibility</h3>
            <p>
              The giveaway is open to legal residents of the United States who are 18 years or
              older at the time of entry. Employees of Rella Aesthetics, their immediate family
              members, and individuals residing in the same household as an employee are not
              eligible to participate.
            </p>

            <h3 className={headingClass}>2. Promotion Period</h3>
            <p>
              The promotion begins on [10/5/24] and ends when the prize is claimed by a participant,
              which will occur after Rella Aesthetics posts the final clue on Instagram. 12-24
              hours advance notice of the general location (city) and the prize will be provided to
              everyone before the hunt begins.
            </p>

            <h3 className={headingClass}>3. How to Enter</h3>
            <p>Participants must:</p>
            <ul>
              <li>Tag a friend (or friends) in the comments of the designated giveaway Instagram post.</li>
              <li>Share the giveaway video to their Instagram Story and tag @experiencerella.</li>
            </ul>

            <h3 className={headingClass}>4. Close Friends List</h3>
            <p>
              By completing these steps, participants will be added to the Close Friends list on
              Instagram, giving them a 15-30 minute head start on the final clue to find the prize.
            </p>

            <h3 className={headingClass}>5. How to Win</h3>
            <ul>
              <li>Rella Aesthetics will hide a box at a specified location in the city mentioned in the general notice.</li>
              <li>Everyone will receive 12-24 hours advance notice of the general area and what the prize is.</li>
              <li>Close Friends will get a 15-30 minute head start before the final clue is posted publicly on Instagram.</li>
              <li>The first participant to physically find the hidden box and follow the instructions inside will win the prize.</li>
            </ul>

            <h3 className={headingClass}>6. Prize</h3>
            <p>See the Prize Terms and Conditions section below.</p>

            <h3 className={headingClass}>7. Winner Notification</h3>
            <p>
              The winner is the first participant to physically locate the hidden box, as specified
              by Rella Aesthetics. The winner will be asked to provide proof of finding the box via
              a direct message to Rella Aesthetics on Instagram.
            </p>

            <h3 className={headingClass}>8. Publicity</h3>
            <p>
              By accepting the prize, the winner agrees to allow Rella Aesthetics to use their name,
              likeness, and Instagram handle for promotional purposes, without additional
              compensation, unless prohibited by law.
            </p>

            <h3 className={headingClass}>9. Disqualification</h3>
            <p>
              Rella Aesthetics reserves the right to disqualify any participant who violates these
              terms, engages in fraudulent activity, or behaves in a manner deemed inappropriate by
              the company.
            </p>

            <h3 className={headingClass}>10. Liability Release</h3>
            <p>
              By participating in the event, entrants agree to release and hold harmless Rella
              Aesthetics, its affiliates, and Instagram from any claims, damages, or liabilities
              arising from participation in the giveaway or the acceptance, use, or misuse of the
              prize.
            </p>

            <h3 className={headingClass}>11. Instagram Disclaimer</h3>
            <p>
              This promotion is not sponsored, endorsed, or administered by, or associated with
              Instagram. By participating, entrants agree to release Instagram from all liability
              related to this promotion.
            </p>

            <h3 className={headingClass}>12. Privacy</h3>
            <p>
              Participants&apos; personal data (e.g., Instagram handles) will be collected solely for
              the purpose of administering the giveaway and will not be shared with third parties
              without consent.
            </p>

            <h3 className={headingClass}>13. General</h3>
            <p>
              Rella Aesthetics reserves the right to modify or cancel this promotion at any time.
              Any changes will be updated via the original Instagram post or Close Friends story.
              The promotion is void where prohibited by law.
            </p>

            <h2 className="font-medium text-2xl text-silver-dark mt-12">
              Prize Terms and Conditions
            </h2>

            <h3 className={headingClass}>1. HydraFacials for a Year</h3>
            <p><strong className="text-silver-dark">Prize:</strong></p>
            <ul>
              <li>The winner will receive 12 HydraFacials (one per month for a year) at Rella Aesthetics, valued at $3,000.</li>
              <li>The prize is non-transferable and can only be used by the winner.</li>
              <li>Missed treatments cannot be rolled over or accumulated for future months.</li>
              <li>The prize has no cash value and cannot be exchanged for other services or products.</li>
            </ul>
            <p><strong className="text-silver-dark">Redemption:</strong></p>
            <ul>
              <li>The winner must book and receive one HydraFacial per month. Appointments are subject to availability.</li>
              <li>If an appointment is missed without proper notice, the monthly treatment will be forfeited.</li>
              <li>Can be redeemed at any Rella Aesthetics location.</li>
            </ul>

            <h3 className={headingClass}>2. B12 Shots for Life (2 Winners)</h3>
            <p><strong className="text-silver-dark">Prize:</strong></p>
            <ul>
              <li>Each winner will receive one B12 shot per month for as long as Rella Aesthetics offers the service.</li>
              <li>The prize is non-transferable and can only be used by the winner.</li>
              <li>The prize has no cash value and cannot be exchanged for any other product or service.</li>
            </ul>
            <p><strong className="text-silver-dark">Redemption:</strong></p>
            <ul>
              <li>The winner is entitled to one B12 shot per calendar month.</li>
              <li>If a shot is missed in a given month, it cannot be rolled over to future months.</li>
              <li>The prize is valid as long as Rella Aesthetics is open and offers B12 shots.</li>
            </ul>

            <h3 className={headingClass}>3. At-Home IV Party for 8 People</h3>
            <p><strong className="text-silver-dark">Prize:</strong></p>
            <ul>
              <li>The winner will receive an At-Home IV Therapy Party for up to 8 people, including the winner, valued at $[2400].</li>
              <li>The prize is non-transferable and can only be used for one event.</li>
              <li>If fewer than 8 people receive IV therapy, the remaining treatments cannot be carried over or reused.</li>
            </ul>
            <p><strong className="text-silver-dark">Redemption:</strong></p>
            <ul>
              <li>The event must be scheduled in advance, and availability is subject to the location and travel range of Rella Aesthetics.</li>
              <li>Missed appointments or changes to the guest list must be communicated in advance, but the total number of treatments will not exceed 8.</li>
            </ul>

            <h3 className={headingClass}>4. Full Body Transformation ft. Rella Weight Loss + Body Sculpt</h3>
            <p><strong className="text-silver-dark">Prize:</strong></p>
            <ul>
              <li>The winner will receive a six-month weight loss program featuring an injectable and a Body Sculpt or Body Tone Package of 10 treatments, valued at $8000.</li>
              <li>The prize is non-transferable and can only be used by the winner.</li>
              <li>The Rella Weight Loss program includes the medication but does not cover the cost of blood work or other qualifying medical tests.</li>
            </ul>
            <p><strong className="text-silver-dark">Redemption:</strong></p>
            <ul>
              <li>The winner must medically qualify for the Semaglutide program.</li>
              <li>The Body Sculpt or Body Tone treatments must be scheduled and completed within the six-month period.</li>
              <li>If appointments are missed without proper notice, the treatments may be forfeited.</li>
            </ul>

            <h3 className={headingClass}>5. Tox for a Year (Grand Prize)</h3>
            <p><strong className="text-silver-dark">Prize:</strong></p>
            <ul>
              <li>The winner will receive Botox treatments for a year (up to 50 units every 3 months), valued at $2800.</li>
              <li>The prize is non-transferable and can only be used by the winner.</li>
              <li>Treatments are limited to the forehead, 11&apos;s, and crow&apos;s feet areas using Dysport only.</li>
              <li>Treatments are subject to the discretion of Rella Aesthetics&apos; injectors, based on medical considerations.</li>
            </ul>
            <p><strong className="text-silver-dark">Redemption:</strong></p>
            <ul>
              <li>The prize entitles the winner to a maximum of 50 units every three months.</li>
              <li>The treatments must be spaced out evenly (every three months) and cannot be rolled over or combined for larger treatments.</li>
              <li>Missed appointments without proper notice will result in forfeiture of that session.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

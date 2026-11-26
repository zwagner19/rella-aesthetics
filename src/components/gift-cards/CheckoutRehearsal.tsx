"use client";
import { useState } from "react";
import { BlackFridayLanding } from "./BlackFridayLanding";
import { createPackageClient, PackageRequestError, type PackageSessionStatus } from "@/lib/guided-booking/package-client";
import { blackFridayDeepLink, rellaPackageKey, type ClinicId, type GiftCardOffer } from "@/lib/gift-cards/config";
import s from "./gift.module.css";

const SCENARIOS = ["success", "pending", "wrong-price", "declined", "pass-unavailable", "email-uncertain"] as const;
type Scenario = (typeof SCENARIOS)[number];
/** Exercises the actual checkout and gifting components, not a separate visual
 * mock. This module has no fetch, database, Boulevard or email dependency. */
export function CheckoutRehearsal({ params }: { params: Record<string, string | string[] | undefined> }) {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS.includes(params.scenario as Scenario) ? params.scenario as Scenario : "success");
  const [attempt, setAttempt] = useState(0);
  function client(offer: GiftCardOffer, clinic: ClinicId) {
    let status: PackageSessionStatus = { state: "NONE" };
    const offering = { id: rellaPackageKey(offer.id, clinic), displayName: offer.title, description: "Synthetic preview only", benefitGroups: [] };
    const review = { offering, totalCents: scenario === "wrong-price" ? offer.valueCents : offer.priceCents, currency: "USD" as const, needsCard: true, cardFrameOrigin: "https://book.experiencerella.com" };
    return createPackageClient({
      status: async () => status,
      listOfferings: async () => [offering],
      reviewPurchase: async () => review,
      preparePurchase: async () => review,
      purchase: async () => {
        if (scenario === "declined") throw new PackageRequestError("Simulated card declined. No charge was attempted.", true);
        if (scenario === "pending") { status = { state: "PENDING" }; return { status: "pending" }; }
        const result = { confirmationId: "synthetic-verified-order", emailSent: false,
          ...(scenario === "pass-unavailable" ? { passPending: true } : { passId: "RELLA-VIP-TEST-2345", giftToken: "x".repeat(43) }) };
        status = { state: "CONFIRMED", ...result };
        return { status: "confirmed", ...result };
      },
    });
  }
  return <>
    <div className={s.demoBanner}>OWNER REVIEW · SIMULATED TRANSACTIONS ONLY · no card data, live charge, pass row or email</div>
    <div className={s.container} style={{ paddingTop: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <label>Test scenario <select aria-label="Test scenario" value={scenario} onChange={e => { setScenario(e.target.value as Scenario); setAttempt(n => n + 1); }}>
        {SCENARIOS.map(value => <option key={value} value={value}>{value.replaceAll("-", " ")}</option>)}
      </select></label>
      <button type="button" className={s.linkBtn} onClick={() => setAttempt(n => n + 1)}>Reset rehearsal</button>
    </div>
    <BlackFridayLanding key={`${scenario}/${attempt}`} checkout="rella" initialSelection={blackFridayDeepLink(params)}
      preview={{ client, gift: async values => scenario === "email-uncertain"
        ? { status: "error", message: "Simulated uncertain delivery. Do not resend; no real email was sent." }
        : { status: "sent", recipientFirstName: values.recipientFirstName },
        later: async () => ({ ok: true, message: "Preview choice saved locally. No real email was sent." }) }} />
  </>;
}

import { offerById, type ClinicId } from "@/lib/gift-cards/config";
import { renderBoulevardConfirmationEmail, renderPurchaserEmail, renderRecipientEmail } from "@/lib/gift-cards/email";

export const dynamic = "force-dynamic";

const PRODUCTION_HOSTS = new Set(["experiencerella.com", "www.experiencerella.com"]);

/**
 * Preview-only rendered email HTML with DEMO fixture data. Nothing is sent.
 * /gift-cards/black-friday/demo/email/recipient | purchaser | purchaser-sent | boulevard-confirmation
 * (boulevard-confirmation takes ?offer=bf26-1000|bf26-2100&clinic=napa|vacaville)
 */
export async function GET(req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const url = new URL(req.url);
  const host = (req.headers.get("host") ?? url.host).toLowerCase().split(":")[0];
  if (process.env.VERCEL_ENV === "production" || PRODUCTION_HOSTS.has(host)) return new Response("Not found", { status: 404 });
  const origin = `${url.protocol}//${req.headers.get("host") ?? url.host}`;
  const assets = { logoUrl: `${origin}/gift-cards/rella-logo-white.png`, passMarkUrl: `${origin}/gift-cards/rella-logo-ink.png` };
  const { kind } = await ctx.params;
  const offer = offerById("bf26-1000")!;
  let html: string;
  if (kind === "recipient") {
    html = renderRecipientEmail(
      {
        passId: "RELLA-VIP-DEMO-2026",
        recipientFirstName: "Ava",
        senderName: "Demo Purchaser",
        message: "A little something just for you. Enjoy some well-deserved Rella time!",
        claimUrl: `${origin}/gift-cards/black-friday/demo#claim-demo`,
      },
      assets,
    ).html;
  } else if (kind === "purchaser" || kind === "purchaser-sent") {
    html = renderPurchaserEmail(
      {
        purchaserFirstName: "Demo",
        offer,
        paidCents: offer.priceCents,
        orderNumber: "DEMO-0001",
        passId: "RELLA-VIP-DEMO-2026",
        gifting:
          kind === "purchaser"
            ? { state: "not-sent", giftUrl: `${origin}/gift-cards/black-friday/demo#gift-link-demo` }
            : { state: "sent", recipientFirstName: "Ava", sentOn: "November 27, 2026" },
      },
      assets,
    ).html;
  } else if (kind === "boulevard-confirmation") {
    const chosen = offerById(url.searchParams.get("offer") ?? "bf26-1000");
    const clinic = url.searchParams.get("clinic") ?? "napa";
    if (!chosen || (clinic !== "napa" && clinic !== "vacaville")) return new Response("Not found", { status: 404 });
    html = renderBoulevardConfirmationEmail(
      { purchaserFirstName: "Demo", offer: chosen, clinicId: clinic as ClinicId, passId: "RELLA-VIP-DEMO-2026" },
      assets,
    ).html;
  } else return new Response("Not found", { status: 404 });
  const banner = `<div style="background:#1A1A1A;color:#fff;font:500 11px/1.4 Arial,sans-serif;letter-spacing:2px;text-align:center;padding:10px;text-transform:uppercase;">DEMO email preview · fixture data · not sent</div>`;
  return new Response(html.replace(/<body([^>]*)>/, `<body$1>${banner}`), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

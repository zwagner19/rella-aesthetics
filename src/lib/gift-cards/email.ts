import {
  BLACK_FRIDAY_2026,
  BOULEVARD_CHECKOUT,
  COPY,
  type ClinicId,
  VIP_EXPERIENCES,
  formatUsd,
  type GiftCardOffer,
} from "./config";

/**
 * Black Friday gift emails. Table layout + inline styles for Gmail, Apple
 * Mail, Outlook (Windows/Mac/web), Yahoo. Poppins via <link> where supported,
 * Helvetica/Arial fallback everywhere else. Pure: values in, {subject, html, text} out.
 */

const FONT = `'Poppins','Helvetica Neue',Helvetica,Arial,sans-serif`;
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap";
const C = {
  rose: "#F7A19A",
  ivory: "#F7F4EF",
  ink: "#1A1A1A",
  charcoal: "#2B2B2B",
  silver: "#64696E",
  rule: "#BFB6AB",
  /** White at ~38% over Rella pink (the gift card's inset hairline), flattened for email. */
  hairline: "#FAC5C0",
  white: "#FFFFFF",
};

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type EmailAssets = {
  /** Absolute https URL to a PNG of the white circle-"r" mark (SVG is blocked by Gmail/Outlook). */
  logoUrl: string;
  /** Same mark in ink (#1A1A1A). Kept for callers; the pink pass now uses the white logo like the gift card. */
  passMarkUrl: string;
};

function shell(opts: { title: string; preheader: string; body: string }): string {
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light">
<title>${esc(opts.title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<!--[if !mso]><!--><link href="${FONT_LINK}" rel="stylesheet"><!--<![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0;mso-table-rspace:0}
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
  a{color:${C.ink}}
  @media (max-width:620px){
    .container{width:100%!important}
    .px{padding-left:24px!important;padding-right:24px!important}
    .h1{font-size:30px!important;line-height:38px!important}
    .pass-inner{padding:22px 18px!important}
    .pid{font-size:12px!important;letter-spacing:0!important}
    .pid-row{font-size:11px!important;letter-spacing:0!important}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.ivory};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ivory};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${C.white};">
${opts.body}
</table>
</td></tr>
</table>
</body>
</html>`;
}

function headerRow(assets: EmailAssets): string {
  return `<tr><td align="center" style="background:${C.rose};padding:28px 24px;">
<img src="${esc(assets.logoUrl)}" width="126" height="48" alt="Rella Aesthetics" style="display:block;width:126px;height:48px;margin:0 auto;">
</td></tr>`;
}

const p = (text: string, extra = "") =>
  `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.charcoal};${extra}">${text}</p>`;

/**
 * The VIP Guest Pass as a bulletproof table (no images required to read it).
 * Same family as the gift card art: Rella pink surface, rounded corners, inset
 * white hairline, white logo top-left, tracked kicker top-right, light display
 * type for RELLA. All text is ink on pink for contrast.
 */
export function passTable(passId: string, assets: EmailAssets): string {
  const perks = VIP_EXPERIENCES.map(
    (e) => `<tr><td valign="top" width="18" style="padding:0 0 9px;font-family:${FONT};font-size:12px;line-height:20px;color:${C.white};">&#9679;</td><td style="padding:0 0 9px;font-family:${FONT};font-size:13px;line-height:20px;font-weight:500;color:${C.white};">${esc(e.label)}</td></tr>`,
  ).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.rose}" style="background:${C.rose};border-radius:18px;">
<tr><td style="padding:10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.hairline};border-radius:12px;">
<tr><td class="pass-inner" style="padding:26px 26px 30px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td valign="top" width="110"><img src="${esc(assets.logoUrl)}" width="105" height="40" alt="Rella Aesthetics" style="display:block;width:105px;height:40px;"></td>
    <td valign="top" align="right" style="font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:2px;font-weight:700;color:${C.white};">PASS ID<br><span class="pid" style="font-size:12px;line-height:20px;letter-spacing:1.5px;color:${C.white};font-weight:700;white-space:nowrap;">${esc(passId)}</span></td>
  </tr>
  </table>
  <p style="margin:56px 0 0;font-family:${FONT};font-size:44px;line-height:46px;letter-spacing:6px;font-weight:300;color:${C.white};">${COPY.pass.brand}</p>
  <p style="margin:8px 0 22px;font-family:${FONT};font-size:12px;line-height:16px;letter-spacing:2px;font-weight:700;color:${C.white};">${COPY.pass.title}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="height:1px;line-height:1px;font-size:1px;background:${C.white};">&nbsp;</td></tr></table>
  <p style="margin:18px 0 16px;font-family:${FONT};font-size:15px;line-height:22px;font-style:italic;font-weight:500;color:${C.white};">${esc(COPY.pass.line)}</p>
  <p style="margin:0 0 12px;font-family:${FONT};font-size:13px;line-height:20px;font-weight:700;color:${C.white};">${esc(COPY.pass.heading)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${perks}</table>
  <p style="margin:8px 0 16px;font-family:${FONT};font-size:12px;line-height:18px;font-weight:500;color:${C.white};">Choose <strong>one</strong> experience. One pass per guest.</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px dashed ${C.white};">
  <tr>
    <td style="padding-top:12px;font-family:${FONT};font-size:12px;letter-spacing:1.5px;font-weight:700;color:${C.white};">BOOK BY<br><span style="font-size:13px;color:${C.white};font-weight:700;letter-spacing:0;">${BLACK_FRIDAY_2026.pass.bookBy.label}</span></td>
    <td align="right" style="padding-top:12px;font-family:${FONT};font-size:12px;letter-spacing:1.5px;font-weight:700;color:${C.white};">REDEEM BY<br><span style="font-size:13px;color:${C.white};font-weight:700;letter-spacing:0;">${BLACK_FRIDAY_2026.pass.redeemBy.label}</span></td>
  </tr>
  </table>
</td></tr>
</table>
</td></tr>
</table>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td align="center" bgcolor="${C.rose}" style="border-radius:999px;">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${esc(href)}" style="height:50px;v-text-anchor:middle;width:300px;" arcsize="50%" stroke="f" fillcolor="${C.rose}"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:13px;letter-spacing:2px;font-weight:bold;">${esc(label.toUpperCase())}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${esc(href)}" style="display:inline-block;padding:16px 34px;font-family:${FONT};font-size:12px;letter-spacing:2.5px;font-weight:700;text-transform:uppercase;color:${C.white};text-decoration:none;border-radius:999px;background:${C.rose};">${esc(label)}</a><!--<![endif]-->
</td></tr></table>`;
}

function footerRow(): string {
  const s = BLACK_FRIDAY_2026;
  const locs = s.locations.map((l) => `${esc(l.name)} &middot; ${esc(l.address)}`).join("<br>");
  return `<tr><td class="px" style="background:${C.ivory};padding:28px 48px;font-family:${FONT};font-size:12px;line-height:19px;color:${C.silver};text-align:center;">
<a href="${s.site}" style="color:${C.ink};text-decoration:none;font-weight:600;">experiencerella.com</a> &nbsp;&middot;&nbsp; <a href="${s.phoneHref}" style="color:${C.ink};text-decoration:none;">${s.phone}</a> &nbsp;&middot;&nbsp; <a href="mailto:${s.email}" style="color:${C.ink};text-decoration:none;">${s.email}</a><br><br>
${locs}<br><br>
<a href="${s.offersTermsUrl}" style="color:${C.silver};">Offer terms &amp; conditions</a>
</td></tr>`;
}

export type RecipientEmailInput = {
  passId: string;
  recipientFirstName: string;
  senderName: string;
  message: string | null;
  claimUrl: string;
};

export function renderRecipientEmail(i: RecipientEmailInput, assets: EmailAssets) {
  const c = COPY.recipientEmail;
  const first = esc(i.recipientFirstName);
  const sender = esc(i.senderName);
  const note = i.message
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 24px;"><tr><td style="background:${C.ivory};border-left:2px solid ${C.rose};padding:18px 20px;font-family:${FONT};font-size:15px;line-height:23px;font-style:italic;color:${C.ink};">&ldquo;${esc(i.message).replace(/\n/g, "<br>")}&rdquo;<br><span style="font-style:normal;font-size:12px;letter-spacing:1px;color:${C.silver};">&mdash; ${sender}</span></td></tr></table>`
    : "";
  const body = `${headerRow(assets)}
<tr><td class="px" style="padding:44px 48px 8px;">
  <h1 class="h1" style="margin:0 0 24px;font-family:${FONT};font-size:34px;line-height:42px;font-weight:500;font-style:italic;color:${C.ink};">${esc(c.headline)}</h1>
  ${p(`Hi ${first},`)}
  ${p("Someone thinks you deserve a little something special.")}
  ${p(`${sender} has gifted you an exclusive Rella VIP Guest Pass, inviting you to experience a little luxury at Rella Aesthetics.`, "margin-bottom:24px;")}
  ${note}
</td></tr>
<tr><td class="px" style="padding:0 48px 28px;">${passTable(i.passId, assets)}</td></tr>
<tr><td class="px" style="padding:0 48px 12px;">
  ${p("Choose <strong>one</strong> of the six experiences above. You'll pick yours when you claim your pass.", "text-align:center;")}
</td></tr>
<tr><td style="padding:0 24px 16px;">${button(i.claimUrl, c.cta)}</td></tr>
<tr><td class="px" style="padding:8px 48px 36px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.silver};text-align:center;">
  Book by ${BLACK_FRIDAY_2026.pass.bookBy.label} &middot; Redeem by ${BLACK_FRIDAY_2026.pass.redeemBy.label}
</td></tr>
<tr><td class="px" style="padding:0 48px 44px;">
  ${p(esc(c.closing))}
  ${p(`${c.signoff[0]}<br>${c.signoff[1]}`, "margin:0;")}
</td></tr>
${footerRow()}`;
  const text = [
    c.headline,
    "",
    `Hi ${i.recipientFirstName},`,
    "",
    "Someone thinks you deserve a little something special.",
    "",
    `${i.senderName} has gifted you an exclusive Rella VIP Guest Pass, inviting you to experience a little luxury at Rella Aesthetics.`,
    ...(i.message ? ["", `"${i.message}" — ${i.senderName}`] : []),
    "",
    `RELLA VIP GUEST PASS · ${i.passId}`,
    COPY.pass.line,
    COPY.pass.heading,
    ...VIP_EXPERIENCES.map((e) => `- ${e.label}`),
    "Choose ONE experience.",
    `Book by ${BLACK_FRIDAY_2026.pass.bookBy.label}. Redeem by ${BLACK_FRIDAY_2026.pass.redeemBy.label}.`,
    "",
    `${c.cta}: ${i.claimUrl}`,
    "",
    c.closing,
    "",
    ...c.signoff,
    "",
    `${BLACK_FRIDAY_2026.site} · ${BLACK_FRIDAY_2026.phone} · ${BLACK_FRIDAY_2026.email}`,
    `Offer terms: ${BLACK_FRIDAY_2026.offersTermsUrl}`,
  ].join("\n");
  return { subject: c.subject, preheader: c.preview, html: shell({ title: c.subject, preheader: c.preview, body }), text };
}

export type PurchaserEmailInput = {
  purchaserFirstName: string;
  offer: GiftCardOffer;
  paidCents: number;
  orderNumber: string;
  passId: string;
  gifting:
    | { state: "not-sent"; giftUrl: string }
    | { state: "sent"; recipientFirstName: string; sentOn: string };
};

export function renderPurchaserEmail(i: PurchaserEmailInput, assets: EmailAssets) {
  const subject = "Your Rella gift card is confirmed";
  const preheader = `${i.offer.title} purchased for ${formatUsd(i.paidCents)}, plus a VIP Guest Pass to share.`;
  const row = (k: string, v: string) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #E8E1D7;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.silver};">${k}</td><td align="right" style="padding:10px 0;border-bottom:1px solid #E8E1D7;font-family:${FONT};font-size:14px;color:${C.ink};font-weight:500;">${v}</td></tr>`;
  const gifting =
    i.gifting.state === "sent"
      ? `${p(`<strong>Gifting status:</strong> Sent to ${esc(i.gifting.recipientFirstName)} on ${esc(i.gifting.sentOn)}. A little luxury is officially headed their way.`)}`
      : `${p("Your purchase includes an exclusive Rella VIP Guest Pass to gift to a friend or family member. Whenever you're ready, use your private link below to send it. This link is just for you; please don't forward this email.")}
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px;"><tr><td>${button(i.gifting.giftUrl, "Send My VIP Guest Pass")}</td></tr></table>`;
  const body = `${headerRow(assets)}
<tr><td class="px" style="padding:44px 48px 8px;">
  <h1 class="h1" style="margin:0 0 20px;font-family:${FONT};font-size:32px;line-height:40px;font-weight:500;font-style:italic;color:${C.ink};">Thank you, ${esc(i.purchaserFirstName)}.</h1>
  ${p("Your Black Friday gift card purchase is complete.")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 28px;">
    ${row("Gift card", esc(i.offer.title))}
    ${row("Amount paid", formatUsd(i.paidCents))}
    ${row("Gift card value", formatUsd(i.offer.valueCents))}
    ${row("Order", esc(i.orderNumber))}
    ${row("VIP Guest Pass", `Included &middot; <span class="pid-row" style="white-space:nowrap;">${esc(i.passId)}</span>`)}
  </table>
  <h2 style="margin:0 0 10px;font-family:${FONT};font-size:16px;font-weight:600;color:${C.ink};">Your gift card</h2>
  ${p(COPY.delivery)}
  ${p(`Your purchase includes ${formatUsd(i.offer.valueCents)} in account credit, including ${formatUsd(i.offer.bonusCents)} in additional value. It is added to the purchaser's Rella profile at the clinic selected during checkout. Your VIP Guest Pass below is the separate benefit you can share.`)}
  <h2 style="margin:16px 0 10px;font-family:${FONT};font-size:16px;font-weight:600;color:${C.ink};">Your VIP Guest Pass</h2>
  ${gifting}
</td></tr>
<tr><td class="px" style="padding:20px 48px 44px;">
  ${p("Questions? Reply to this email or call us at " + BLACK_FRIDAY_2026.phone + ".")}
  ${p("With love,<br>Your Rella team", "margin:0;")}
</td></tr>
${footerRow()}`;
  const text = [
    `Thank you, ${i.purchaserFirstName}.`,
    "Your Black Friday gift card purchase is complete.",
    "",
    `Gift card: ${i.offer.title}`,
    `Amount paid: ${formatUsd(i.paidCents)}`,
    `Gift card value: ${formatUsd(i.offer.valueCents)}`,
    `Order: ${i.orderNumber}`,
    `VIP Guest Pass: included (${i.passId})`,
    "",
    COPY.delivery,
    `${formatUsd(i.offer.valueCents)} in account credit is added to the purchaser's Rella profile at the clinic selected during checkout.`,
    "",
    i.gifting.state === "sent"
      ? `Gifting status: sent to ${i.gifting.recipientFirstName} on ${i.gifting.sentOn}.`
      : `Send your VIP Guest Pass whenever you're ready (private link, please don't forward): ${i.gifting.giftUrl}`,
    "",
    "With love,",
    "Your Rella team",
    `${BLACK_FRIDAY_2026.site} · ${BLACK_FRIDAY_2026.phone}`,
    `Offer terms: ${BLACK_FRIDAY_2026.offersTermsUrl}`,
  ].join("\n");
  return { subject, preheader, html: shell({ title: subject, preheader, body }), text };
}

export type BoulevardConfirmationInput = {
  purchaserFirstName: string;
  offer: GiftCardOffer;
  clinicId: ClinicId;
  passId: string;
};

/**
 * FALLBACK TEMPLATE ONLY (emergency Boulevard-widget path). The primary
 * custom checkout sends renderPurchaserEmail automatically after a
 * server-verified payment. This is a confirmation STAFF send by hand to the purchaser
 * once the package sale shows in Boulevard. Nothing here is sent
 * automatically, and the copy never says it was.
 */
export function renderBoulevardConfirmationEmail(i: BoulevardConfirmationInput, assets: EmailAssets) {
  const clinic = BOULEVARD_CHECKOUT.clinics.find((c) => c.id === i.clinicId);
  if (!clinic) throw Error("unknown-clinic");
  const s = BLACK_FRIDAY_2026;
  const offerLine = `${formatUsd(i.offer.valueCents)} for ${formatUsd(i.offer.priceCents)}`;
  const subject = "Your Rella Black Friday purchase";
  const preheader = `${offerLine}, delivered as Rella account credit, plus a VIP Guest Pass to share.`;
  const row = (k: string, v: string) =>
    `<tr><td valign="top" style="padding:11px 12px 11px 0;border-bottom:1px solid #E8E1D7;font-family:${FONT};font-size:12px;line-height:20px;letter-spacing:1.5px;text-transform:uppercase;color:${C.silver};white-space:nowrap;">${k}</td><td align="right" style="padding:11px 0;border-bottom:1px solid #E8E1D7;font-family:${FONT};font-size:14px;line-height:20px;color:${C.ink};font-weight:500;">${v}</td></tr>`;
  const body = `${headerRow(assets)}
<tr><td class="px" style="padding:44px 48px 8px;">
  <h1 class="h1" style="margin:0 0 20px;font-family:${FONT};font-size:32px;line-height:40px;font-weight:500;font-style:italic;color:${C.ink};">Thank you, ${esc(i.purchaserFirstName)}.</h1>
  ${p("Your Black Friday purchase is confirmed. Here are your details.")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;">
    ${row("Offer", esc(i.offer.title))}
    ${row("Purchased", esc(offerLine))}
    ${row("Clinic", `Rella ${esc(clinic.name)}`)}
    ${row("VIP Guest Pass", `Included &middot; <span class="pid-row" style="white-space:nowrap;">${esc(i.passId)}</span>`)}
  </table>
  <p style="margin:0 0 28px;font-family:${FONT};font-size:15px;line-height:24px;font-weight:600;color:${C.ink};">${esc(COPY.delivery)}</p>
  <h2 style="margin:0 0 10px;font-family:${FONT};font-size:22px;line-height:30px;font-weight:500;font-style:italic;color:${C.ink};">${esc(COPY.vipSection.headline)}</h2>
  ${p("Your purchase includes an exclusive Rella VIP Guest Pass to gift to a friend or family member. Share it with someone you love: they choose <strong>one</strong> of the six experiences below and mention their Pass ID when they book.", "margin-bottom:24px;")}
</td></tr>
<tr><td class="px" style="padding:0 48px 24px;">${passTable(i.passId, assets)}</td></tr>
<tr><td class="px" style="padding:0 48px 22px;font-family:${FONT};font-size:12px;line-height:20px;letter-spacing:1.5px;text-transform:uppercase;font-weight:500;color:${C.ink};text-align:center;">
  ${COPY.passDeadlines.split(" · ").map((part) => `<span style="white-space:nowrap;">${esc(part)}</span>`).join(" &middot; ")}
</td></tr>
<tr><td style="padding:0 24px 28px;">${button(s.bookingUrl, "Book Your Visit")}</td></tr>
<tr><td class="px" style="padding:0 48px 44px;">
  ${p("All treatments are subject to consultation and provider approval. Results vary.", `font-size:13px;line-height:20px;color:${C.silver};`)}
  ${p(`Questions? Reply to this email or call us at ${s.phone}. <a href="${s.offersTermsUrl}" style="color:${C.ink};">View the offer terms</a>.`)}
  ${p("With love,<br>Your Rella team", "margin:0;")}
</td></tr>
${footerRow()}`;
  const text = [
    `Thank you, ${i.purchaserFirstName}.`,
    "Your Black Friday purchase is confirmed. Here are your details.",
    "",
    `Offer: ${i.offer.title}`,
    `Purchased: ${offerLine}`,
    `Clinic: Rella ${clinic.name}`,
    `VIP Guest Pass: included (${i.passId})`,
    COPY.delivery,
    "",
    COPY.vipSection.headline,
    "Your purchase includes an exclusive Rella VIP Guest Pass to gift to a friend or family member. Share it with someone you love: they choose ONE of the six experiences below and mention their Pass ID when they book.",
    "",
    `RELLA VIP GUEST PASS · ${i.passId}`,
    COPY.pass.line,
    COPY.pass.heading,
    ...VIP_EXPERIENCES.map((e) => `- ${e.label}`),
    "Choose ONE experience.",
    COPY.passDeadlines,
    "",
    `Book your visit: ${s.bookingUrl}`,
    "",
    "All treatments are subject to consultation and provider approval. Results vary.",
    `Questions? Reply to this email or call us at ${s.phone}.`,
    `Offer terms: ${s.offersTermsUrl}`,
    "",
    "With love,",
    "Your Rella team",
    `${s.site} · ${s.phone} · ${s.email}`,
  ].join("\n");
  return { subject, preheader, html: shell({ title: subject, preheader, body }), text };
}

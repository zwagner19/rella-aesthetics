"use client";
import { BLACK_FRIDAY_2026, COPY, VIP_EXPERIENCES } from "@/lib/gift-cards/config";
import { RELLA_LOGO_PATHS, RELLA_LOGO_VIEWBOX } from "./RellaMark";

/** Draws the VIP Guest Pass to a 1080×1600 PNG (phone-wallpaper friendly) and downloads it. */
export async function downloadPassPng(passId: string): Promise<void> {
  await document.fonts?.ready;
  const host = document.querySelector("[data-gift-root]") ?? document.documentElement;
  const fam = getComputedStyle(host).getPropertyValue("--font-poppins").trim() || "Helvetica, Arial, sans-serif";
  const famI = getComputedStyle(host).getPropertyValue("--font-poppins-italic").trim() || fam;
  const W = 1080;
  const H = 1600;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) throw Error("canvas-unavailable");
  g.fillStyle = "#F7F4EF";
  g.fillRect(0, 0, W, H);
  // Same family as the gift card art: Rella pink surface, 18px-equivalent radius,
  // inset white hairline, white logo top-left, tracked kicker top-right.
  const x = 90, y = 110, w = W - 180, h = H - 220;
  const ON_PINK = "#FFFFFF"; // all text on pink is white (owner decision), one weight up
  g.fillStyle = "#F7A19A";
  roundRect(g, x, y, w, h, 35);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.38)";
  g.lineWidth = 2;
  roundRect(g, x + 20, y + 20, w - 40, h - 40, 23);
  g.stroke();

  const L = x + 68;
  const R = x + w - 68;
  const k = 78 / RELLA_LOGO_VIEWBOX.h;
  g.save();
  g.translate(L - RELLA_LOGO_VIEWBOX.x * k, y + 63 - RELLA_LOGO_VIEWBOX.y * k);
  g.scale(k, k);
  g.fillStyle = "#FFFFFF";
  for (const d of RELLA_LOGO_PATHS) g.fill(new Path2D(d), "evenodd");
  g.restore();

  g.fillStyle = ON_PINK;
  g.font = `700 22px ${fam}`;
  spacedRight(g, "PASS ID", R, y + 84, 5.6);
  g.font = `700 25px ${fam}`;
  spacedRight(g, passId, R, y + 122, 3.4);

  // Card face keeps the gift card's 1.586 ratio.
  const faceH = Math.round(w / 1.586);
  g.textAlign = "left";
  g.font = `300 104px ${fam}`;
  spaced(g, COPY.pass.brand, L, y + faceH - 104, 14);
  g.font = `700 23px ${fam}`;
  spaced(g, COPY.pass.title, L, y + faceH - 52, 4.4);
  g.fillStyle = "#FFFFFF";
  g.fillRect(x + 20, y + faceH, w - 40, 2);

  g.fillStyle = ON_PINK;
  g.font = `italic 500 34px ${famI}`;
  g.fillText(COPY.pass.line, L, y + faceH + 78);
  g.font = `700 27px ${fam}`;
  g.fillText(COPY.pass.heading, L, y + faceH + 140);

  let py = y + faceH + 204;
  for (const e of VIP_EXPERIENCES) {
    g.beginPath();
    g.arc(L + 7, py - 9, 6, 0, Math.PI * 2);
    g.fillStyle = "#FFFFFF";
    g.fill();
    g.fillStyle = ON_PINK;
    g.font = `500 27px ${fam}`;
    py = wrap(g, e.label, L + 36, py, R - L - 36, 38) + 52;
  }
  g.font = `500 25px ${fam}`;
  g.fillText("Your guest chooses ONE experience.", L, py + 2);

  const dy = y + h - 170;
  g.strokeStyle = "#FFFFFF";
  g.lineWidth = 2;
  g.setLineDash([10, 8]);
  g.beginPath();
  g.moveTo(L, dy);
  g.lineTo(R, dy);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = ON_PINK;
  g.font = `700 22px ${fam}`;
  spaced(g, "BOOK BY", L, dy + 56, 4);
  spacedRight(g, "REDEEM BY", R, dy + 56, 4);
  g.font = `700 29px ${fam}`;
  g.textAlign = "right";
  g.fillText(BLACK_FRIDAY_2026.pass.redeemBy.label, R, dy + 98);
  g.textAlign = "left";
  g.fillText(BLACK_FRIDAY_2026.pass.bookBy.label, L, dy + 98);

  g.textAlign = "center";
  g.fillStyle = "#64696E";
  g.font = `400 22px ${fam}`;
  g.fillText("experiencerella.com  ·  707.358.2928", W / 2, H - 54);

  const blob: Blob | null = await new Promise((r) => c.toBlob(r, "image/png"));
  if (!blob) throw Error("png-unavailable");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${passId}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function spaced(g: CanvasRenderingContext2D, t: string, x: number, y: number, sp: number) {
  let cx = x;
  for (const ch of t) {
    g.fillText(ch, cx, y);
    cx += g.measureText(ch).width + sp;
  }
}
function spacedRight(g: CanvasRenderingContext2D, t: string, right: number, y: number, sp: number) {
  const prev = g.textAlign;
  g.textAlign = "left";
  let width = 0;
  for (const ch of t) width += g.measureText(ch).width + sp;
  spaced(g, t, right - (width - sp), y, sp);
  g.textAlign = prev;
}
function wrap(g: CanvasRenderingContext2D, t: string, x: number, y: number, max: number, lh: number): number {
  const words = t.split(" ");
  let line = "";
  for (const wd of words) {
    const test = line ? `${line} ${wd}` : wd;
    if (g.measureText(test).width > max && line) {
      g.fillText(line, x, y);
      line = wd;
      y += lh;
    } else line = test;
  }
  g.fillText(line, x, y);
  return y;
}

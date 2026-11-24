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
  const x = 90, y = 110, w = W - 180, h = H - 220;
  g.fillStyle = "#FBD9D5";
  roundRect(g, x, y, w, h, 34);
  g.fill();
  g.strokeStyle = "#B8975A";
  g.lineWidth = 2;
  roundRect(g, x + 16, y + 16, w - 32, h - 32, 22);
  g.stroke();
  g.strokeStyle = "#D9C39A";
  roundRect(g, x + 28, y + 28, w - 56, h - 56, 16);
  g.stroke();

  const L = x + 80;
  const k = 92 / RELLA_LOGO_VIEWBOX.h;
  g.save();
  g.translate(L - RELLA_LOGO_VIEWBOX.x * k, y + 90 - RELLA_LOGO_VIEWBOX.y * k);
  g.scale(k, k);
  g.fillStyle = "#1A1A1A";
  for (const d of RELLA_LOGO_PATHS) g.fill(new Path2D(d), "evenodd");
  g.restore();

  g.textAlign = "right";
  g.fillStyle = "#64696E";
  g.font = `500 20px ${fam}`;
  g.fillText("PASS ID", x + w - 80, y + 120);
  g.fillStyle = "#1A1A1A";
  g.font = `600 28px ${fam}`;
  g.fillText(passId, x + w - 80, y + 158);

  g.textAlign = "left";
  g.font = `600 84px ${fam}`;
  spaced(g, COPY.pass.brand, L, y + 340, 26);
  g.font = `500 30px ${fam}`;
  g.fillStyle = "#2B2B2B";
  spaced(g, COPY.pass.title, L, y + 400, 11);
  g.fillStyle = "#B8975A";
  g.fillRect(L, y + 440, 150, 2);
  g.fillStyle = "#1A1A1A";
  g.font = `italic 500 38px ${famI}`;
  g.fillText(COPY.pass.line, L, y + 510);
  g.font = `600 30px ${fam}`;
  g.fillText(COPY.pass.heading, L, y + 590);

  let py = y + 660;
  for (const e of VIP_EXPERIENCES) {
    g.fillStyle = "#B8975A";
    g.font = `22px ${fam}`;
    g.fillText("◆", L, py);
    g.fillStyle = "#1A1A1A";
    g.font = `400 29px ${fam}`;
    py = wrap(g, e.label, L + 44, py, w - 220, 40) + 58;
  }
  g.fillStyle = "#2B2B2B";
  g.font = `400 26px ${fam}`;
  g.fillText("Your guest chooses ONE experience.", L, py + 6);

  const dy = y + h - 190;
  g.strokeStyle = "#B8975A";
  g.setLineDash([10, 8]);
  g.beginPath();
  g.moveTo(x + 40, dy);
  g.lineTo(x + w - 40, dy);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = "#64696E";
  g.font = `500 20px ${fam}`;
  g.fillText("BOOK BY", L, dy + 66);
  g.textAlign = "right";
  g.fillText("REDEEM BY", x + w - 80, dy + 66);
  g.fillStyle = "#1A1A1A";
  g.font = `600 30px ${fam}`;
  g.fillText(BLACK_FRIDAY_2026.pass.redeemBy.label, x + w - 80, dy + 108);
  g.textAlign = "left";
  g.fillText(BLACK_FRIDAY_2026.pass.bookBy.label, L, dy + 108);

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

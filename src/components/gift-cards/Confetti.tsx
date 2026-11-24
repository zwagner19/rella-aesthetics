"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#F7A19A", "#F4B8B1", "#FBD9D5", "#EFE6D8", "#D9C39A", "#C9A86A", "#B8975A"];

/** Soft confetti from the top. Renders nothing for prefers-reduced-motion. */
export function Confetti({ pieces = 170, durationMs = 5200 }: { pieces?: number; durationMs?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const W = () => canvas.width;
    const H = () => canvas.height;
    const bits = Array.from({ length: pieces }, () => ({
      x: Math.random() * W(),
      y: -Math.random() * H() * 0.35 - 10,
      w: (6 + Math.random() * 7) * dpr,
      h: (9 + Math.random() * 10) * dpr,
      vy: (2.6 + Math.random() * 2.8) * dpr,
      vx: (Math.random() - 0.5) * 0.7 * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.09,
      sway: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.3,
    }));
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const fade = elapsed > durationMs - 900 ? Math.max(0, (durationMs - elapsed) / 900) : 1;
      ctx.clearRect(0, 0, W(), H());
      for (const b of bits) {
        b.sway += 0.03;
        b.x += b.vx + Math.sin(b.sway) * 0.6 * dpr;
        b.y += b.vy;
        b.rot += b.vr;
        ctx.save();
        ctx.globalAlpha = 0.92 * fade;
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        if (b.color === "#FFFFFF" || b.color === "#F7F4EF") {
          ctx.strokeStyle = "rgba(184,151,90,.35)";
          ctx.lineWidth = dpr * 0.6;
        }
        if (b.round) {
          ctx.beginPath();
          ctx.arc(0, 0, b.w / 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.rot * 1.7)) + dpr);
        }
        ctx.restore();
      }
      if (elapsed < durationMs) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W(), H());
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pieces, durationMs]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 70 }}
    />
  );
}

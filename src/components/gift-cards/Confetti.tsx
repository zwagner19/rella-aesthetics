"use client";
import { useEffect, useRef } from "react";

const COLORS = ["#F7A19A", "#F4B8B1", "#FBD9D5", "#F7F4EF", "#D9C39A", "#C9A86A", "#B8975A"];

/**
 * One short, light burst from the two lower corners (about 2.6s), then clears.
 * Sits behind the celebration card so it frames the edges instead of covering
 * text. Renders nothing for prefers-reduced-motion, except on the preview-only
 * DEMO route (`ignoreReducedMotion`) so reviewers with "Reduce motion" on can
 * still see the design. Never set that flag in the real flow.
 */
export function Confetti({ durationMs = 2600, ignoreReducedMotion = false }: { durationMs?: number; ignoreReducedMotion?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || (!ignoreReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);
    const W = canvas.width;
    const H = canvas.height;
    const phone = window.innerWidth < 641;
    // Phones: the card fills the width, so pieces run in front of it but hug
    // the side gutters (steep angle) instead of crossing the text.
    canvas.style.zIndex = phone ? "3" : "1";
    const count = phone ? 28 : 64;
    const power = (phone ? 0.9 : 1.15) * Math.sqrt(H / dpr / 800);
    const bits = Array.from({ length: count }, (_, i) => {
      const left = i % 2 === 0;
      // Mostly upward, angled inward 10-35 degrees from vertical.
      const angle = ((phone ? 1 + Math.random() * 5 : 10 + Math.random() * 25) * Math.PI) / 180;
      const speed = (11 + Math.random() * 7) * power * dpr;
      return {
        x: left ? -6 * dpr : W + 6 * dpr,
        y: H * (0.78 + Math.random() * 0.16),
        vx: (left ? 1 : -1) * Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        w: (phone ? 4 + Math.random() * 3 : 5 + Math.random() * 5) * dpr,
        h: (phone ? 6 + Math.random() * 4 : 7 + Math.random() * 7) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.16,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        round: Math.random() < 0.3,
        delay: Math.random() * 260,
      };
    });
    const gravity = 0.26 * dpr;
    const start = performance.now();
    let last = start;
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = t - start;
      const step = Math.min(2, (t - last) / 16.7);
      last = t;
      const fade = elapsed > durationMs - 700 ? Math.max(0, (durationMs - elapsed) / 700) : 1;
      ctx.clearRect(0, 0, W, H);
      for (const b of bits) {
        if (elapsed < b.delay) continue;
        b.vy += gravity * step;
        b.vx *= phone ? 0.96 : 0.985;
        b.vy *= 0.985;
        b.x += b.vx * step;
        b.y += b.vy * step;
        b.rot += b.vr * step;
        ctx.save();
        ctx.globalAlpha = 0.9 * fade;
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.color;
        if (b.round) {
          ctx.beginPath();
          ctx.arc(0, 0, b.w / 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.rot * 1.7)) + dpr);
        }
        if (b.color === "#F7F4EF") {
          ctx.strokeStyle = "rgba(184,151,90,.4)";
          ctx.lineWidth = dpr * 0.6;
          ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.abs(Math.cos(b.rot * 1.7)) + dpr);
        }
        ctx.restore();
      }
      if (elapsed < durationMs) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs, ignoreReducedMotion]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

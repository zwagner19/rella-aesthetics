"use client";

import { useCallback, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  blurred?: boolean;
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, blurred = false }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const handleMove = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] max-w-md mx-auto rounded-lg overflow-hidden select-none cursor-ew-resize bg-silver-pale"
        onPointerDown={(e) => {
          handleMove(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1 && e.pointerType !== "touch") return;
          handleMove(e.clientX);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterSrc}
            alt="After simulation"
            className={`absolute inset-0 w-full h-full object-cover ${blurred ? "blur-md scale-105" : ""}`}
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-silver text-xs font-bold"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          ↔
        </div>
        <span className="absolute top-3 left-3 bg-black/50 text-white text-[0.625rem] font-bold tracking-widest uppercase px-2 py-1 rounded">
          Before
        </span>
        <span className="absolute top-3 right-3 bg-black/50 text-white text-[0.625rem] font-bold tracking-widest uppercase px-2 py-1 rounded">
          After
        </span>
      </div>
      <p className="text-xs text-silver text-center">Drag to compare before and after</p>
    </div>
  );
}

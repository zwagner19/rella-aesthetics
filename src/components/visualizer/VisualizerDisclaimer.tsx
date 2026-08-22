"use client";

import { PHOTO_CONSENT_TEXT, VISUALIZER_DISCLAIMER } from "@/lib/visualizer/treatments";

interface VisualizerDisclaimerProps {
  compact?: boolean;
}

export function VisualizerDisclaimer({ compact = false }: VisualizerDisclaimerProps) {
  return (
    <p
      className={`text-silver leading-relaxed ${compact ? "text-xs" : "text-sm"}`}
      role="note"
    >
      {VISUALIZER_DISCLAIMER}
    </p>
  );
}

interface PhotoConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PhotoConsent({ checked, onChange }: PhotoConsentProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 accent-rose shrink-0"
        required
      />
      <span className="text-sm text-silver leading-relaxed group-hover:text-silver-dark transition-colors">
        {PHOTO_CONSENT_TEXT}
      </span>
    </label>
  );
}

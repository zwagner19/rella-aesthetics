"use client";

import { PHOTO_CONSENT_TEXT } from "@/lib/visualizer/treatments";

interface PhotoConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PhotoConsent({ checked, onChange }: PhotoConsentProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group max-w-md mx-auto">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-rose shrink-0"
        required
      />
      <span className="text-xs text-silver leading-relaxed group-hover:text-silver-dark transition-colors">
        {PHOTO_CONSENT_TEXT}
      </span>
    </label>
  );
}

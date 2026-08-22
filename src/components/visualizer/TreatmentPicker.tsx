"use client";

import { BOTOX_ZONES, isValidIntensity } from "@/lib/visualizer/treatments";
import type { BotoxZone, IntensityPreset } from "@/lib/visualizer/types";

interface TreatmentPickerProps {
  selectedZones: BotoxZone[];
  intensity: IntensityPreset;
  onZonesChange: (zones: BotoxZone[]) => void;
  onIntensityChange: (intensity: IntensityPreset) => void;
}

export function TreatmentPicker({
  selectedZones,
  intensity,
  onZonesChange,
  onIntensityChange,
}: TreatmentPickerProps) {
  const toggleZone = (zone: BotoxZone) => {
    if (selectedZones.includes(zone)) {
      if (selectedZones.length === 1) return;
      onZonesChange(selectedZones.filter((z) => z !== zone));
    } else {
      onZonesChange([...selectedZones, zone]);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div>
        <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-silver mb-4">
          Areas of concern
        </h3>
        <div className="space-y-3">
          {BOTOX_ZONES.map((zone) => {
            const active = selectedZones.includes(zone.id);
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => toggleZone(zone.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  active
                    ? "border-rose bg-rose-blush"
                    : "border-silver-pale bg-white hover:border-rose-light"
                }`}
              >
                <span className="block font-medium text-silver-dark text-sm">{zone.label}</span>
                <span className="block text-xs text-silver mt-1">{zone.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xs tracking-[0.15em] uppercase text-silver mb-4">
          Preview intensity
        </h3>
        <div className="flex gap-3">
          {(["subtle", "moderate"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onIntensityChange(preset)}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${
                intensity === preset
                  ? "border-rose bg-rose-blush text-silver-dark"
                  : "border-silver-pale text-silver hover:border-rose-light"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <p className="text-xs text-silver mt-2">
          Subtle is recommended for a conservative, clinic-realistic preview.
        </p>
      </div>
    </div>
  );
}

export function IntakeForm({
  goal,
  timeline,
  budget,
  onGoalChange,
  onTimelineChange,
  onBudgetChange,
}: {
  goal: string;
  timeline: string;
  budget: string;
  onGoalChange: (v: string) => void;
  onTimelineChange: (v: string) => void;
  onBudgetChange: (v: string) => void;
}) {
  const fieldClass =
    "w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors";

  return (
    <div className="space-y-5 max-w-md mx-auto">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-silver-dark mb-1">
          What is your main goal?
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          placeholder="e.g. soften forehead lines for a refreshed look"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-silver-dark mb-1">
          When are you hoping to start?
        </label>
        <select
          id="timeline"
          value={timeline}
          onChange={(e) => onTimelineChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select timeline</option>
          <option value="within-2-weeks">Within 2 weeks</option>
          <option value="within-1-month">Within 1 month</option>
          <option value="exploring">Just exploring</option>
        </select>
      </div>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-silver-dark mb-1">
          Budget comfort level
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select range</option>
          <option value="ready-to-invest">Ready to invest in treatment</option>
          <option value="moderate">Moderate — want to understand options</option>
          <option value="exploring-budget">Still exploring budget</option>
        </select>
      </div>
    </div>
  );
}

export function isIntensity(value: string): value is IntensityPreset {
  return isValidIntensity(value);
}

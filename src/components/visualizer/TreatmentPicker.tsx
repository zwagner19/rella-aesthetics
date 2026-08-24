"use client";

import {
  getZonesForTreatment,
  isValidIntensity,
  TREATMENT_OPTIONS,
} from "@/lib/visualizer/treatments";
import type { IntensityPreset, TreatmentType, TreatmentZoneId } from "@/lib/visualizer/types";

const sectionLabel =
  "font-bold text-[0.625rem] tracking-[0.2em] uppercase text-silver mb-3";

interface TreatmentTypePickerProps {
  treatmentType: TreatmentType;
  onTreatmentTypeChange: (type: TreatmentType) => void;
  compact?: boolean;
}

export function TreatmentTypePicker({
  treatmentType,
  onTreatmentTypeChange,
  compact = false,
}: TreatmentTypePickerProps) {
  return (
    <div>
      {!compact && <p className={sectionLabel}>Treatment</p>}
      <div className={`grid grid-cols-2 gap-2 ${compact ? "" : "sm:gap-3"}`}>
        {TREATMENT_OPTIONS.map((option) => {
          const active = treatmentType === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onTreatmentTypeChange(option.id)}
              className={`text-center py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                active
                  ? "border-rose bg-rose-blush text-silver-dark"
                  : "border-silver-pale bg-white text-silver hover:border-rose-light"
              }`}
            >
              {option.id === "botox" ? "Botox" : "Laser"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface TreatmentPickerProps {
  treatmentType: TreatmentType;
  selectedZones: TreatmentZoneId[];
  intensity: IntensityPreset;
  onZonesChange: (zones: TreatmentZoneId[]) => void;
  onIntensityChange: (intensity: IntensityPreset) => void;
}

export function TreatmentPicker({
  treatmentType,
  selectedZones,
  intensity,
  onZonesChange,
  onIntensityChange,
}: TreatmentPickerProps) {
  const zoneOptions = getZonesForTreatment(treatmentType);

  const toggleZone = (zone: TreatmentZoneId) => {
    if (selectedZones.includes(zone)) {
      if (selectedZones.length === 1) return;
      onZonesChange(selectedZones.filter((z) => z !== zone));
    } else {
      onZonesChange([...selectedZones, zone]);
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      <div>
        <p className={sectionLabel}>Areas</p>
        <div className="flex flex-wrap gap-2">
          {zoneOptions.map((zone) => {
            const active = selectedZones.includes(zone.id);
            return (
              <button
                key={zone.id}
                type="button"
                onClick={() => toggleZone(zone.id)}
                className={`py-2.5 px-4 rounded-full border text-sm transition-all ${
                  active
                    ? "border-rose bg-rose-blush text-silver-dark font-medium"
                    : "border-silver-pale bg-white text-silver hover:border-rose-light"
                }`}
              >
                {zone.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className={sectionLabel}>Result strength</p>
        <div className="flex gap-2">
          {(
            [
              { id: "subtle" as const, label: "Subtle", hint: "Natural" },
              { id: "moderate" as const, label: "More visible", hint: "Stronger" },
            ] as const
          ).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onIntensityChange(preset.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                intensity === preset.id
                  ? "border-rose bg-rose-blush text-silver-dark"
                  : "border-silver-pale text-silver hover:border-rose-light"
              }`}
            >
              <span className="block">{preset.label}</span>
              <span className="block text-[0.625rem] font-normal opacity-70 mt-0.5">
                {preset.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IntakeForm({
  goal,
  timeline,
  budget,
  treatmentType,
  onGoalChange,
  onTimelineChange,
  onBudgetChange,
}: {
  goal: string;
  timeline: string;
  budget: string;
  treatmentType: TreatmentType;
  onGoalChange: (v: string) => void;
  onTimelineChange: (v: string) => void;
  onBudgetChange: (v: string) => void;
}) {
  const fieldClass =
    "w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors text-sm";

  const goalPlaceholder =
    treatmentType === "laser-pigmentation" ? "Even skin tone" : "Softer expression lines";

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-silver-dark mb-1">
          Goal
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          placeholder={goalPlaceholder}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-silver-dark mb-1">
          Timeline
        </label>
        <select
          id="timeline"
          value={timeline}
          onChange={(e) => onTimelineChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select</option>
          <option value="within-2-weeks">Within 2 weeks</option>
          <option value="within-1-month">Within 1 month</option>
          <option value="exploring">Exploring</option>
        </select>
      </div>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-silver-dark mb-1">
          Budget
        </label>
        <select
          id="budget"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select</option>
          <option value="ready-to-invest">Ready to invest</option>
          <option value="moderate">Moderate</option>
          <option value="exploring-budget">Exploring</option>
        </select>
      </div>
    </div>
  );
}

export function isIntensity(value: string): value is IntensityPreset {
  return isValidIntensity(value);
}

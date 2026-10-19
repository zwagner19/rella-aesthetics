"use client";

import { useId, useState } from "react";

/** Keep opening a description independent from adding a treatment or package. */
export function TreatmentDetails({
  name,
  description,
  duration,
  consultation = false,
}: {
  name: string;
  description: string;
  duration?: string;
  consultation?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
        aria-label={`${expanded ? "Hide" : "Show"} details for ${name}`}
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded(value => !value)}
      >
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ink">{name}</span>
          {consultation ? (
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
              Consultation
            </span>
          ) : null}
        </span>
        <span className="shrink-0 text-xs text-silver">
          {expanded ? "Hide details" : "Details"}
        </span>
      </button>
      <div id={descriptionId} hidden={!expanded}>
        <p className="mt-1 text-sm font-light text-silver">{description}</p>
        {duration ? <p className="mt-2 text-xs text-silver">{duration}</p> : null}
      </div>
    </div>
  );
}

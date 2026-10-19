"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

/** Keep opening a description independent from adding a treatment or package. */
export function TreatmentDetails({
  name,
  description,
  duration,
  consultation = false,
  kind = "treatment",
  action,
}: {
  name: string;
  description: string;
  duration?: string;
  consultation?: boolean;
  kind?: "treatment" | "package";
  action: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const descriptionId = useId();
  const detailsLabel = kind === "package" ? "What’s included?" : "What’s this treatment?";

  return (
    <>
      <div className="flex min-h-11 min-w-0 items-center">
        <div className="min-w-0">
          <span className="block break-words font-medium text-ink">{name}</span>
          {consultation ? (
            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
              Consultation
            </span>
          ) : null}
        </div>
      </div>
      {action}
      <button
        type="button"
        className="col-span-full flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-rule bg-ivory/60 px-3 py-2 text-left text-sm font-medium text-ink hover:border-ink/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        aria-label={`${expanded ? "Hide details" : detailsLabel} for ${name}`}
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded(value => !value)}
      >
        <span>{expanded ? "Hide details" : detailsLabel}</span>
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"
          className={`size-5 shrink-0 ${expanded ? "rotate-180" : ""}`}>
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={descriptionId} hidden={!expanded} className="col-span-full pb-1">
        <p className="mt-1 text-sm font-light text-silver">{description}</p>
        {duration ? <p className="mt-2 text-xs text-silver">{duration}</p> : null}
      </div>
    </>
  );
}

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
  const detailsLabel = kind === "package" ? "package details" : "details";

  return (
    <>
      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-3 py-2">
        <button
          type="button"
          className="flex min-h-11 min-w-0 cursor-pointer items-center gap-2 text-left before:absolute before:inset-0 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          aria-label={`${expanded ? "Hide" : "Show"} ${detailsLabel} for ${name}`}
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded(value => !value)}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"
            className={`size-5 shrink-0 text-ink ${expanded ? "rotate-180" : ""}`}>
            <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="min-w-0">
            <span className="block break-words font-medium text-ink">{name}</span>
            {consultation ? (
              <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
                Consultation
              </span>
            ) : null}
          </span>
        </button>
        <div className="relative z-10 justify-self-end">{action}</div>
      </div>
      <div id={descriptionId} hidden={!expanded} className="px-3 pb-3">
        <p className="mt-1 text-sm font-light text-silver">{description}</p>
        {duration ? <p className="mt-2 text-xs text-silver">{duration}</p> : null}
      </div>
    </>
  );
}

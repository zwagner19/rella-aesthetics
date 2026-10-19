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
    <>
      <button
        type="button"
        className="group flex min-h-11 min-w-0 items-start gap-2 text-left"
        aria-label={`${expanded ? "Hide" : "View"} details for ${name}`}
        aria-expanded={expanded}
        aria-controls={descriptionId}
        onClick={() => setExpanded(value => !value)}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"
          className={`mt-1 size-4 shrink-0 text-ink/70 ${expanded ? "rotate-180" : ""}`}>
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="min-w-0">
          <span className="block break-words font-medium text-ink group-hover:underline">{name}</span>
          {consultation ? (
            <span className="block text-[0.625rem] font-bold uppercase tracking-[0.14em] text-rose">
              Consultation
            </span>
          ) : null}
          <span className="mt-0.5 block text-xs text-ink/65 underline underline-offset-2">
            {expanded ? "Hide details" : "View details"}
          </span>
        </span>
      </button>
      <div id={descriptionId} hidden={!expanded} className="order-last col-span-full pb-1">
        <p className="mt-1 text-sm font-light text-silver">{description}</p>
        {duration ? <p className="mt-2 text-xs text-silver">{duration}</p> : null}
      </div>
    </>
  );
}

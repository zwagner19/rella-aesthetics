"use client";

type Phase = { id: string; label: string };

interface BookingProgressProps {
  phases: Phase[];
  activeId: string;
}

export function BookingProgress({ phases, activeId }: BookingProgressProps) {
  const activeIndex = Math.max(
    0,
    phases.findIndex((p) => p.id === activeId)
  );

  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex flex-wrap gap-y-2 gap-x-1 md:gap-x-2 items-center text-left">
        {phases.map((p, i) => {
          const done = i < activeIndex;
          const current = p.id === activeId;
          return (
            <li key={p.id} className="flex items-center gap-1 md:gap-2">
              {i > 0 && (
                <span
                  className="text-silver-light hidden sm:inline"
                  aria-hidden
                >
                  /
                </span>
              )}
              <span
                className={
                  done
                    ? "text-silver text-xs md:text-sm font-medium"
                    : current
                      ? "text-rose-text text-xs md:text-sm font-bold tracking-wide"
                      : "text-silver-light text-xs md:text-sm"
                }
              >
                {done ? "✓ " : ""}
                {p.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

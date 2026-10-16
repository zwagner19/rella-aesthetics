"use client";

import type { GuidedSlot } from "@/lib/guided-booking";

export function DateTimeStep({
  dates,
  times,
  timeZone,
  selectedDate,
  selectedSlotId,
  loading,
  onSelectDate,
  onSelectSlot,
}: {
  dates: string[];
  times: GuidedSlot[];
  timeZone: string;
  selectedDate: string;
  selectedSlotId: string | null;
  loading: boolean;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: GuidedSlot) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Date &amp; time
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          Open times come from the live booking catalog for this visit.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-silver" role="status">
          Checking availability…
        </p>
      ) : null}

      {!loading && dates.length === 0 ? (
        <p className="text-sm text-silver" role="status">
          No open dates were returned for this service.
        </p>
      ) : null}

      {dates.length > 0 ? (
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Dates
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {dates.map((date) => {
              const active = selectedDate === date;
              const label = timeZone
                ? new Intl.DateTimeFormat("en-US", {
                    timeZone,
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(`${date}T12:00:00Z`))
                : date;
              return (
                <li key={date}>
                  <button
                    type="button"
                    onClick={() => onSelectDate(date)}
                    aria-pressed={active}
                    className={`w-full rounded-sm border px-2 py-3 text-xs ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-rule/70 bg-white text-ink"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {selectedDate && times.length > 0 ? (
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Times on {selectedDate}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {times.map((slot) => (
              <li key={slot.id}>
                <button
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  aria-pressed={selectedSlotId === slot.id}
                  className={`rounded-full border px-4 py-2 text-xs ${
                    selectedSlotId === slot.id
                      ? "border-rose bg-rose text-white"
                      : "border-rule/70 bg-white text-ink"
                  }`}
                >
                  {slot.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {selectedDate && !loading && times.length === 0 ? (
        <p className="text-sm text-silver">No open times were returned for that date.</p>
      ) : null}
    </div>
  );
}

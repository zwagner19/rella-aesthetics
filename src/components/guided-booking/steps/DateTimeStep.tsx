"use client";

import type { AvailabilityResult, GuidedSlot } from "@/lib/guided-booking";

export function DateTimeStep({
  availability,
  times,
  selectedDate,
  selectedSlotId,
  loading,
  onSelectDate,
  onSelectSlot,
}: {
  availability: AvailabilityResult | null;
  times: GuidedSlot[];
  selectedDate: string;
  selectedSlotId: string | null;
  loading: boolean;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: GuidedSlot) => void;
}) {
  const live = availability?.live === true;
  const dates = availability?.dates ?? [];
  const next = availability?.nextAvailable ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">
          Date &amp; time
        </h3>
        <p className="mt-2 text-sm font-light text-silver">
          {live
            ? "Showing live Boulevard availability for your selection."
            : availability?.message ??
              "Live times are confirmed in Rella’s booking app before your appointment is created."}
        </p>
      </div>

      {!live ? (
        <div
          role="status"
          className="rounded-sm border border-rule/70 bg-ivory px-4 py-3 text-sm text-ink/80"
        >
          Availability on this marketing preview is not live Boulevard inventory.
          Continue to complete booking on the secure booking app, where real
          dates and times load from Boulevard.
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-silver" role="status">
          Checking availability…
        </p>
      ) : null}

      {next.length > 0 ? (
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Next available
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {next.map((slot) => (
              <li key={`next-${slot.id}`}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectDate(slot.startTime.slice(0, 10));
                    onSelectSlot(slot);
                  }}
                  className={`rounded-full border px-4 py-2 text-xs ${
                    selectedSlotId === slot.id
                      ? "border-ink bg-ink text-white"
                      : "border-rule/70 bg-white text-ink"
                  }`}
                >
                  {new Date(slot.startTime).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {dates.length > 0 ? (
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink/55">
            Calendar
          </p>
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {dates.map((date) => {
              const active = selectedDate === date;
              const label = new Date(`${date}T12:00:00`).toLocaleDateString(
                "en-US",
                { weekday: "short", month: "short", day: "numeric" },
              );
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
    </div>
  );
}

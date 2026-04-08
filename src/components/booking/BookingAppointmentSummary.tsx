"use client";

import {
  bookingPanelMuted,
  bookingEyebrow,
} from "@/components/booking/booking-styles";

interface BookingAppointmentSummaryProps {
  locationName?: string | null;
  serviceName?: string | null;
  dateLabel?: string | null;
  timeLabel?: string | null;
}

export function BookingAppointmentSummary({
  locationName,
  serviceName,
  dateLabel,
  timeLabel,
}: BookingAppointmentSummaryProps) {
  if (!locationName && !serviceName && !dateLabel && !timeLabel) return null;

  return (
    <aside
      className={`${bookingPanelMuted} p-4 md:p-5 mb-8 md:sticky md:top-24`}
      aria-label="Your selection"
    >
      <p className={`${bookingEyebrow} mb-3`}>Your appointment</p>
      <dl className="space-y-2 text-sm text-silver-dark">
        {locationName && (
          <div>
            <dt className="text-silver text-[0.65rem] uppercase tracking-wider">
              Location
            </dt>
            <dd>{locationName}</dd>
          </div>
        )}
        {serviceName && (
          <div>
            <dt className="text-silver text-[0.65rem] uppercase tracking-wider">
              Treatment
            </dt>
            <dd>{serviceName}</dd>
          </div>
        )}
        {(dateLabel || timeLabel) && (
          <div>
            <dt className="text-silver text-[0.65rem] uppercase tracking-wider">
              Date &amp; time
            </dt>
            <dd>
              {[dateLabel, timeLabel].filter(Boolean).join(" · ")}
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

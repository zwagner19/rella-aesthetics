/**
 * Turn raw Boulevard / GraphQL messages into calmer, actionable copy.
 */
export function mapBookingError(raw: string): string {
  const t = raw.toLowerCase();

  if (t.includes("unauthenticated") || t.includes("unauthorized")) {
    return "Booking session expired. Refresh this page and try again.";
  }
  if (t.includes("reserve") || t.includes("no longer available") || t.includes("taken")) {
    return "That time is no longer available. Choose another slot.";
  }
  if (t.includes("payment") || t.includes("card") || t.includes("token")) {
    return "We couldn’t process the card. Check the number and try again, or call the studio.";
  }
  if (t.includes("booking question") || t.includes("answer")) {
    return "Please answer the remaining questions to continue.";
  }
  if (t.includes("checkout") || t.includes("cart")) {
    return "We couldn’t complete the booking. Try again or call us to schedule.";
  }

  return raw.length > 220 ? `${raw.slice(0, 217)}…` : raw;
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Blvd } from "@boulevard/blvd-book-sdk";
import {
  BOULEVARD_API_KEY,
  BOULEVARD_BUSINESS_ID,
  getBoulevardTarget,
  isBoulevardConfigured,
} from "@/lib/boulevard-config";
import { Button } from "@/components/ui/Button";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingAppointmentSummary } from "@/components/booking/BookingAppointmentSummary";
import {
  BookingQuestionsForm,
  needsIntakeStep,
  useUnansweredQuestions,
  type IntakeAnswer,
} from "@/components/booking/BookingQuestionsForm";
import { mapBookingError } from "@/components/booking/mapBlvdError";
import {
  bookingAlertError,
  bookingChoice,
  bookingEmpty,
  bookingEyebrow,
  bookingFieldLabel,
  bookingInput,
  bookingLinkBack,
  bookingPanel,
  bookingSkeleton,
  bookingSubtitle,
  bookingTitle,
} from "@/components/booking/booking-styles";

type WizardStep =
  | "location"
  | "service"
  | "schedule"
  | "details"
  | "intake"
  | "confirm"
  | "success";

function isBookableItem(item: object): boolean {
  return (
    "listDurationRange" in item &&
    (item as { listDurationRange?: unknown }).listDurationRange != null
  );
}

function matchServiceSlug(
  slug: string | null,
  items: { id: string; name: string }[]
): string | null {
  if (!slug || !items.length) return null;
  const norm = slug.toLowerCase().replace(/-/g, " ");
  const hit = items.find((i) => {
    const n = i.name.toLowerCase();
    return (
      n.includes(norm) ||
      norm.split(" ").every((w) => w.length > 2 && n.includes(w))
    );
  });
  return hit?.id ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function replaceBookableItem(cart: any, row: { raw: object }): Promise<any> {
  let c = cart;
  const selected = await c.getSelectedItems();
  for (const item of selected) {
    c = await c.removeSelectedItem(item);
  }
  return c.addBookableItem(row.raw);
}

export function BoulevardBookingWizard() {
  const searchParams = useSearchParams();
  const serviceHint = searchParams.get("service");

  const client = useMemo(() => {
    if (!isBoulevardConfigured()) return null;
    return new Blvd(
      BOULEVARD_API_KEY,
      BOULEVARD_BUSINESS_ID,
      getBoulevardTarget()
    );
  }, []);

  const [step, setStep] = useState<WizardStep>("location");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    []
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any>(null);

  const [bookableItems, setBookableItems] = useState<
    { id: string; name: string; raw: object }[]
  >([]);

  const [bookableDates, setBookableDates] = useState<{ date: string }[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(
    null
  );
  const [selectedLocationName, setSelectedLocationName] = useState<
    string | null
  >(null);
  const [urlPreselectUsed, setUrlPreselectUsed] = useState(false);
  const [serviceFilter, setServiceFilter] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpMonth, setCardExpMonth] = useState("");
  const [cardExpYear, setCardExpYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardZip, setCardZip] = useState("");

  const unanswerQs = useUnansweredQuestions(cart);

  const multiLocation = locations.length > 1;
  const treatmentVisible =
    !urlPreselectUsed || step === "service";

  const hasBookingQuestions =
    (cart?.bookingQuestions?.length ?? 0) > 0;

  const phases = useMemo(() => {
    const p: { id: string; label: string }[] = [];
    if (multiLocation) p.push({ id: "location", label: "Location" });
    if (treatmentVisible) p.push({ id: "service", label: "Treatment" });
    p.push({ id: "schedule", label: "Schedule" });
    p.push({ id: "details", label: "Your info" });
    if (
      hasBookingQuestions &&
      ["intake", "confirm", "success"].includes(step)
    ) {
      p.push({ id: "intake", label: "Intake" });
    }
    p.push({ id: "confirm", label: "Confirm" });
    return p;
  }, [multiLocation, treatmentVisible, hasBookingQuestions, step]);

  const progressActiveId = useMemo(() => {
    if (step === "success") return "confirm";
    if (step === "intake") return "intake";
    return step;
  }, [step]);

  useEffect(() => {
    if (step === "intake" && unanswerQs.length === 0) {
      setStep("confirm");
    }
  }, [step, unanswerQs.length]);

  const resetFlow = useCallback(() => {
    setStep("location");
    setCart(null);
    setBookableItems([]);
    setBookableDates([]);
    setSelectedDateStr(null);
    setTimeSlots([]);
    setError(null);
    setUrlPreselectUsed(false);
    setSelectedServiceName(null);
    setSelectedLocationName(null);
  }, []);

  const startCartWithLocation = useCallback(
    async (
      blvd: Blvd,
      locId: string,
      locName: string,
      itemsHint?: { id: string; name: string; raw: object }[]
    ) => {
      setBusy(true);
      setError(null);
      try {
        const business = await blvd.businesses.get();
        const locs = await business.getLocations();
        const loc = locs.find((l: { id: string }) => l.id === locId);
        if (!loc) throw new Error("Location not found");

        const newCart = await blvd.carts.create(loc);
        setSelectedLocationName(locName);

        const categories = await newCart.getAvailableCategories();
        const items: { id: string; name: string; raw: object }[] = [];
        for (const cat of categories) {
          for (const item of cat.availableItems) {
            if (isBookableItem(item)) {
              items.push({
                id: (item as { id: string }).id,
                name: (item as { name: string }).name,
                raw: item,
              });
            }
          }
        }
        setBookableItems(items);

        const pre = matchServiceSlug(serviceHint, itemsHint ?? items);

        if (pre) {
          const row = items.find((i) => i.id === pre)!;
          const updated = await newCart.addBookableItem(row.raw);
          setCart(updated);
          setSelectedServiceName(row.name);
          setUrlPreselectUsed(true);
          const dates = await updated.getBookableDates({ limit: 60 });
          setBookableDates(dates.map((d: { date: string }) => ({ date: d.date })));
          setStep("schedule");
        } else {
          setCart(newCart);
          setUrlPreselectUsed(false);
          setStep("service");
        }
      } catch (e) {
        setError(
          mapBookingError(
            e instanceof Error ? e.message : "Could not start booking session"
          )
        );
      } finally {
        setBusy(false);
      }
    },
    [serviceHint]
  );

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        const business = await client.businesses.get();
        const locs = await business.getLocations();
        if (cancelled) return;
        const mapped = locs.map((l: { id: string; name: string }) => ({
          id: l.id,
          name: l.name,
        }));
        setLocations(mapped);
        if (mapped.length === 1) {
          await startCartWithLocation(
            client,
            mapped[0].id,
            mapped[0].name
          );
        } else {
          setStep("location");
        }
      } catch (e) {
        setError(
          mapBookingError(
            e instanceof Error ? e.message : "Could not load locations"
          )
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [client, startCartWithLocation]);

  async function pickService(itemId: string) {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      const row = bookableItems.find((i) => i.id === itemId);
      if (!row) throw new Error("Service not found");
      const updated = await replaceBookableItem(cart, row);
      setCart(updated);
      setSelectedServiceName(row.name);
      const dates = await updated.getBookableDates({ limit: 60 });
      setBookableDates(dates.map((d: { date: string }) => ({ date: d.date })));
      setSelectedDateStr(null);
      setTimeSlots([]);
      setStep("schedule");
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Could not add service"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  async function onSelectDate(dateStr: string) {
    if (!cart) return;
    setSelectedDateStr(dateStr);
    setLoadingTimes(true);
    setError(null);
    setTimeSlots([]);
    try {
      const times = await cart.getBookableTimes({ date: dateStr });
      setTimeSlots(times);
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Could not load times"
        )
      );
    } finally {
      setLoadingTimes(false);
    }
  }

  async function reserveTime(slot: object) {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await cart.reserveBookableItems(slot);
      setCart(updated);
      setStep("details");
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Could not reserve time"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveDetails() {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      const digits = phone.replace(/\D/g, "");
      const updated = await cart.update({
        clientInformation: {
          firstName,
          lastName,
          email,
          ...(digits.length >= 10 ? { phoneNumber: phone } : {}),
        },
      });
      setCart(updated);
      if (needsIntakeStep(updated)) {
        setStep("intake");
      } else {
        setStep("confirm");
      }
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Could not save your information"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitIntakeAnswers(answers: IntakeAnswer[]) {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      let c = cart;
      for (const { questionId, value } of answers) {
        const q = c.bookingQuestions.find(
          (x: { id: string }) => x.id === questionId
        );
        if (!q) throw new Error("Question not found");
        c = await q.submitAnswer(value);
      }
      setCart(c);
      setStep("confirm");
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Could not save answers"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  function paymentRequired(): boolean {
    try {
      return Boolean(cart?.summary?.paymentMethodRequired);
    } catch {
      return true;
    }
  }

  async function completeBooking() {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      let nextCart = cart;
      const needPay = paymentRequired();

      if (needPay) {
        if (
          cardNumber.replace(/\s/g, "").length < 15 ||
          !cardCvv ||
          !cardExpMonth ||
          !cardExpYear ||
          !cardZip
        ) {
          setError(
            "A card on file is required to complete this booking. Enter your card details."
          );
          setBusy(false);
          return;
        }
        nextCart = await nextCart.addCardPaymentMethod({
          card: {
            name: cardName || `${firstName} ${lastName}`,
            number: cardNumber.replace(/\s/g, ""),
            cvv: cardCvv,
            exp_month: parseInt(cardExpMonth, 10),
            exp_year: parseInt(cardExpYear, 10),
            address_postal_code: cardZip,
          },
        });
        setCart(nextCart);
      }

      await nextCart.checkout();
      setStep("success");
    } catch (e) {
      setError(
        mapBookingError(
          e instanceof Error ? e.message : "Checkout could not be completed"
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const dateSummary =
    selectedDateStr &&
    new Date(selectedDateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

  const timeSummary = useMemo(() => {
    if (!cart?.startTime) return null;
    try {
      return new Date(cart.startTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  }, [cart]);

  const filteredServices = useMemo(() => {
    const q = serviceFilter.trim().toLowerCase();
    if (!q) return bookableItems;
    return bookableItems.filter((i) => i.name.toLowerCase().includes(q));
  }, [bookableItems, serviceFilter]);

  if (!isBoulevardConfigured()) {
    return (
      <div className={`${bookingPanel} p-8 max-w-[560px]`}>
        <p className={bookingEyebrow}>Setup required</p>
        <p className="text-silver-dark mb-4">
          Add Boulevard credentials from the{" "}
          <a
            href="https://developers.joinblvd.com/"
            className="text-rose-text underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developer Portal
          </a>
          : <code className="text-xs bg-silver-pale px-1">NEXT_PUBLIC_BOULEVARD_API_KEY</code>,{" "}
          <code className="text-xs bg-silver-pale px-1">NEXT_PUBLIC_BOULEVARD_BUSINESS_ID</code>
        </p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className={`${bookingPanel} bg-rose-blush/90 p-8 md:p-10 max-w-[640px]`}>
        <p className={bookingEyebrow}>Ageless beauty</p>
        <h2 className="font-bold text-2xl md:text-3xl tracking-[0.06em] uppercase text-rose-text mb-3">
          You&apos;re confirmed
        </h2>
        <p className="text-silver mb-8 max-w-[520px] leading-relaxed">
          You&apos;ll receive a confirmation email shortly. If you need to
          reschedule, call our studio—we&apos;re happy to help.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href="/">Back to home</Button>
          <Button href="/contact" variant="ghost">
            Contact us
          </Button>
        </div>
      </div>
    );
  }

  const summaryProps = {
    locationName: selectedLocationName,
    serviceName: selectedServiceName,
    dateLabel: dateSummary,
    timeLabel: timeSummary,
  };

  return (
    <div className="max-w-[1100px] mx-auto text-left">
      <div className="mb-8 lg:hidden">
        <BookingAppointmentSummary {...summaryProps} />
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          {error && (
            <div className={`${bookingAlertError} mb-6`} role="alert">
              {error}
            </div>
          )}

          <BookingProgress phases={phases} activeId={progressActiveId} />

          {step === "location" && locations.length > 1 && (
            <div className="space-y-6">
              <div>
                <p className={bookingEyebrow}>Location</p>
                <h2 className={bookingTitle}>Choose a studio</h2>
                <p className={bookingSubtitle}>
                  Select Vacaville or Napa to see available treatments and times.
                </p>
              </div>
              <div className="space-y-2">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      client &&
                      void startCartWithLocation(client, loc.id, loc.name)
                    }
                    className={bookingChoice}
                  >
                    <span className="font-medium text-silver-dark">
                      {loc.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "location" && locations.length === 1 && busy && (
            <div className="space-y-3" aria-busy="true">
              <div className={bookingSkeleton} />
              <p className="text-sm text-silver">Preparing your booking…</p>
            </div>
          )}

          {step === "service" && (
            <div className="space-y-6">
              <div>
                <p className={bookingEyebrow}>Treatment</p>
                <h2 className={bookingTitle}>What would you like to book?</h2>
                <p className={bookingSubtitle}>
                  Choose a service. You can search by name if the list is long.
                </p>
              </div>
              <input
                type="search"
                className={bookingInput}
                placeholder="Search services…"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                aria-label="Filter services"
              />
              <div className="space-y-2 max-h-[min(420px,50vh)] overflow-y-auto pr-1">
                {filteredServices.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={busy}
                    onClick={() => void pickService(item.id)}
                    className={bookingChoice}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              {filteredServices.length === 0 && !busy && (
                <div className={bookingEmpty}>
                  No services match your search. Try another term—or call us
                  for help booking.
                </div>
              )}
              {bookableItems.length === 0 && !busy && (
                <div className={bookingEmpty}>
                  No online-bookable services for this location in Boulevard.
                  Please call the studio to schedule.
                </div>
              )}
              {(multiLocation || urlPreselectUsed) && (
                <button
                  type="button"
                  className={bookingLinkBack}
                  onClick={() => {
                    if (multiLocation) {
                      resetFlow();
                      setStep("location");
                    } else if (urlPreselectUsed) {
                      setStep("schedule");
                    }
                  }}
                >
                  {multiLocation ? "Change location" : "Back"}
                </button>
              )}
            </div>
          )}

          {step === "schedule" && (
            <div className="space-y-8">
              <div>
                <p className={bookingEyebrow}>Schedule</p>
                <h2 className={bookingTitle}>Pick a date and time</h2>
                <p className={bookingSubtitle}>
                  Select a date, then choose an available time below.
                </p>
              </div>

              <div>
                <p className={`${bookingFieldLabel} mb-2`}>Date</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {bookableDates.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      disabled={busy}
                      onClick={() => void onSelectDate(d.date)}
                      className={`${bookingChoice} text-sm py-2.5 ${
                        selectedDateStr === d.date
                          ? "border-rose bg-rose-blush"
                          : ""
                      }`}
                    >
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </button>
                  ))}
                </div>
                {bookableDates.length === 0 && !busy && (
                  <div className={bookingEmpty}>
                    No open dates in this range. Call the studio for more
                    options—we may have flexibility that isn&apos;t shown online.
                  </div>
                )}
              </div>

              {selectedDateStr && (
                <div>
                  <p className={`${bookingFieldLabel} mb-2`}>Time</p>
                  {loadingTimes ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className={bookingSkeleton} />
                      ))}
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className={bookingEmpty}>
                      No times left on this date. Pick another day.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[min(320px,40vh)] overflow-y-auto pr-1">
                      {timeSlots.map(
                        (t: { id: string; startTime: string }, idx: number) => (
                          <button
                            key={t.id ?? idx}
                            type="button"
                            disabled={busy}
                            onClick={() => void reserveTime(t)}
                            className={`${bookingChoice} text-sm py-2.5`}
                          >
                            {new Date(t.startTime).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  className={bookingLinkBack}
                  onClick={() => {
                    if (treatmentVisible) {
                      setStep("service");
                    } else if (multiLocation) {
                      resetFlow();
                      setStep("location");
                    } else {
                      setStep("service");
                    }
                  }}
                >
                  Back
                </button>
                {urlPreselectUsed && step === "schedule" && (
                  <button
                    type="button"
                    className={bookingLinkBack}
                    onClick={() => setStep("service")}
                  >
                    Change treatment
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-6">
              <div>
                <p className={bookingEyebrow}>Your information</p>
                <h2 className={bookingTitle}>How can we reach you?</h2>
                <p className={bookingSubtitle}>
                  We&apos;ll send your confirmation and appointment details here.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={bookingFieldLabel} htmlFor="fn">
                    First name
                  </label>
                  <input
                    id="fn"
                    className={bookingInput}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className={bookingFieldLabel} htmlFor="ln">
                    Last name
                  </label>
                  <input
                    id="ln"
                    className={bookingInput}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label className={bookingFieldLabel} htmlFor="em">
                  Email
                </label>
                <input
                  id="em"
                  type="email"
                  className={bookingInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={bookingFieldLabel} htmlFor="ph">
                  Phone
                </label>
                <input
                  id="ph"
                  type="tel"
                  className={bookingInput}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  type="button"
                  disabled={
                    busy || !firstName || !lastName || !email || !phone
                  }
                  onClick={() => void saveDetails()}
                >
                  Continue
                </Button>
                <button
                  type="button"
                  className={bookingLinkBack}
                  onClick={() => setStep("schedule")}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === "intake" && (
            <div className="space-y-6">
              <div>
                <p className={bookingEyebrow}>A few more details</p>
                <h2 className={bookingTitle}>Help us prepare for your visit</h2>
              </div>
              <BookingQuestionsForm
                busy={busy}
                questions={unanswerQs}
                onContinue={submitIntakeAnswers}
                onBack={() => setStep("details")}
              />
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6">
              <div>
                <p className={bookingEyebrow}>Confirm</p>
                <h2 className={bookingTitle}>
                  {paymentRequired()
                    ? "Card on file"
                    : "Confirm your appointment"}
                </h2>
                <p className={bookingSubtitle}>
                  {paymentRequired()
                    ? "Your location requires a card to hold this appointment. You won’t be charged until checkout rules in Boulevard apply."
                    : "No card is required to complete this booking. Tap confirm to finalize."}
                </p>
              </div>

              {paymentRequired() && (
                <>
                  <div>
                    <label className={bookingFieldLabel}>Name on card</label>
                    <input
                      className={bookingInput}
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      autoComplete="cc-name"
                    />
                  </div>
                  <div>
                    <label className={bookingFieldLabel}>Card number</label>
                    <input
                      className={bookingInput}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      autoComplete="cc-number"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className={bookingFieldLabel}>MM</label>
                      <input
                        className={bookingInput}
                        value={cardExpMonth}
                        onChange={(e) => setCardExpMonth(e.target.value)}
                        autoComplete="cc-exp-month"
                      />
                    </div>
                    <div>
                      <label className={bookingFieldLabel}>YYYY</label>
                      <input
                        className={bookingInput}
                        value={cardExpYear}
                        onChange={(e) => setCardExpYear(e.target.value)}
                        autoComplete="cc-exp-year"
                      />
                    </div>
                    <div>
                      <label className={bookingFieldLabel}>CVV</label>
                      <input
                        className={bookingInput}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={bookingFieldLabel}>Billing ZIP</label>
                    <input
                      className={bookingInput}
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      autoComplete="postal-code"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => void completeBooking()}
                >
                  {busy
                    ? "Processing…"
                    : paymentRequired()
                      ? "Complete booking"
                      : "Confirm appointment"}
                </Button>
                <button
                  type="button"
                  className={bookingLinkBack}
                  onClick={() => setStep("details")}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <BookingAppointmentSummary {...summaryProps} />
        </div>
      </div>
    </div>
  );
}

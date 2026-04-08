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

type Step =
  | "location"
  | "service"
  | "date"
  | "time"
  | "details"
  | "payment"
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

export function BoulevardCustomBooking() {
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

  const [step, setStep] = useState<Step>("location");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cart, setCart] = useState<any>(null);

  const [bookableItems, setBookableItems] = useState<
    { id: string; name: string; raw: object }[]
  >([]);

  /** Boulevard returns `date` only (no stable id) on cartBookableDates */
  const [bookableDates, setBookableDates] = useState<{ date: string }[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

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

  const resetFlow = useCallback(() => {
    setStep("location");
    setCart(null);
    setBookableItems([]);
    setBookableDates([]);
    setSelectedDateStr(null);
    setTimeSlots([]);
    setError(null);
  }, []);

  const startCartWithLocation = useCallback(
    async (
      blvd: Blvd,
      locId: string,
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
          const updated = await newCart.addBookableItem(
            items.find((i) => i.id === pre)!.raw
          );
          setCart(updated);
          const dates = await updated.getBookableDates({ limit: 60 });
          setBookableDates(
            dates.map((d: { date: string }) => ({ date: d.date }))
          );
          setStep("date");
        } else {
          setCart(newCart);
          setStep("service");
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not start booking session"
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
          await startCartWithLocation(client, mapped[0].id);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not load Boulevard locations"
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
      const updated = await cart.addBookableItem(row.raw);
      setCart(updated);
      const dates = await updated.getBookableDates({ limit: 60 });
      setBookableDates(dates.map((d: { date: string }) => ({ date: d.date })));
      setStep("date");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not add service to booking"
      );
    } finally {
      setBusy(false);
    }
  }

  async function loadTimesForDate(dateStr: string) {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      const times = await cart.getBookableTimes({ date: dateStr });
      setTimeSlots(times);
      setSelectedDateStr(dateStr);
      setStep("time");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load available times"
      );
    } finally {
      setBusy(false);
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
        e instanceof Error ? e.message : "Could not reserve this time"
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
      setStep("payment");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save your information"
      );
    } finally {
      setBusy(false);
    }
  }

  async function completeBooking() {
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      let nextCart = cart;
      if (
        cardNumber.replace(/\s/g, "").length >= 15 &&
        cardCvv &&
        cardExpMonth &&
        cardExpYear &&
        cardZip
      ) {
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
        e instanceof Error
          ? e.message
          : "Checkout failed — verify card details or try again"
      );
    } finally {
      setBusy(false);
    }
  }

  if (!isBoulevardConfigured()) {
    return (
      <div className="rounded-lg border border-silver-light bg-rose-blush p-8 text-left max-w-[560px] mx-auto">
        <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-2">
          Setup required
        </p>
        <p className="text-silver-dark mb-4">
          Add your Boulevard API credentials from the{" "}
          <a
            href="https://developers.joinblvd.com/"
            className="text-rose-text underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Boulevard Developer Portal
          </a>
          :
        </p>
        <ul className="text-sm text-silver space-y-2 list-disc pl-5">
          <li>
            <code className="bg-white px-1 rounded">NEXT_PUBLIC_BOULEVARD_API_KEY</code>{" "}
            — API key for the Book SDK (from your app in the portal)
          </li>
          <li>
            <code className="bg-white px-1 rounded">NEXT_PUBLIC_BOULEVARD_BUSINESS_ID</code>{" "}
            — Business UUID
          </li>
          <li>
            Optional:{" "}
            <code className="bg-white px-1 rounded">NEXT_PUBLIC_BOULEVARD_USE_SANDBOX=true</code>{" "}
            to hit Boulevard sandbox
          </li>
        </ul>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="rounded-lg border border-silver-light bg-rose-blush p-8 max-w-[640px] mx-auto text-left">
        <p className="font-bold text-[0.6875rem] tracking-[0.2em] uppercase text-silver mb-2">
          Confirmed
        </p>
        <h2 className="font-medium text-2xl text-silver-dark mb-2">
          You&apos;re booked
        </h2>
        <p className="text-silver mb-6">
          Check your email for confirmation. Contact us if you need to
          reschedule.
        </p>
        <Button href="/">Back to home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto text-left">
      {error && (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {step === "location" && locations.length > 1 && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 1 of 6 — Location</p>
          <div className="space-y-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                disabled={busy}
                onClick={() => client && void startCartWithLocation(client, loc.id)}
                className="w-full text-left rounded-lg border border-silver-light px-4 py-4 hover:border-rose hover:bg-rose-blush transition-colors disabled:opacity-50"
              >
                <span className="font-medium text-silver-dark">{loc.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "location" && locations.length === 1 && busy && (
        <p className="text-sm text-silver">Starting booking…</p>
      )}

      {step === "service" && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 2 of 6 — Service</p>
          <div className="space-y-2">
            {bookableItems.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={busy}
                onClick={() => void pickService(item.id)}
                className="w-full text-left rounded-lg border border-silver-light px-4 py-4 hover:border-rose hover:bg-rose-blush transition-colors disabled:opacity-50"
              >
                {item.name}
              </button>
            ))}
          </div>
          {bookableItems.length === 0 && !busy && (
            <p className="text-silver text-sm">
              No bookable services from Boulevard for this location.
            </p>
          )}
          {locations.length > 1 && (
            <button
              type="button"
              className="text-sm text-silver underline"
              onClick={resetFlow}
            >
              Start over
            </button>
          )}
        </div>
      )}

      {step === "date" && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 3 of 6 — Date</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {bookableDates.map((d) => (
              <button
                key={d.date}
                type="button"
                disabled={busy}
                onClick={() => void loadTimesForDate(d.date)}
                className="rounded-lg border border-silver-light px-3 py-2 text-sm hover:border-rose hover:bg-rose-blush disabled:opacity-50"
              >
                {new Date(d.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="text-sm text-silver underline"
            onClick={() => setStep("service")}
          >
            Back
          </button>
        </div>
      )}

      {step === "time" && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 4 of 6 — Time</p>
          {selectedDateStr && (
            <p className="text-sm text-silver-dark">
              {new Date(selectedDateStr).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
            {timeSlots.map(
              (t: { id: string; startTime: string }, idx: number) => (
                <button
                  key={t.id ?? idx}
                  type="button"
                  disabled={busy}
                  onClick={() => void reserveTime(t)}
                  className="rounded-lg border border-silver-light px-3 py-2 text-sm hover:border-rose hover:bg-rose-blush disabled:opacity-50"
                >
                  {new Date(t.startTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="text-sm text-silver underline"
            onClick={() => setStep("date")}
          >
            Back
          </button>
        </div>
      )}

      {step === "details" && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 5 of 6 — Your details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-silver-dark mb-1">
                First name
              </label>
              <input
                className="w-full border border-silver-light rounded px-3 py-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-dark mb-1">
                Last name
              </label>
              <input
                className="w-full border border-silver-light rounded px-3 py-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-silver-dark mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-silver-light rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silver-dark mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full border border-silver-light rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4 pt-2 flex-wrap">
            <Button
              type="button"
              disabled={busy || !firstName || !lastName || !email || !phone}
              onClick={() => void saveDetails()}
            >
              Continue
            </Button>
            <button
              type="button"
              className="text-sm text-silver underline"
              onClick={() => setStep("time")}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-4">
          <p className="text-sm text-silver">Step 6 of 6 — Payment</p>
          <p className="text-sm text-silver">
            Enter a card if your location requires one to hold the appointment;
            otherwise leave blank and tap Complete (depends on your Boulevard
            settings).
          </p>
          <div>
            <label className="block text-sm font-medium text-silver-dark mb-1">
              Name on card
            </label>
            <input
              className="w-full border border-silver-light rounded px-3 py-2"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              autoComplete="cc-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-silver-dark mb-1">
              Card number
            </label>
            <input
              className="w-full border border-silver-light rounded px-3 py-2"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              autoComplete="cc-number"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-silver-dark mb-1">
                MM
              </label>
              <input
                className="w-full border border-silver-light rounded px-3 py-2"
                value={cardExpMonth}
                onChange={(e) => setCardExpMonth(e.target.value)}
                autoComplete="cc-exp-month"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-dark mb-1">
                YYYY
              </label>
              <input
                className="w-full border border-silver-light rounded px-3 py-2"
                value={cardExpYear}
                onChange={(e) => setCardExpYear(e.target.value)}
                autoComplete="cc-exp-year"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-silver-dark mb-1">
                CVV
              </label>
              <input
                className="w-full border border-silver-light rounded px-3 py-2"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                autoComplete="cc-csc"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-silver-dark mb-1">
              Billing ZIP
            </label>
            <input
              className="w-full border border-silver-light rounded px-3 py-2"
              value={cardZip}
              onChange={(e) => setCardZip(e.target.value)}
              autoComplete="postal-code"
            />
          </div>
          <div className="flex gap-4 pt-2 flex-wrap">
            <Button type="button" disabled={busy} onClick={() => void completeBooking()}>
              {busy ? "Processing..." : "Complete booking"}
            </Button>
            <button
              type="button"
              className="text-sm text-silver underline"
              onClick={() => setStep("details")}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {busy && (
        <p className="mt-4 text-sm text-silver">Working…</p>
      )}
    </div>
  );
}

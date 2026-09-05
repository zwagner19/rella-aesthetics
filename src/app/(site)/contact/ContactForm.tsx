"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { EXTRA_CONTACT_INTERESTS } from "@/lib/contact-intents";
import { services } from "@/lib/data";

export function ContactForm({
  initialServiceInterest = "",
}: {
  initialServiceInterest?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [contactMethodError, setContactMethodError] = useState("");
  const [serviceInterest, setServiceInterest] = useState(initialServiceInterest);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const phone = typeof data.phone === "string" ? data.phone.trim() : "";

    if (!email && !phone) {
      setContactMethodError(
        "Enter an email address or phone number so the Rella team can reach you.",
      );
      setStatus("idle");
      return;
    }

    setContactMethodError("");
    setStatus("sending");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: { accepted?: boolean } = await response
        .json()
        .catch(() => ({}));
      const honeypotFilled = Boolean(data.website);
      if (!response.ok || (result.accepted !== true && !honeypotFilled)) {
        throw new Error("Lead was not accepted");
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="border border-rose-light bg-rose-blush p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="mb-2 text-lg font-medium text-rose-text">Thank you!</p>
        <p className="text-ink/70">
          Your message reached Rella. A member of our team will follow up.
        </p>
      </div>
    );
  }

  const fieldClassName =
    "w-full rounded border border-silver bg-white px-4 py-3 text-ink transition-colors focus:border-rose-text focus:ring-2 focus:ring-rose/30";
  const labelClassName = "mb-1 block text-sm font-medium text-rose-text";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div hidden aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className={labelClassName}>
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={120}
          autoComplete="name"
          className={fieldClassName}
        />
      </div>

      <fieldset>
        <legend className={labelClassName}>Best way to reach you</legend>
        <p id="contact-method-help" className="mb-3 mt-1 text-xs text-ink/70">
          Enter at least one: email or phone.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClassName}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              maxLength={254}
              autoComplete="email"
              inputMode="email"
              aria-invalid={contactMethodError ? true : undefined}
              aria-describedby={
                contactMethodError
                  ? "contact-method-help contact-method-error"
                  : "contact-method-help"
              }
              onInput={() => setContactMethodError("")}
              className={fieldClassName}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClassName}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              maxLength={40}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={contactMethodError ? true : undefined}
              aria-describedby={
                contactMethodError
                  ? "contact-method-help contact-method-error"
                  : "contact-method-help"
              }
              onInput={() => setContactMethodError("")}
              className={fieldClassName}
            />
          </div>
        </div>
        {contactMethodError ? (
          <p
            id="contact-method-error"
            role="alert"
            className="mt-3 text-sm font-medium text-ink"
          >
            {contactMethodError}
          </p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="service" className={labelClassName}>
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          value={serviceInterest}
          onChange={(event) => setServiceInterest(event.currentTarget.value)}
          className={fieldClassName}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          {EXTRA_CONTACT_INTERESTS.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className={labelClassName}>
          Preferred Clinic <span className="font-normal">(optional)</span>
        </label>
        <select id="location" name="location" className={fieldClassName}>
          <option value="">Select a clinic</option>
          <option value="Vacaville">Vacaville (542 Main St)</option>
          <option value="Napa">Napa (1541 3rd St)</option>
          <option value="No preference">No preference (help me choose)</option>
        </select>
        <p className="mt-2 text-xs text-ink/70">
          This helps route your question to the right clinic. You can change
          locations later.
        </p>
      </div>

      <div>
        <label htmlFor="message" className={labelClassName}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className={`${fieldClassName} resize-y`}
        />
        <p className="mt-2 text-xs leading-relaxed text-ink/70">
          Please do not include sensitive medical information. This form is for
          general questions and is not monitored for urgent or emergency care.
        </p>
      </div>

      {status === "error" ? (
        <div
          role="alert"
          className="border border-rose-text bg-rose-blush p-4 text-sm text-ink"
        >
          <p className="font-medium">Your message was not sent.</p>
          <p>
            Please try again, call{" "}
            <a className="font-medium underline" href="tel:+17073582928">
              707.358.2928
            </a>
            , or email{" "}
            <a
              className="font-medium underline"
              href="mailto:info@experiencerella.com"
            >
              info@experiencerella.com
            </a>
            .
          </p>
        </div>
      ) : null}

      <Button type="submit" disabled={status === "sending"} disableHover>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

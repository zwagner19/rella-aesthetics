"use client";

import { useRef, useState, type FormEvent } from "react";
import { EXTRA_CONTACT_INTERESTS } from "@/lib/contact-intents";
import { services } from "@/lib/data";
import { ASSESSMENT_CONTACT_CONSENT, CONTACT_CONSENT_POLICY_VERSION, MARKETING_CONSENT } from "@/lib/guided-booking/policies";

export function ContactForm({
  initialServiceInterest = "",
}: {
  initialServiceInterest?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "pending">(
    "idle",
  );
  const [contactMethodError, setContactMethodError] = useState("");
  const [serviceInterest, setServiceInterest] = useState(initialServiceInterest);
  const [phoneProvided, setPhoneProvided] = useState(false);
  const submitting = useRef(false);
  const submissionId = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === "pending") return;
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
    if (phone && data.operationalConsent !== "on") {
      setContactMethodError("Please confirm the required contact consent before sending.");
      return;
    }
    submitting.current = true;
    submissionId.current ??= crypto.randomUUID();
    setStatus("sending");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submissionId: submissionId.current,
          consent: { policyVersion: CONTACT_CONSENT_POLICY_VERSION, operational: data.operationalConsent === "on",
            marketing: Boolean(phone) && data.marketingConsent === "on" } }),
      });
      const result: { accepted?: boolean; pending?: boolean } = await response
        .json()
        .catch(() => ({}));
      const honeypotFilled = Boolean(data.website);
      if (result.pending) { setStatus("pending"); return; }
      if (!response.ok) { setStatus("error"); return; }
      if (result.accepted !== true && !honeypotFilled) { setStatus("pending"); return; }
      setStatus("sent");
      form.reset();
    } catch {
      // A lost response can follow a saved lead; do not invite another submission.
      setStatus("pending");
    } finally { submitting.current = false; }
  }

  if (status === "sent") {
    return (
      <div
        className="border border-rule bg-white px-6 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="mb-2 text-lg font-medium text-ink">Thank you</p>
        <p className="text-sm font-light leading-relaxed text-silver">
          Your message reached Rella. A member of our team will follow up.
        </p>
      </div>
    );
  }

  const fieldClassName =
    "w-full border border-rule bg-white px-4 py-3 text-base font-light text-ink transition-colors focus:border-ink focus:outline-none";
  const labelClassName = "mb-1.5 block text-sm font-medium text-ink";

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
        <p id="contact-method-help" className="mb-3 mt-1 text-xs font-light text-silver">
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
              onInput={(event) => { setContactMethodError(""); setPhoneProvided(Boolean(event.currentTarget.value.trim())); }}
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
        <p className="mt-2 text-xs font-light text-silver">
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
          required
          maxLength={2000}
          className={`${fieldClassName} resize-y`}
        />
        <p className="mt-2 text-xs font-light leading-relaxed text-silver">
          Please do not include sensitive medical information. This form is for
          general questions and is not monitored for urgent or emergency care.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 text-sm font-light leading-relaxed text-ink/80">
          <input type="checkbox" name="operationalConsent" required={phoneProvided} disabled={status === "sending" || status === "pending"}
            className="mt-1 size-4 shrink-0 accent-rose" />
          <span>{ASSESSMENT_CONTACT_CONSENT}</span>
        </label>
        <label className="flex items-start gap-3 text-sm font-light leading-relaxed text-ink/80">
          <input type="checkbox" name="marketingConsent" disabled={!phoneProvided || status === "sending" || status === "pending"}
            className="mt-1 size-4 shrink-0 accent-rose" />
          <span>{MARKETING_CONSENT}</span>
        </label>
      </div>

      {status === "pending" ? <div role="status" className="border border-rose-text bg-rose-blush p-4 text-sm text-ink">
        We could not verify that your request and contact choices were saved. Please call <a className="font-medium underline" href="tel:+17073582928">707.358.2928</a> before sending another request.
      </div> : null}

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

      <button
        type="submit"
        disabled={status === "sending" || status === "pending"}
        className="rella-cta-rect rella-cta-rect--filled disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data";
import { dispatchConversion } from "@/lib/conversion-tracking";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: { accepted?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      if (result.accepted === true) {
        dispatchConversion("contact_form_success");
      }
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-rose-blush border border-rose-light rounded-lg p-8 text-center">
        <p className="font-medium text-silver-dark text-lg mb-2">Thank you!</p>
        <p className="text-silver">Your message reached Rella. A member of our team will follow up.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="absolute -left-[9999px]" aria-hidden="true">
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
        <label htmlFor="name" className="block text-sm font-medium text-silver-dark mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-silver-dark mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-silver-dark mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-silver-dark mb-1">
          Service Interest
        </label>
        <select
          id="service"
          name="service"
          className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Membership Questions">Membership Questions</option>
        </select>
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-silver-dark mb-1">
          Preferred Clinic <span className="font-normal text-silver">(optional)</span>
        </label>
        <select
          id="location"
          name="location"
          className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
        >
          <option value="">Select a clinic</option>
          <option value="Vacaville">Vacaville — 542 Main St</option>
          <option value="Napa">Napa — 1541 3rd St</option>
          <option value="No preference">No preference — help me choose</option>
        </select>
        <p className="mt-2 text-xs leading-relaxed text-silver">
          This helps the team route your question to the right clinic. You can still change locations later.
        </p>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-silver-dark mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors resize-y"
        />
        <p className="mt-2 text-xs leading-relaxed text-silver">
          Please do not include sensitive medical information. This form is for general questions and is not monitored for urgent or emergency care.
        </p>
      </div>

      {status === "error" && (
        <div role="alert" className="rounded-lg border border-rose-light bg-rose-blush p-4 text-sm leading-relaxed text-silver-dark">
          <p className="font-medium text-rose-dark">Your message was not sent.</p>
          <p>
            Please try again, call{" "}
            <a className="font-medium underline underline-offset-2" href="tel:+17073582928">
              707.358.2928
            </a>
            , or email{" "}
            <a className="font-medium underline underline-offset-2" href="mailto:info@experiencerella.com">
              info@experiencerella.com
            </a>
            .
          </p>
        </div>
      )}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

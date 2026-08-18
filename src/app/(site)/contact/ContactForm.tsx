"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/data";

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
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-white border border-silver-pale p-8 text-center">
        <p className="font-medium text-silver-dark text-lg mb-2">Thank you!</p>
        <p className="text-silver">We&apos;ll be in touch within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-silver-dark mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full min-h-11 border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
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
            className="w-full min-h-11 border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
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
            className="w-full min-h-11 border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
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
          className="w-full min-h-11 border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors"
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-silver-dark mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full min-h-11 border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20 transition-colors resize-y"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-rose-dark">Something went wrong. Please try again or call us directly.</p>
      )}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

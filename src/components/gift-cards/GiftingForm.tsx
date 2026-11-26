"use client";
import { useState, type FormEvent } from "react";
import { COPY } from "@/lib/gift-cards/config";
import s from "./gift.module.css";

export type GiftSubmit = (v: {
  recipientFirstName: string;
  recipientEmail: string;
  senderName: string;
  message: string;
}) => Promise<
  | { status: "sent"; recipientFirstName: string }
  | { status: "invalid-input"; errors: Record<string, string> }
  | { status: "error"; message: string; retryable?: boolean }
>;

type Props = {
  purchaserName: string;
  onSubmit: GiftSubmit;
  onSendLater: () => Promise<{ ok: boolean; message: string; recoveryUrl?: string }>;
  onSent: (recipientFirstName: string) => void;
};

export function GiftingForm({ purchaserName, onSubmit, onSendLater, onSent }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "uncertain" | "later" | "later-done">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<string | null>(null);
  const [laterMessage, setLaterMessage] = useState<string | null>(null);
  const [recoveryUrl, setRecoveryUrl] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const f = new FormData(e.currentTarget);
    const v = {
      recipientFirstName: String(f.get("recipientFirstName") ?? ""),
      recipientEmail: String(f.get("recipientEmail") ?? ""),
      senderName: String(f.get("senderName") ?? ""),
      message: String(f.get("message") ?? ""),
    };
    const local: Record<string, string> = {};
    if (!v.recipientFirstName.trim()) local.recipientFirstName = "Enter their first name.";
    if (!/^\S+@\S+\.\S+$/.test(v.recipientEmail.trim())) local.recipientEmail = "Enter a valid email address.";
    if (!v.senderName.trim()) local.senderName = "Enter your name.";
    setErrors(local);
    setAlert(null);
    if (Object.keys(local).length) return;
    setState("sending");
    try {
      const r = await onSubmit(v);
      if (r.status === "sent") return onSent(r.recipientFirstName);
      if (r.status === "invalid-input") setErrors(r.errors);
      else { setAlert(r.message); setState(r.retryable === true ? "idle" : "uncertain"); return; }
    } catch {
      setAlert("We couldn't confirm delivery. Please don't resend; call Rella so we can check it.");
      setState("uncertain");
      return;
    }
    setState("idle");
  }

  async function later() {
    setState("later");
    try {
      const r = await onSendLater();
      setLaterMessage(r.message);
      setRecoveryUrl(r.recoveryUrl ?? null);
      setState(r.ok ? "later-done" : "idle");
      if (!r.ok) setAlert(r.message);
    } catch {
      setAlert("We couldn't save that just now. Please try again.");
      setState("idle");
    }
  }

  if (state === "later-done") {
    return (
      <section className={s.form} aria-live="polite">
        <h2 className={`${s.h2} ${s.italic}`}>Whenever you&apos;re ready.</h2>
        <p className={s.lede}>{laterMessage}</p>
        {recoveryUrl ? <a href={recoveryUrl} className={s.linkBtn} referrerPolicy="no-referrer">Your private gifting link — keep this for later</a> : null}
      </section>
    );
  }

  const field = (name: string, label: string, input: React.ReactNode) => (
    <label className={s.field} htmlFor={`gift-${name}`}>
      <span className={s.label}>{label}</span>
      {input}
      {errors[name] ? (
        <span className={s.fieldError} id={`gift-${name}-error`}>
          {errors[name]}
        </span>
      ) : null}
    </label>
  );
  const describedBy = (n: string) => (errors[n] ? `gift-${n}-error` : undefined);

  return (
    <section className={s.form} aria-labelledby="gift-form-title">
      <h2 id="gift-form-title" className={`${s.h2} ${s.italic}`}>
        {COPY.gifting.headline}
      </h2>
      <p className={s.lede}>{COPY.gifting.body}</p>
      {alert ? (
        <p className={s.alert} role="alert">
          {alert}
        </p>
      ) : null}
      <form onSubmit={submit} noValidate>
        <div className={s.grid2}>
          {field(
            "recipientFirstName",
            "Recipient's first name",
            <input id="gift-recipientFirstName" name="recipientFirstName" className={s.input} autoComplete="off" maxLength={60} required aria-invalid={!!errors.recipientFirstName} aria-describedby={describedBy("recipientFirstName")} />,
          )}
          {field(
            "recipientEmail",
            "Recipient's email address",
            <input id="gift-recipientEmail" name="recipientEmail" type="email" inputMode="email" className={s.input} autoComplete="off" maxLength={254} required aria-invalid={!!errors.recipientEmail} aria-describedby={describedBy("recipientEmail")} />,
          )}
        </div>
        {field(
          "senderName",
          "Your name",
          <input id="gift-senderName" name="senderName" className={s.input} defaultValue={purchaserName} autoComplete="name" maxLength={80} required aria-invalid={!!errors.senderName} aria-describedby={describedBy("senderName")} />,
        )}
        <label className={s.field} htmlFor="gift-message">
          <span className={s.label}>
            Personalized message <span className={s.optional}>(optional)</span>
          </span>
          <textarea id="gift-message" name="message" className={s.textarea} maxLength={400} placeholder={COPY.gifting.messagePlaceholder} aria-describedby={describedBy("message")} />
          {errors.message ? <span className={s.fieldError} id="gift-message-error">{errors.message}</span> : null}
        </label>
        <div className={s.formActions}>
          <button type="submit" className={s.btn} disabled={state !== "idle"} aria-busy={state === "sending"}>
            {state === "sending" ? <span className={s.spinner} aria-hidden="true" /> : null}
            {state === "sending" ? "Sending…" : COPY.gifting.primary}
          </button>
          <button type="button" className={s.linkBtn} onClick={later} disabled={state !== "idle"}>
            {COPY.gifting.secondary}
          </button>
        </div>
      </form>
    </section>
  );
}

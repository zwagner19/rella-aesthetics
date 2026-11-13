"use client";

import { useState, type FormEvent } from "react";
import type { PackageAuthentication } from "@/lib/guided-booking/package-client";

export interface PackageIdentityFormProps {
  authentication: PackageAuthentication | null;
  busy?: boolean;
  error?: string | null;
  onRequestCode(input: { method: "email" | "sms"; contact: string }): Promise<void>;
  onVerifyCode(code: string): Promise<void>;
  onProfile(input: { profileId: string; dob?: string; captureDob?: boolean }): Promise<void>;
}

const inputClass = "min-h-11 w-full rounded-sm border border-rule/70 bg-white px-3 py-2.5 text-base text-ink outline-none focus:border-ink sm:text-sm";
const actionClass = "min-h-11 rounded-full border-[1.5px] border-rose bg-rose px-8 py-3.5 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50";
const labelClass = "mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink/55";

export function PackageIdentityForm({ authentication, busy = false, error, onRequestCode, onVerifyCode, onProfile }: PackageIdentityFormProps) {
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [profileId, setProfileId] = useState("");
  const [dob, setDob] = useState("");
  const [captureDob, setCaptureDob] = useState(false);
  const profiles = authentication?.state === "PROFILE_REQUIRED" || authentication?.state === "DOB_REQUIRED" ? authentication.profiles : [];
  const selected = authentication?.state === "DOB_REQUIRED" ? profiles[0] : profiles.find(profile => profile.id === profileId);
  const needsDob = authentication?.state === "DOB_REQUIRED" || selected?.dobRequired;
  const ready = Boolean(selected && (!needsDob || (/^\d{4}-\d{2}-\d{2}$/.test(dob) && (selected.dobOnFile || captureDob))));

  function selectProfile(next: string) {
    setProfileId(next);
    setDob("");
    setCaptureDob(false);
  }
  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !ready || busy) return;
    void onProfile({ profileId: selected.id, ...(needsDob ? { dob } : {}), ...(!selected.dobOnFile && captureDob ? { captureDob: true } : {}) });
  }

  return <div className="space-y-4" aria-busy={busy}>
    {!authentication ? <form className="space-y-4" onSubmit={event => {
      event.preventDefault();
      if (!busy) { setCode(""); void onRequestCode({ method, contact: contact.trim() }); }
    }}>
      <fieldset disabled={busy} className="space-y-4">
        <legend className={labelClass}>Send a verification code</legend>
        <div className="grid grid-cols-2 gap-3">
          {([ ["email", "Email"], ["sms", "Text message"] ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={method === value}
            onClick={() => { setMethod(value); setContact(""); }}
            className={`min-h-11 rounded-sm border px-4 py-3 text-sm ${method === value ? "border-ink bg-ink text-white" : "border-rule/70 bg-white text-ink"}`}>{label}</button>)}
        </div>
        <label className="block"><span className={labelClass}>{method === "email" ? "Email" : "Mobile phone"}</span>
          <input type={method === "email" ? "email" : "tel"} autoComplete={method === "email" ? "email" : "tel"} value={contact} onChange={event => setContact(event.target.value)} className={inputClass} required />
        </label>
        <button type="submit" disabled={busy || !contact.trim()} className={actionClass}>{busy ? "Sending…" : "Send code"}</button>
      </fieldset>
    </form> : null}
    {authentication?.state === "CODE_SENT" ? <form className="space-y-4" onSubmit={event => {
      event.preventDefault();
      if (!busy && /^\d{6}$/.test(code)) void onVerifyCode(code);
    }}>
      <p className="text-sm font-light text-silver">Enter the 6-digit code sent to {authentication.maskedDestination}.</p>
      <label className="block"><span className={labelClass}>Verification code</span>
        <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} disabled={busy} className={inputClass} required />
      </label>
      <button type="submit" disabled={busy || code.length !== 6} className={actionClass}>{busy ? "Verifying…" : "Verify code"}</button>
    </form> : null}
    {profiles.length ? <form className="space-y-4" onSubmit={submitProfile}>
      {authentication?.state === "PROFILE_REQUIRED" ? <fieldset disabled={busy} className="space-y-3">
        <legend className={labelClass}>Choose your profile</legend>
        {profiles.map(profile => <label key={profile.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-rule/70 bg-white px-4 py-3 text-sm text-ink">
          <input type="radio" name="package-profile" value={profile.id} checked={selected?.id === profile.id} onChange={() => selectProfile(profile.id)} className="accent-rose" />
          <span>{profile.name}</span>
        </label>)}
      </fieldset> : <p className="text-sm font-light text-silver">Verify the date of birth for {selected?.name}.</p>}
      {needsDob ? <div className="space-y-3">
        <label className="block"><span className={labelClass}>Date of birth</span>
          <input type="date" autoComplete="bday" value={dob} onChange={event => setDob(event.target.value)} disabled={busy} className={inputClass} required />
        </label>
        {selected && !selected.dobOnFile ? <label className="flex min-h-11 items-start gap-3 text-sm font-light text-silver">
          <input type="checkbox" checked={captureDob} onChange={event => setCaptureDob(event.target.checked)} disabled={busy} className="mt-1 accent-rose" />
          <span>I agree to save my date of birth to my Rella profile for account verification.</span>
        </label> : null}
      </div> : null}
      <button type="submit" disabled={busy || !ready} className={actionClass}>{busy ? "Verifying…" : "Continue"}</button>
    </form> : null}
    {authentication?.state === "AUTHENTICATED" ? <p className="text-sm font-light text-silver" role="status">{authentication.profile?.name ? `Verified as ${authentication.profile.name}.` : "Your account has been verified."}</p> : null}
    {error ? <p className="text-sm text-rose" role="alert">{error}</p> : null}
  </div>;
}

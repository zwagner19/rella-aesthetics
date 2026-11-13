'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { PORTAL_LOGIN, type Dashboard } from '@/lib/patient-portal/model';
import { parseDashboard } from '@/lib/patient-portal/response';
import { normalizeVerificationCode } from '@/lib/patient-portal/code';
import PatientDashboard from './PatientDashboard';
import styles from './portal.module.css';
const messages: Record<string, string> = {
  unavailable: 'We couldn’t connect right now. Please try again later or use your existing Boulevard account.',
  invalid_request: 'We couldn’t verify those details. Check your code and try again.',
  session_required: 'Your session has ended. Please sign in again.',
  rate_limited: 'Please wait a few minutes before trying again.',
  verification_required: 'Your code was verified, but this account needs an additional identity check that is not connected in this preview yet. Use your existing Boulevard account below. Your records have not been opened here.',
  profile_selection_required: 'Your code was verified. This email or phone is linked to more than one Boulevard profile. Profile selection is not connected in this preview yet. Use your existing Boulevard account below. Your records have not been opened here.',
  dob_verification_required: 'Your code was verified. Boulevard requires a date-of-birth check that is not connected in this preview yet. Use your existing Boulevard account below. Your records have not been opened here.',
};
async function request(operation: string, body?: object, signal?: AbortSignal): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/patient/${operation}`, { method: body ? 'POST' : 'GET', body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : undefined, signal });
  const data = await response.json();
  if (!response.ok) throw new Error(typeof data.error === 'string' && data.error in messages ? data.error : 'unavailable');
  if (!data || typeof data !== 'object') throw new Error('unavailable');
  return data;
}
export default function PatientPortal({ enabled }: { enabled: boolean }) {
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [contact, setContact] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'contact' | 'code' | 'identity-check'>('contact');
  const [busy, setBusy] = useState(enabled);
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState<Dashboard | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const phase = useRef<'contact' | 'challenge' | 'identity-check' | 'authenticated'>('contact');
  const generation = useRef(0), controller = useRef<AbortController | null>(null);
  const begin = useCallback(() => { controller.current?.abort(); controller.current = new AbortController(); return { current: ++generation.current, signal: controller.current.signal }; }, []);
  const refresh = useCallback(async () => {
    if (!enabled || document.hidden || phase.current === 'identity-check') return;
    const job = begin(); setBusy(true); setAccount(null);
    try {
      const result = await request('dashboard', undefined, job.signal);
      if (job.current !== generation.current) return;
      const parsed = parseDashboard(result);
      phase.current = 'authenticated';
      setAccount(document.hidden ? null : parsed.dashboard); setExpiresAt(parsed.expiresAt); setMessage('');
    } catch (error) {
      if (job.current === generation.current) {
        phase.current = 'contact'; setAccount(null); setExpiresAt(null); setStep('contact');
        const key = error instanceof Error ? error.message : 'unavailable';
        setMessage(key === 'session_required' ? '' : messages[key] ?? messages.unavailable);
      }
    } finally { if (job.current === generation.current) setBusy(false); }
  }, [begin, enabled]);
  useEffect(() => {
    // The initial fetch never supplies fixture data on failure.
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    const visibility = () => {
      // Opening an inbox must not replace a pending code challenge with an
      // authenticated dashboard read, which would clear its challenge cookie.
      if (document.hidden) {
        setAccount(null);
        if (phase.current !== 'challenge') { begin(); setBusy(false); }
      } else if (phase.current !== 'challenge' && phase.current !== 'identity-check') void refresh();
    };
    const pagehide = () => { begin(); setAccount(null); };
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted && phase.current !== 'challenge') void refresh(); };
    document.addEventListener('visibilitychange', visibility); window.addEventListener('pagehide', pagehide); window.addEventListener('pageshow', pageshow);
    return () => { clearTimeout(timer); begin(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', pagehide); window.removeEventListener('pageshow', pageshow); };
  }, [begin, refresh]);
  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setTimeout(() => { begin(); phase.current = 'contact'; setAccount(null); setExpiresAt(null); setStep('contact'); setCode(''); setBusy(false); setMessage(messages.session_required); }, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [begin, expiresAt]);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (busy || !enabled || step === 'identity-check') return;
    phase.current = 'challenge';
    const job = begin(); setBusy(true); setMessage('');
    try {
      const result = await request(step === 'contact' ? 'start' : 'verify', step === 'contact' ? { method, contact } : { code }, job.signal);
      if (job.current !== generation.current) return;
      if (typeof result.expiresAt !== 'number' || result.expiresAt <= Date.now()) throw new Error('unavailable');
      setExpiresAt(result.expiresAt); setContact(''); setCode('');
      if (step === 'contact') { if (result.state !== 'code_required') throw new Error('unavailable'); setStep('code'); }
      else { if (result.state !== 'authenticated') throw new Error('unavailable'); phase.current = 'authenticated'; await refresh(); }
    } catch (error) {
      if (job.current === generation.current) {
        const key = error instanceof Error ? error.message : 'unavailable'; setMessage(messages[key] ?? messages.unavailable); setCode('');
        if (step === 'contact') phase.current = 'contact';
        if (key === 'session_required') { phase.current = 'contact'; setStep('contact'); setExpiresAt(null); }
        if (['verification_required', 'profile_selection_required', 'dob_verification_required'].includes(key)) {
          phase.current = 'identity-check'; setStep('identity-check'); setExpiresAt(null);
        }
      }
    } finally { if (job.current === generation.current) setBusy(false); }
  }
  async function signOut() {
    phase.current = 'contact';
    const job = begin(); setAccount(null); setExpiresAt(null); setStep('contact'); setCode(''); setContact(''); setBusy(true); setMessage('');
    try { await request('logout', {}, job.signal); if (job.current === generation.current) setMessage('You’re signed out.'); }
    catch { if (job.current === generation.current) setMessage('Your details are hidden. We couldn’t confirm sign-out with the server. Close this window and sign out of Boulevard if you opened it separately.'); }
    finally { if (job.current === generation.current) setBusy(false); }
  }
  if (account) return <PatientDashboard account={account} onSignOut={() => { void signOut(); }} />;
  return <div className={styles.portal}>
    <header className={styles.header}><a href="https://experiencerella.com/" aria-label="Rella Aesthetics home"><Image src="/brand/rella-logo-rose.svg" alt="" width={150} height={74} priority /></a><span className={styles.portalLabel}>MY RELLA <span>Patient space</span></span></header>
    <main className={styles.signIn}>
      <p className={styles.eyebrow}>Welcome to your Rella</p><h1>Your care, closer.</h1>
      <p>Appointments, memberships and treatment benefits, together in your private Rella account.</p>
      {!enabled && <p className={styles.setupNotice} role="status">Patient sign-in is being connected. You can explore the dashboard preview or access your existing account below.</p>}
      {step === 'identity-check' ? <div className={styles.signInForm}>
        <h2>One more identity check</h2>
        <p className={styles.setupNotice} role="status" aria-live="polite">{message}</p>
        <button type="button" className={styles.textLink} disabled={busy} onClick={() => { void signOut(); }}>Use a different email or phone</button>
      </div> : <form onSubmit={submit} className={styles.signInForm} aria-busy={busy}>
        {step === 'contact' ? <><fieldset disabled={busy || !enabled}><legend>Send a sign-in code</legend><div className={styles.filters}><label><input type="radio" name="method" value="email" checked={method === 'email'} onChange={() => { setMethod('email'); setContact(''); }} /> Email</label><label><input type="radio" name="method" value="sms" checked={method === 'sms'} onChange={() => { setMethod('sms'); setContact(''); }} /> Text message</label></div><label htmlFor="patient-contact">{method === 'email' ? 'Email on your Boulevard account' : 'Mobile number on your Boulevard account'}</label><input id="patient-contact" type={method === 'email' ? 'email' : 'tel'} autoComplete={method === 'email' ? 'email' : 'tel'} value={contact} onChange={e => setContact(e.target.value)} required maxLength={254} /></fieldset><button className={styles.primary} disabled={busy || !enabled}>{busy ? 'Connecting…' : 'Send sign-in code'}</button></> : <><p>Enter the six-digit code sent to your email or phone.</p><label htmlFor="patient-code">Verification code</label><input id="patient-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" value={code} onChange={e => setCode(normalizeVerificationCode(e.target.value))} onPaste={e => { e.preventDefault(); setCode(normalizeVerificationCode(e.clipboardData.getData('text'))); }} required disabled={busy} autoFocus /><button className={styles.primary} disabled={busy}>{busy ? 'Verifying…' : 'Verify & sign in'}</button><button type="button" className={styles.textLink} disabled={busy} onClick={() => { void signOut(); }}>Use a different email or phone</button></>}
      </form>}
      {message && step !== 'identity-check' && <p className={styles.setupNotice} role="status" aria-live="polite">{message}</p>}
      <p className={styles.note}>Your patient information stays private. This page does not record your session for analytics or heatmaps.</p>
      <div className={styles.signInLinks}><a className={styles.textLink} href={PORTAL_LOGIN} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open existing Boulevard account ↗</a>{!enabled && <a className={styles.textLink} href="/patient-portal/preview">Explore the example dashboard</a>}<a className={styles.textLink} href="tel:+17073582928">Need help? 707.358.2928</a></div>
    </main>
  </div>;
}

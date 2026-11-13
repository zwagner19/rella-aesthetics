'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import {
  appointmentTime, BOOKING_URL, EMPTY_DASHBOARD, EXAMPLE_DASHBOARD,
  PORTAL_LOGIN, PORTAL_MEMBERSHIPS, UNAVAILABLE_DASHBOARD,
  type Appointment, type Dashboard, type LoadState,
} from '@/lib/patient-portal/model';
import styles from './portal.module.css';

type Section = 'Overview' | 'Appointments' | 'Memberships' | 'Treatments & vouchers' | 'Forms & care';
type Scenario = 'example' | 'empty' | 'unavailable' | 'expired';
const sections: Section[] = ['Overview', 'Appointments', 'Memberships', 'Treatments & vouchers', 'Forms & care'];
const titles: Record<Section, string> = {
  Overview: 'Your care, in one place.', Appointments: 'Time set aside for you.',
  Memberships: 'A little more Rella.', 'Treatments & vouchers': 'Your next little extra.',
  'Forms & care': 'Ready for your next visit.',
};
const descriptions: Record<Section, string> = {
  Overview: 'Your appointments, membership and treatment benefits, thoughtfully brought together.',
  Appointments: 'Keep track of upcoming visits and revisit your appointment history.',
  Memberships: 'See your membership details, billing information and agreement.',
  'Treatments & vouchers': 'Find the treatment benefits available on your account.',
  'Forms & care': 'Find your outstanding forms and care information in your secure account.',
};
function ExternalLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return <a className={primary ? styles.primary : styles.textLink} href={href} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{children}<span className={styles.srOnly}> (opens in a new tab)</span><span aria-hidden="true"> ↗</span></a>;
}
function ResultList<T>({ state, empty, children }: { state: LoadState<T>; empty: string; children: (items: T[]) => React.ReactNode }) {
  if (state.status === 'unavailable') return <div className={styles.empty} role="status"><h3>We couldn’t load this right now.</h3><p>This does not mean your account is empty. Check your existing Boulevard account or try again later.</p><ExternalLink href={PORTAL_LOGIN}>Open secure account</ExternalLink></div>;
  if (!state.items.length) return <div className={styles.empty}><h3>{empty}</h3><p>If something looks missing, contact Rella so we can help check your account.</p><a href="tel:+17073582928" className={styles.textLink}>Call 707.358.2928</a></div>;
  return children(state.items);
}
function AppointmentRow({ appointment, demo }: { appointment: Appointment; demo: boolean }) {
  return <article className={styles.appointment}>
    <div className={styles.dateBlock}><span>{new Date(appointment.startsAt).toLocaleDateString('en-US', { month: 'short', timeZone: 'America/Los_Angeles' })}</span><strong>{new Date(appointment.startsAt).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Los_Angeles' })}</strong></div>
    <div className={styles.appointmentBody}><span className={styles.eyebrow}>{appointment.clinic}{demo ? ' · Example visit' : ''}</span><h3>{appointment.service}</h3><p>{appointmentTime(appointment.startsAt)}</p><p>With {appointment.provider}</p>
      <details className={styles.details}><summary>Appointment details</summary><p>{appointment.clinic === 'Napa' ? '1541 3rd St, Napa, CA 94559' : '542 Main St, Vacaville, CA 95688'}</p><p>{demo ? 'This is a demonstration, not a booked appointment. ' : ''}Reschedule or cancel in Boulevard under your existing appointment policies.</p><ExternalLink href={PORTAL_LOGIN}>Manage appointments in Boulevard</ExternalLink></details>
    </div><span className={styles.status}>{appointment.status === 'upcoming' ? 'Upcoming' : appointment.status === 'cancelled' ? 'Cancelled' : appointment.status === 'past' ? 'Past visit' : 'Completed'}</span>
  </article>;
}
function Memberships({ data, demo }: { data: Dashboard; demo: boolean }) {
  return <ResultList state={data.memberships} empty="No memberships to show.">{items => items.map(item => <article key={item.key} className={styles.membership}>
    <div className={styles.cardTop}><span className={styles.eyebrow}>Your membership{demo ? ' · Example' : ''}</span><span className={styles.status}>{item.status}</span></div>
    <h3>{item.name}</h3><p>View your agreement in Boulevard for your membership terms and benefits.</p>
    <dl className={styles.definition}><div><dt>Next payment</dt><dd>{item.nextPayment ? new Date(item.nextPayment.slice(0, 10) + 'T12:00:00Z').toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'long', day: 'numeric', year: 'numeric' }) : 'Check your membership in Boulevard'}</dd></div><div><dt>Membership agreement</dt><dd>{item.agreementAvailable ? 'Available in Boulevard' : 'View in Boulevard'}</dd></div></dl>
    <ExternalLink href={PORTAL_MEMBERSHIPS}>View membership & billing</ExternalLink>
  </article>)}</ResultList>;
}
function Vouchers({ data, demo }: { data: Dashboard; demo: boolean }) {
  return <ResultList state={data.vouchers} empty="No treatment vouchers to show.">{items => items.map(item => <article className={styles.voucher} key={item.key}>
    <div className={styles.cardTop}><span className={styles.eyebrow}>Treatment benefit{demo ? ' · Example' : ''}</span><span className={styles.balance}>{item.remaining} available</span></div><h3>{item.title}</h3>
    <dl className={styles.definition}><div><dt>Eligible location</dt><dd>{item.eligibleClinics.join(' & ') || 'Confirm with Rella'}</dd></div><div><dt>Expiration</dt><dd>{item.expiresOn ?? 'Check your account for details'}</dd></div></dl>
    <p>{demo ? 'Example only. ' : ''}Redemption is subject to the services and terms on your Boulevard account.</p><ExternalLink href={PORTAL_LOGIN}>View vouchers in Boulevard</ExternalLink>
  </article>)}</ResultList>;
}
export default function PatientDashboard({ account, onSignOut }: { account?: Dashboard; onSignOut?: () => void }) {
  const demo = !account;
  const [section, setSection] = useState<Section>('Overview');
  const [scenario, setScenario] = useState<Scenario>('example');
  const [appointmentTab, setAppointmentTab] = useState<'upcoming' | 'history'>('upcoming');
  const heading = useRef<HTMLHeadingElement>(null);
  const data = account ?? (scenario === 'empty' ? EMPTY_DASHBOARD : scenario === 'unavailable' ? UNAVAILABLE_DASHBOARD : EXAMPLE_DASHBOARD);
  const upcoming = data.appointments.status === 'ready' ? data.appointments.items.filter(a => a.status === 'upcoming') : [];
  const filteredAppointments: LoadState<Appointment> = data.appointments.status === 'ready' ? {
    status: 'ready', items: data.appointments.items.filter(a => appointmentTab === 'upcoming' ? a.status === 'upcoming' : a.status !== 'upcoming'),
  } : data.appointments;
  function navigate(next: Section) { setSection(next); requestAnimationFrame(() => heading.current?.focus()); }
  return <div className={styles.portal}>
    <a href="#patient-main" className={styles.skip}>Skip to dashboard</a>
    {demo && <div className={styles.preview}><div><strong>REVIEW PREVIEW</strong><span>Example information only. Patient sign-in is not connected.</span></div><label>Preview state <select value={scenario} onChange={e => setScenario(e.target.value as Scenario)}><option value="example">Example account</option><option value="empty">Empty account</option><option value="unavailable">Data unavailable</option><option value="expired">Session expired</option></select></label></div>}
    <header className={styles.header}><a href="https://experiencerella.com/" aria-label="Rella Aesthetics home"><Image src="/brand/rella-logo-rose.svg" alt="" width={150} height={74} priority /></a><span className={styles.portalLabel}>MY RELLA <span>Patient space</span></span><ExternalLink href={PORTAL_LOGIN}>Existing patient login</ExternalLink></header>
    <div className={styles.layout}><aside className={styles.sidebar}><p className={styles.eyebrow}>Your Rella</p><nav aria-label="Patient dashboard">{sections.map(item => <button key={item} onClick={() => navigate(item)} aria-current={section === item ? 'page' : undefined}>{item}<span aria-hidden="true">↗</span></button>)}</nav><div className={styles.sidebarHelp}><p>A familiar voice, when you need one.</p><a href="tel:+17073582928">707.358.2928</a><span>Napa & Vacaville</span></div></aside>
    <main id="patient-main" className={styles.main}>
      {scenario === 'expired' ? <section className={styles.expired}><p className={styles.eyebrow}>Session ended · Preview</p><h1 ref={heading} tabIndex={-1}>Your space stays yours.</h1><p>For your privacy, your account details are hidden when your session ends. Sign in again to view your real account.</p><ExternalLink href={PORTAL_LOGIN} primary>Sign in to Boulevard</ExternalLink><button className={styles.textLink} onClick={() => setScenario('example')}>Return to example preview</button></section> : <>
      <div className={styles.pageHeading}><div><p className={styles.eyebrow}>My Rella / {section}</p><h1 ref={heading} tabIndex={-1}>{titles[section]}</h1><p>{descriptions[section]}</p></div><ExternalLink href={BOOKING_URL} primary>Book a visit</ExternalLink></div>
      {section === 'Overview' && <>
        <div className={styles.sectionHeading}><h2>Your next appointment</h2><button className={styles.textLink} onClick={() => navigate('Appointments')}>All appointments →</button></div>
        <ResultList state={data.appointments.status === 'ready' ? { status: 'ready', items: upcoming.slice(0, 1) } : data.appointments} empty="Your next visit starts here.">{items => items.map(a => <AppointmentRow key={a.key} appointment={a} demo={demo} />)}</ResultList>
        <div className={styles.twoColumn}><section><div className={styles.sectionHeading}><h2>Membership</h2><button className={styles.textLink} onClick={() => navigate('Memberships')}>View →</button></div><Memberships data={data} demo={demo} /></section><section><div className={styles.sectionHeading}><h2>Treatment benefits</h2><button className={styles.textLink} onClick={() => navigate('Treatments & vouchers')}>View →</button></div><Vouchers data={data} demo={demo} /></section></div>
        <div className={styles.careStrip}><div><p className={styles.eyebrow}>Before your visit</p><h2>A little preparation. A more relaxed visit.</h2><p>Check your secure account for outstanding forms and care instructions.</p></div><button className={styles.textLink} onClick={() => navigate('Forms & care')}>Forms & care →</button></div>
      </>}
      {section === 'Appointments' && <><div className={styles.filters} aria-label="Appointment filters"><button aria-pressed={appointmentTab === 'upcoming'} onClick={() => setAppointmentTab('upcoming')}>Upcoming</button><button aria-pressed={appointmentTab === 'history'} onClick={() => setAppointmentTab('history')}>Past & cancelled</button></div><ResultList state={filteredAppointments} empty={appointmentTab === 'upcoming' ? 'No upcoming appointments to show.' : 'No appointment history to show.'}>{items => items.map(a => <AppointmentRow key={a.key} appointment={a} demo={demo} />)}</ResultList></>}
      {section === 'Memberships' && <><Memberships data={data} demo={demo} /><p className={styles.note}>Payment methods, receipts, membership changes and agreements remain in Boulevard. Your existing billing and cancellation terms apply.</p></>}
      {section === 'Treatments & vouchers' && <><Vouchers data={data} demo={demo} /><p className={styles.note}>Voucher availability is separate from gift cards and account credit. A missing or unavailable balance will never be presented as zero.</p></>}
      {section === 'Forms & care' && <section className={styles.forms}><p className={styles.eyebrow}>Your secure documents</p><h2>Keep the details close.</h2><p>For now, complete your intake forms and view available care instructions in Boulevard. Your forms and medical details are opened securely in Boulevard.</p><ExternalLink href={PORTAL_LOGIN} primary>Open forms in Boulevard</ExternalLink></section>}
      <footer className={styles.footer}><span>Rella Aesthetics · Napa & Vacaville</span><a href="https://experiencerella.com/privacy-policy" referrerPolicy="no-referrer">Privacy policy</a><button className={styles.textLink} onClick={() => demo ? setScenario('expired') : onSignOut?.()}>{demo ? 'Preview sign-out' : 'Sign out'}</button></footer>
      </>}
    </main></div>
  </div>;
}

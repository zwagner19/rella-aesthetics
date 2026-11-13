import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PatientPortal from './PatientPortal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'My Rella | Patient Account',
  description: 'Your private Rella patient account.',
  robots: { index: false, follow: false, noarchive: true },
};

export default function PatientPortalPreview() {
  // Do not accidentally publish a demonstration as a functioning patient account.
  if (process.env.NODE_ENV !== 'development' && process.env.VERCEL_ENV !== 'preview') notFound();
  return <PatientPortal enabled={process.env.PATIENT_PORTAL_PILOT_ENABLED === 'true'} />;
}

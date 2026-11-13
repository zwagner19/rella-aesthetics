import { notFound } from 'next/navigation';
import PatientDashboard from '../PatientDashboard';
export const dynamic = 'force-dynamic';
export default function ExamplePreview() {
  if (process.env.NODE_ENV !== 'development' && process.env.VERCEL_ENV !== 'preview') notFound();
  return <PatientDashboard />;
}

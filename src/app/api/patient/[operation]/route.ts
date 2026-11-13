import { bridgePatient } from '@/lib/patient-portal/bridge';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
type Context = { params: Promise<{ operation: string }> };
export async function GET(request: Request, context: Context) { return bridgePatient(request, (await context.params).operation); }
export async function POST(request: Request, context: Context) { return bridgePatient(request, (await context.params).operation); }

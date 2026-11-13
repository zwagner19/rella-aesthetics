import 'server-only';
import { createHmac } from 'node:crypto';
const COOKIE = '__Host-rella_patient';
const headers = { 'Cache-Control': 'private, no-store, max-age=0', Pragma: 'no-cache', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff', Vary: 'Cookie' };
const signedOut = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
const error = (status = 503, code = 'unavailable', logout = false) => Response.json({ error: code }, { status, headers: { ...headers, ...(logout ? { 'Set-Cookie': signedOut } : {}) } });
export async function bridgePatient(request: Request, operation: string, fetcher: typeof fetch = fetch) {
  const logout = operation === 'logout';
  try {
    if (!['dashboard', 'start', 'verify', 'logout'].includes(operation)) return error(404);
    if (request.method !== (operation === 'dashboard' ? 'GET' : 'POST') || new URL(request.url).search) return error(400, 'invalid_request');
    // An explicit origin prevents accepting arbitrary Host headers or sibling origins.
    const origin = process.env.PATIENT_PORTAL_PUBLIC_ORIGIN;
    if (!origin || new URL(request.url).origin !== origin || (request.method === 'POST' && request.headers.get('origin') !== origin)
      || (request.headers.has('sec-fetch-site') && !['same-origin', 'none'].includes(request.headers.get('sec-fetch-site')!))) return error(403, 'invalid_request');
    const secret = process.env.PATIENT_PORTAL_BRIDGE_SECRET ?? '';
    if (process.env.PATIENT_PORTAL_PILOT_ENABLED !== 'true' || secret.length < 43) return error(503, 'unavailable', logout);
    const target = new URL(process.env.PATIENT_PORTAL_API_ORIGIN ?? '');
    if (target.protocol !== 'https:' || target.username || target.password || target.port || target.pathname !== '/' || target.search || target.hash
      || (target.hostname !== 'book.experiencerella.com' && !/^rella-booking-[a-z0-9-]+\.vercel\.app$/.test(target.hostname))) return error();
    // Vercel replaces this header at the trusted edge. Do not use client-supplied X-Forwarded-For.
    const ip = request.headers.get('x-vercel-forwarded-for');
    if (!ip || ip.length > 100) return error();
    let body: string | undefined;
    if (request.method === 'POST') {
      if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return error(400, 'invalid_request');
      const reader = request.body?.getReader(); if (!reader) return error(400, 'invalid_request');
      const chunks: Uint8Array[] = []; let size = 0;
      while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 4096) { await reader.cancel(); return error(413, 'invalid_request'); } chunks.push(part.value); }
      body = Buffer.concat(chunks).toString('utf8');
      const parsed = JSON.parse(body);
      const allowed = operation === 'start' ? ['method', 'contact'] : operation === 'verify' ? ['code'] : [];
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || Object.keys(parsed).some(k => !allowed.includes(k))) return error(400, 'invalid_request');
    }
    const cookies = (request.headers.get('cookie') ?? '').split(';').map(x => x.trim()).filter(x => x.startsWith(`${COOKIE}=`));
    const cookie = cookies.length === 1 && new RegExp(`^${COOKIE}=[A-Za-z0-9_-]{43}$`).test(cookies[0]) ? cookies[0] : '';
    const upstream = await fetcher(`${target.origin}/api/patient/${operation}`, { method: request.method, body, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(55_000),
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json', 'x-patient-client': createHmac('sha256', secret).update(`patient-ip:${ip}`).digest('hex'), ...(cookie ? { Cookie: cookie } : {}) } });
    const raw = await upstream.text();
    if (raw.length > 512_000 || !upstream.headers.get('content-type')?.startsWith('application/json')) return error(503, 'unavailable', logout);
    const json = JSON.parse(raw);
    const setCookie = upstream.headers.get('set-cookie');
    if (setCookie && !new RegExp(`^${COOKIE}=(?:[A-Za-z0-9_-]{43})?; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=(?:0|600|1800)$`).test(setCookie)) return error();
    return Response.json(json, { status: upstream.status, headers: { ...headers, ...(setCookie ? { 'Set-Cookie': setCookie } : logout ? { 'Set-Cookie': signedOut } : {}) } });
  } catch { return error(503, 'unavailable', logout); }
}

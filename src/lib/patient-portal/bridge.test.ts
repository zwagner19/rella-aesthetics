import { afterEach, describe, expect, it, vi } from 'vitest';
import { bridgePatient } from './bridge';
import { parseDashboard } from './response';
import { EMPTY_DASHBOARD } from './model';
const origin='https://rella-aesthetics-example.vercel.app';
const secret='x'.repeat(43), token='y'.repeat(43);
function setup() { vi.stubEnv('PATIENT_PORTAL_PUBLIC_ORIGIN',origin);vi.stubEnv('PATIENT_PORTAL_PILOT_ENABLED','true');vi.stubEnv('PATIENT_PORTAL_BRIDGE_SECRET',secret);vi.stubEnv('PATIENT_PORTAL_API_ORIGIN','https://rella-booking-example.vercel.app'); }
function request(operation='start',body:unknown={method:'email',contact:'example@example.invalid'},extra:Record<string,string>={}) {return new Request(`${origin}/api/patient/${operation}`,{method:operation==='dashboard'?'GET':'POST',headers:{origin,'content-type':'application/json','sec-fetch-site':'same-origin','x-vercel-forwarded-for':'192.0.2.1',...extra},body:operation==='dashboard'?undefined:JSON.stringify(body)});}
afterEach(()=>vi.unstubAllEnvs());
describe('patient bridge',()=>{
 it('rejects cross-origin requests before calling the backend',async()=>{setup();const fetcher=vi.fn();expect((await bridgePatient(request('start',{}, {origin:'https://other.invalid'}),'start',fetcher)).status).toBe(403);expect(fetcher).not.toHaveBeenCalled();});
 it('rejects an unapproved backend host',async()=>{setup();vi.stubEnv('PATIENT_PORTAL_API_ORIGIN','https://other.invalid');const fetcher=vi.fn();expect((await bridgePatient(request(),'start',fetcher)).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();});
 it('never forwards booking, analytics or unrelated cookies',async()=>{setup();const fetcher=vi.fn(async()=>Response.json({state:'code_required'}));const res=await bridgePatient(request('start',undefined,{cookie:`booking=secret; _ga=tracking; __Host-rella_patient=${token}`}), 'start',fetcher);expect(res.status).toBe(200);const sent=fetcher.mock.calls[0] as unknown as [string,RequestInit];expect(sent[1].headers).toMatchObject({Cookie:`__Host-rella_patient=${token}`});expect(JSON.stringify(sent[1].headers)).not.toContain('booking=');expect(res.headers.get('cache-control')).toContain('no-store');});
 it('rejects a backend cookie that widens domain access',async()=>{setup();const fetcher=vi.fn(async()=>Response.json({}, {headers:{'set-cookie':`__Host-rella_patient=${token}; Domain=.experiencerella.com; Path=/`}}));expect((await bridgePatient(request(),'start',fetcher)).status).toBe(503);});
 it('clears the browser session on failed logout',async()=>{setup();const fetcher=vi.fn(async()=>{throw new Error('network');});const result=await bridgePatient(request('logout',{}),'logout',fetcher);expect(result.status).toBe(503);expect(result.headers.get('set-cookie')).toContain('Max-Age=0');});
 it('rejects caller-supplied client and account identifiers',async()=>{setup();const fetcher=vi.fn();expect((await bridgePatient(request('verify',{code:'123456',clientId:'other'}),'verify',fetcher)).status).toBe(400);expect(fetcher).not.toHaveBeenCalled();});
 it('rejects oversized request bodies',async()=>{setup();const fetcher=vi.fn();expect((await bridgePatient(request('start',{contact:'x'.repeat(5000)}),'start',fetcher)).status).toBe(413);expect(fetcher).not.toHaveBeenCalled();});
 it('refuses requests when trusted edge identity is missing',async()=>{setup();const r=request();r.headers.delete('x-vercel-forwarded-for');const fetcher=vi.fn();expect((await bridgePatient(r,'start',fetcher)).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();});
});
describe('dashboard response boundary',()=>{
 it('accepts empty data only when the source explicitly reports success',()=>{expect(parseDashboard({dashboard:EMPTY_DASHBOARD,expiresAt:Date.now()+60000}).dashboard.appointments).toEqual({status:'ready',items:[]});});
 it('rejects missing collections and expired responses',()=>{expect(()=>parseDashboard({dashboard:{},expiresAt:Date.now()+60000})).toThrow();expect(()=>parseDashboard({dashboard:EMPTY_DASHBOARD,expiresAt:1})).toThrow();});
 it('rejects malformed dates and unexpected clinic names',()=>{const d={...EMPTY_DASHBOARD,appointments:{status:'ready',items:[{key:'a',service:'Example',provider:'Example',startsAt:'bad',clinic:'Napa',status:'upcoming'}]}};expect(()=>parseDashboard({dashboard:d,expiresAt:Date.now()+60000})).toThrow();});
});

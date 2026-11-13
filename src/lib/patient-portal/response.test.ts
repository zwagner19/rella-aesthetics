import { describe, expect, it } from 'vitest';
import { parseDashboard, parseSession } from './response';
import { EMPTY_DASHBOARD } from './model';
const selection=()=>({state:'profile_required',expiresAt:Date.now()+600000,profiles:[{key:'a'.repeat(43),label:'Example Person — Profile 1'},{key:'b'.repeat(43),label:'Example Person — Profile 2'}]});
describe('sign-in state responses',()=>{
 it('accepts minimal verified profile choices',()=>{expect(parseSession(selection()).profiles).toHaveLength(2);});
 it('rejects duplicates and injected patient identifiers',()=>{const r=selection();r.profiles[1].key=r.profiles[0].key;expect(()=>parseSession(r)).toThrow();expect(()=>parseSession({...selection(),profiles:selection().profiles.map(p=>({...p,clientId:'raw-id'}))})).toThrow();});
 it('rejects unbounded, expired, or missing choices',()=>{expect(()=>parseSession({...selection(),expiresAt:Date.now()+3600000})).toThrow();expect(()=>parseSession({...selection(),expiresAt:1})).toThrow();expect(()=>parseSession({...selection(),profiles:[]})).toThrow();});
 it('resumes a code challenge without profile data',()=>{expect(parseSession({state:'code_required',expiresAt:Date.now()+60000}).profiles).toEqual([]);});
});

describe('populated membership and voucher responses',()=>{
 const response=(status='Concluded')=>({expiresAt:Date.now()+60000,dashboard:{...EMPTY_DASHBOARD,
  memberships:{status:'ready',items:[{key:'example-membership',name:'Example plan',status,nextPayment:null,agreementAvailable:false}]},
  vouchers:{status:'ready',items:[{key:'example-voucher',title:'Treatment voucher',remaining:1,eligibleClinics:[],expiresOn:null}]},
 }});
 it('preserves a concluded membership and unknown voucher clinic as supplied',()=>{
  const parsed=parseDashboard(response());expect(parsed.dashboard.memberships).toMatchObject({status:'ready',items:[{status:'Concluded',nextPayment:null}]});
  expect(parsed.dashboard.vouchers).toMatchObject({status:'ready',items:[{remaining:1,eligibleClinics:[]}]});
 });
 it('rejects unknown membership states and unrecognized clinic names',()=>{
  expect(()=>parseDashboard(response('Invented state'))).toThrow();const r=response();r.dashboard.vouchers.items[0].eligibleClinics=['Unknown clinic'] as never[];
  expect(()=>parseDashboard(r)).toThrow();
 });
});

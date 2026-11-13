import { describe, expect, it } from 'vitest';
import { parseSession } from './response';
const selection=()=>({state:'profile_required',expiresAt:Date.now()+600000,profiles:[{key:'a'.repeat(43),label:'Example Person — Profile 1'},{key:'b'.repeat(43),label:'Example Person — Profile 2'}]});
describe('sign-in state responses',()=>{
 it('accepts minimal verified profile choices',()=>{expect(parseSession(selection()).profiles).toHaveLength(2);});
 it('rejects duplicates and injected patient identifiers',()=>{const r=selection();r.profiles[1].key=r.profiles[0].key;expect(()=>parseSession(r)).toThrow();expect(()=>parseSession({...selection(),profiles:selection().profiles.map(p=>({...p,clientId:'raw-id'}))})).toThrow();});
 it('rejects unbounded, expired, or missing choices',()=>{expect(()=>parseSession({...selection(),expiresAt:Date.now()+3600000})).toThrow();expect(()=>parseSession({...selection(),expiresAt:1})).toThrow();expect(()=>parseSession({...selection(),profiles:[]})).toThrow();});
 it('resumes a code challenge without profile data',()=>{expect(parseSession({state:'code_required',expiresAt:Date.now()+60000}).profiles).toEqual([]);});
});

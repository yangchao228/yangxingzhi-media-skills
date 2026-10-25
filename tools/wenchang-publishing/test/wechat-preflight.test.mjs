import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { preflight, readCredentials } from '../dist/wechat-preflight.js';
const credentials = {app_id:'wx1234567890123456', app_secret:'s'.repeat(32), account_name:'测试号'};
test('preflight only obtains token and reads counts; never claims write permissions', async()=>{
  const endpoints=[];
  const result=await preflight(credentials, async(url,init)=>{
    assert.equal(url.hostname,'api.weixin.qq.com');assert.equal(init.redirect,'error');
    endpoints.push(url.pathname);
    const data= endpoints.length===1 ? {access_token:'private-token'} : endpoints.length===2 ? {total_count:1} : {image_count:3};
    return new Response(JSON.stringify(data));
  });
  assert.deepEqual(endpoints,['/cgi-bin/stable_token','/cgi-bin/draft/count','/cgi-bin/material/get_materialcount']);
  assert.equal(result.status,'read_permissions_verified');
  assert.equal(result.write_permissions_verified,false);assert.equal(result.publication_performed,false);
  assert.equal(JSON.stringify(result).includes('private-token'),false);
});
test('token errors stop requests and raw errors are redacted',async()=>{
  let calls=0;
  const result=await preflight(credentials,async()=>{calls++;return new Response(JSON.stringify({errcode:40164,errmsg:'sensitive secret'}));});
  assert.equal(calls,1);assert.equal(result.status,'blocked');assert.equal(result.checks[0].code,40164);
  assert.equal(JSON.stringify(result).includes('sensitive'),false);
});
test('partial permission and malformed successful response fail closed',async()=>{
  let calls=0;
  const result=await preflight(credentials,async()=>new Response(JSON.stringify(++calls===1?{access_token:'token'}:calls===2?{errcode:48001}:{})));
  assert.equal(result.status,'blocked');assert.equal(result.checks[1].code,48001);assert.equal(result.checks[2].status,'failed');
});
test('network errors containing secrets are never emitted',async()=>{
  const result=await preflight(credentials,async()=>{throw new Error('secret');});
  assert.equal(result.status,'blocked');assert.equal(JSON.stringify(result).includes('secret'),false);
});
test('whitelist failure exposes only validated IP, not raw error text',async()=>{
  const result=await preflight(credentials,async()=>new Response(JSON.stringify({errcode:40164,errmsg:'invalid ip 203.0.113.7, secret=private-token'})));
  assert.match(result.checks[0].action,/203\.0\.113\.7/);
  assert.equal(JSON.stringify(result).includes('private-token'),false);
});
test('credential file requires private permissions and populated values',t=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wechat-config-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'config.json');fs.writeFileSync(file,JSON.stringify(credentials),{mode:0o600});
  assert.deepEqual(readCredentials(file),credentials);
  fs.chmodSync(file,0o644);assert.throws(()=>readCredentials(file));
  fs.chmodSync(file,0o600);fs.writeFileSync(file,'{}');assert.throws(()=>readCredentials(file));
});

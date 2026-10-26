import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { init, collect } from '../dist/project.js';
import { build } from '../dist/build.js';
import { prepareZhihu, preflightZhihuBaseline, resolveMap, sourceText, validateObservation, verifyZhihu } from '../dist/zhihu-sync.js';
import { sha, json } from '../dist/io.js';
import { publishingStatus } from '../dist/status.js';
import { readEvidenceObservation } from '../dist/remote-preflight.js';
import { waitForDraft, importDraft } from '../browser/zhihu-draft.mjs';
const fixture = fileURLToPath(new URL('../../../content/publishing/p0/fixture/', import.meta.url));
const draft = 'https://zhuanlan.zhihu.com/p/123/edit';
function setup(t) {
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'wenchang-zhihu-'))); t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.cpSync(fixture,path.join(root,'source'),{recursive:true}); const dir=path.join(root,'distribution');
 init({workspace:root,out:dir,source:path.join(root,'source/body.md'),platforms:['zhihu']}); build(dir);
 const data=collect(dir),map={mode:'upload-only',dry_run:false,missing_files:[],upload_failed:[],assets:[...data.bodyImages.values()].map(a=>({local_path:path.relative(path.join(root,'source'),data.assetFiles.get(a.source_ref)),sha256:a.sha256,bytes:a.bytes,status:'uploaded',url:'https://example.com/'+a.sha256+'.png'}))};
 const file=path.join(root,'source/map.json'); fs.writeFileSync(file,json(map));
 const result=prepareZhihu(dir,{draft,account:'test',mapFile:file}),plan=JSON.parse(fs.readFileSync(result.plan));
 return {root,dir,file,map,plan,result};
}
function observation(plan) { return {url:plan.draft_url,account:plan.account,title:plan.title,text:plan.expected_text,saved:true,busy:false,failed:false,images:plan.images.map((a,i)=>({src:'https://pic-private.zhihu.com/image'+i+'.png',complete:true,width:a.width,height:a.height}))}; }
test('R2 plan is separate from immutable offline bundle and source; reusable without upload',t=>{
 const {dir,file,plan,result,root}=setup(t),source=fs.readFileSync(path.join(root,'source/body.md'));
 assert.equal(plan.images.length,2); assert.match(plan.html,/https:\/\/example.com/);
 const bundle=JSON.parse(fs.readFileSync(path.join(dir,'bundle.json')));
 assert.doesNotMatch(fs.readFileSync(path.join(dir,bundle.platforms.zhihu.fragment),'utf8'),/src="https:\/\/example.com/);
 assert.equal(prepareZhihu(dir,{draft,account:'test',mapFile:file}).plan_hash,result.plan_hash);
 assert.deepEqual(fs.readFileSync(path.join(root,'source/body.md')),source);
});
test('reject stale, incomplete, dry-run or credential-bearing mapping',()=>{
 const files=new Map([['/a.png',{sha256:'h',bytes:1}]]),valid={mode:'upload-only',dry_run:false,missing_files:[],upload_failed:[],assets:[{local_path:'a.png',sha256:'h',bytes:1,status:'uploaded',url:'https://example.com/a.png'}]};
 for(const change of [{dry_run:true},{assets:[]},{upload_failed:['error']},{assets:[{...valid.assets[0],sha256:'wrong'}]},{assets:[{...valid.assets[0],url:'https://example.com/a.png?secret=1'}]}]) assert.throws(()=>resolveMap({...valid,...change},'/',files));
});
test('reject failed transfer, pending save, broken or external image, wrong draft/account/body',()=>{
 const plan={draft_url:draft,account:'test',title:'title',expected_text:'body',images:[{width:10,height:10}]},good=observation(plan); validateObservation(plan,good);
 for(const change of [{failed:true},{busy:true},{saved:false},{account:'other'},{url:'https://www.zhihu.com/'},{text:'truncated'},{images:[]},{images:[{...good.images[0],width:0}]},{images:[{...good.images[0],src:'https://example.com/a.png'}]}]) assert.throws(()=>validateObservation(plan,{...good,...change}));
});
test('verify binds version and independently reopened image identity; no success on mismatch',t=>{
 const {dir,plan,result,root}=setup(t),o=observation(plan),e={plan_hash:result.plan_hash,imported:o,reopened:structuredClone(o),independent_reopen:true,checked_at:new Date().toISOString()};
 const f=path.join(root,'evidence.json');fs.writeFileSync(f,json(e)); assert.equal(verifyZhihu(dir,f).status,'draft_verified');
 e.reopened.images.reverse();fs.writeFileSync(f,json(e));assert.throws(()=>verifyZhihu(dir,f),/IDENTITY/);
 e.reopened=o;e.independent_reopen=false;fs.writeFileSync(f,json(e));assert.throws(()=>verifyZhihu(dir,f),/REOPEN/);
 fs.appendFileSync(path.join(root,'source/body.md'),'new');assert.throws(()=>verifyZhihu(dir,f),/STALE/);
});
test('verify failure is blocked with recovery metadata and requires fresh evidence after timeout',t=>{
 const {dir,plan,result,root}=setup(t),o=observation(plan),e={plan_hash:result.plan_hash,imported:o,reopened:structuredClone(o),independent_reopen:true,checked_at:new Date().toISOString(),status:'saved_pending_readback',code:'WAIT_TIMEOUT'};
 const f=path.join(root,'timeout.json');fs.writeFileSync(f,json(e));assert.throws(()=>verifyZhihu(dir,f),/WAIT_TIMEOUT/);
 const base=path.dirname(result.plan),state=JSON.parse(fs.readFileSync(path.join(base,'status.json')));
 assert.equal(state.status,'blocked');assert.equal(state.last_error_code,'WAIT_TIMEOUT');assert.match(state.recovery_action,/新.*回读证据/);assert.equal(state.publication_performed,false);
 e.status=undefined;e.code=undefined;fs.writeFileSync(f,json(e));assert.throws(()=>verifyZhihu(dir,f),/FRESH_EVIDENCE_REQUIRED/);
 e.checked_at='2099-01-01T00:00:00.000Z';fs.writeFileSync(f,json(e));assert.equal(verifyZhihu(dir,f).status,'draft_verified');
});
test('new prepare archives a prior successful receipt; blocked retry exposes it as historical',t=>{
 const {dir,plan,result,root,file}=setup(t),o=observation(plan),e={plan_hash:result.plan_hash,imported:o,reopened:structuredClone(o),independent_reopen:true,checked_at:new Date().toISOString()};
 const f=path.join(root,'evidence.json');fs.writeFileSync(f,json(e));assert.equal(verifyZhihu(dir,f).status,'draft_verified');
 const again=prepareZhihu(dir,{draft,account:'test',mapFile:file});const againPlan=JSON.parse(fs.readFileSync(again.plan));
 const bad={...e,plan_hash:'0'.repeat(64)};fs.writeFileSync(f,json(bad));assert.throws(()=>verifyZhihu(dir,f),/EVIDENCE_PLAN/);
 const state=JSON.parse(fs.readFileSync(path.join(path.dirname(again.plan),'status.json')));assert.equal(state.status,'blocked');
 const history=path.join(path.dirname(again.plan),'history');assert.ok(fs.readdirSync(history).length>0);
 const current=publishingStatus(dir).platforms.find(x=>x.platform==='zhihu');assert.equal(current.state,'blocked');assert.ok(current.historical?.some(x=>x.state==='historical_verified'));
});
test('text expectation preserves code punctuation and excludes image alt',()=>{
 assert.equal(sourceText('# title\n\nHello **world**\n\n![ALT](a.png)\n\n`x*y`'),'Helloworldx*y');
});
test('remote preflight blocks a changed draft before editor mutation',t=>{
 const {root,plan,result}=setup(t);
 const baseline=observation(plan), same=structuredClone(baseline);
 assert.deepEqual(preflightZhihuBaseline(plan,baseline,same),{status:'remote_unchanged',changed_fields:[]});
 for(const [field,change] of [['title',o=>o.title='changed'],['body',o=>o.text='changed'],['image',o=>o.images[0].width=0]]) {
  const current=structuredClone(baseline); change(current);
  assert.throws(()=>preflightZhihuBaseline(plan,baseline,current),field==='image'?/REMOTE_BASELINE_CHANGED/:/REMOTE_BASELINE_CHANGED/);
 }
 assert.throws(()=>preflightZhihuBaseline(plan,undefined,baseline),/BASELINE_REQUIRED/);
 const evidence=path.join(root,'baseline-evidence.json');fs.writeFileSync(evidence,json({plan_hash:'0'.repeat(64),independent_reopen:true,checked_at:new Date().toISOString(),reopened:baseline}));
 assert.throws(()=>readEvidenceObservation(evidence,result.plan_hash),/BASELINE_EVIDENCE_PLAN_MISMATCH/);
});
test('bounded browser wait requires loaded platform image and saved state',async()=>{
 const plan={draft_url:draft,account:'test',title:'title',expected_text:'body',images:[{width:10,height:10}]},good={...observation(plan),initialized:true};
 let count=0;const tab={playwright:{evaluate:async()=>++count===1?{...good,busy:true,saved:false}:good},getAXState:async()=>{}};
 assert.equal((await waitForDraft(tab,plan)).saved,true);assert.equal(count,2);
 tab.playwright.evaluate=async()=>({...good,images:[]});await assert.rejects(waitForDraft(tab,plan,{timeoutMs:0}),/WAIT_TIMEOUT/);
 tab.playwright.evaluate=async()=>({...good,account:'wrong'});await assert.rejects(importDraft(tab,plan),/ACCOUNT/);
});
test('import guard compares the remote baseline before clearing the editor',async()=>{
 const plan={draft_url:draft,account:'test',title:'title',expected_text:'body',images:[{width:10,height:10}]};
 const baseline={...observation(plan),initialized:true,saved:true,busy:false,failed:false}, current={...baseline,title:'manual edit'};
 let cleared=false;
 const tab={playwright:{evaluate:async()=>current,locator:()=>({fill:async()=>{cleared=true},press:async()=>{cleared=true}})},getAXState:async()=>{}};
 await assert.rejects(importDraft(tab,plan,{baseline}),/REMOTE_BASELINE_CHANGED/);
 assert.equal(cleared,false);
});

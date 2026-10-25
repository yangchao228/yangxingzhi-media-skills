import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { init, collect } from '../dist/project.js';
import { build } from '../dist/build.js';
import { prepareZhihu, resolveMap, sourceText, validateObservation, verifyZhihu } from '../dist/zhihu-sync.js';
import { sha, json } from '../dist/io.js';
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
test('text expectation preserves code punctuation and excludes image alt',()=>{
 assert.equal(sourceText('# title\n\nHello **world**\n\n![ALT](a.png)\n\n`x*y`'),'Helloworldx*y');
});
test('bounded browser wait requires loaded platform image and saved state',async()=>{
 const plan={draft_url:draft,account:'test',title:'title',expected_text:'body',images:[{width:10,height:10}]},good={...observation(plan),initialized:true};
 let count=0;const tab={playwright:{evaluate:async()=>++count===1?{...good,busy:true,saved:false}:good},getAXState:async()=>{}};
 assert.equal((await waitForDraft(tab,plan)).saved,true);assert.equal(count,2);
 tab.playwright.evaluate=async()=>({...good,images:[]});await assert.rejects(waitForDraft(tab,plan,{timeoutMs:0}),/WAIT_TIMEOUT/);
 tab.playwright.evaluate=async()=>({...good,account:'wrong'});await assert.rejects(importDraft(tab,plan),/ACCOUNT/);
});

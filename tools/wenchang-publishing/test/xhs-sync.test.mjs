import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {init,collect} from '../dist/project.js';
import {build} from '../dist/build.js';
import {prepareXhs,validateXhs,verifyXhs} from '../dist/xhs-sync.js';
import {json} from '../dist/io.js';
const fixture=fileURLToPath(new URL('../../../content/publishing/p0/fixture/',import.meta.url));
function setup(t){
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'xhs-flow-')));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 fs.cpSync(fixture,path.join(root,'source'),{recursive:true});const dir=path.join(root,'distribution');
 init({workspace:root,out:dir,source:path.join(root,'source/body.md'),metadata:path.join(root,'source/metadata.json'),platforms:['xiaohongshu']});build(dir);
 const d=collect(dir),m={mode:'upload-only',dry_run:false,missing_files:[],upload_failed:[],assets:d.cards.map(a=>({sha256:a.sha256,bytes:a.bytes,status:'uploaded',url:'https://example.com/'+a.sha256+'.png'}))};
 const map=path.join(root,'map.json');fs.writeFileSync(map,json(m));const r=prepareXhs(dir,{account:'test',reuseMap:map});const plan=JSON.parse(fs.readFileSync(r.plan));return {root,dir,map,r,plan};
}
function obs(p,remote=true){return {account:p.account,title:p.title,description:p.description,images:p.images.map((a,i)=>({src:remote?'https://sns-creator-preview.xhscdn.com/spectrum/'+i:'blob:https://creator.xiaohongshu.com/'+i,complete:true,width:a.width,height:a.height}))};}
test('reuse R2 hash mapping and generate ordered identical upload files without network',t=>{
 const {root,dir,map,r,plan}=setup(t);assert.equal(r.reused_from_r2_map,2);assert.equal(plan.images.length,2);
 for(let i=0;i<2;i++)assert.deepEqual(fs.readFileSync(path.resolve(path.dirname(r.plan),plan.images[i].upload_file)),fs.readFileSync(path.join(root,'source/assets/image-0'+(i+1)+'.png')));
 assert.equal(prepareXhs(dir,{account:'test',reuseMap:map}).plan_hash,r.plan_hash);
});
test('loaded same-origin blob is accepted; broken images and foreign blobs fail',()=>{
 const p={account:'a',title:'t',description:'d',images:[{width:1080,height:1440}]},o=obs(p,false);
 validateXhs(p,o,false);validateXhs(p,o,true);
 o.images[0].src='blob:https://example.com/123';assert.throws(()=>validateXhs(p,o,true),/NOT_PERSISTED/);
 o.images[0].src='https://sns-creator-preview.xhscdn.com/a';o.images[0].width=0;assert.throws(()=>validateXhs(p,o,true),/NOT_LOADED/);
});
test('only independent reopen and visually verified order produce success',t=>{
 const {root,dir,r,plan}=setup(t),e={plan_hash:r.plan_hash,uploaded:obs(plan,false),reopened:obs(plan),saved_in_list:true,reopened_from_list:true,independent_reopen:true,visual_order_verified:true};
 const f=path.join(root,'e.json');fs.writeFileSync(f,json(e));assert.equal(verifyXhs(dir,f).status,'draft_verified');
 e.reopened.images[0].width=0;fs.writeFileSync(f,json(e));assert.throws(()=>verifyXhs(dir,f),/NOT_LOADED/);
 assert.equal(JSON.parse(fs.readFileSync(path.join(path.dirname(r.plan),'status.json'))).status,'blocked');
 e.reopened=obs(plan);e.independent_reopen=false;fs.writeFileSync(f,json(e));assert.throws(()=>verifyXhs(dir,f),/NOT_CONFIRMED/);
});
test('wrong account/text, missing image and off-platform URL fail',()=>{
 const p={account:'a',title:'t',description:'d',images:[{width:1080,height:1440}]};
 for(const change of [{account:'other'},{description:'truncated'},{images:[]},{images:[{...obs(p).images[0],src:'https://example.com/image.png'}]}])assert.throws(()=>validateXhs(p,{...obs(p),...change},true));
});

test('reopened blobs must be fresh, distinct and independently reopened',t=>{
 const {root,dir,r,plan}=setup(t),e={plan_hash:r.plan_hash,uploaded:obs(plan,false),reopened:obs(plan,false),saved_in_list:true,reopened_from_list:true,independent_reopen:true,visual_order_verified:true};
 const f=path.join(root,'blob.json'),run=()=>{fs.writeFileSync(f,json(e));return verifyXhs(dir,f);};
 assert.throws(run,/BLOB_REOPEN_NOT_INDEPENDENT/);
 e.reopened.images.forEach((im,i)=>im.src='blob:https://creator.xiaohongshu.com/reopened-'+i);
 assert.equal(run().status,'draft_verified');
 e.visual_order_verified=false;assert.throws(run,/VISUAL_ORDER/);e.visual_order_verified=true;
 e.reopened.images[1].src=e.reopened.images[0].src;assert.throws(run,/DUPLICATE_IMAGE/);
 e.reopened.images[1].src='blob:https://creator.xiaohongshu.com/reopened-1';
 e.independent_reopen=false;assert.throws(run,/NOT_CONFIRMED/);e.independent_reopen=true;
 e.reopened.images[0].complete=false;assert.throws(run,/NOT_LOADED/);
});

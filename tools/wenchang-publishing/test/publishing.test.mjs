import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRuntimeFixture } from './runtime-fixture.mjs';
import { init, attachState } from '../dist/project.js';
import { build, check, exportBundle } from '../dist/build.js';
import { previewServer } from '../dist/server.js';
function setup(t) {
 const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'wenchang-test-')));
 t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const fixture=createRuntimeFixture(root);
 const dir=path.join(root,'distribution');
 init({workspace:root,out:dir,source:fixture.source,metadata:fixture.metadata});
 return {root,dir,source:fixture.source};
}
function edit(file, fn){const v=JSON.parse(fs.readFileSync(file));fn(v);fs.writeFileSync(file,JSON.stringify(v));}
test('unchanged build reuses all platforms; XHS-only edit preserves article renders',t=>{
 const {dir}=setup(t);const a=build(dir);
 assert.equal(check(dir).status,'local_ready');assert.equal(build(dir).reused.length,3);
 edit(path.join(dir,'platforms/xiaohongshu.json'),v=>v.tags=['工作流']);
 assert.deepEqual(check(dir).stale_platforms,['xiaohongshu']);
 const b=build(dir);assert.deepEqual(b.reused,['zhihu','wechat']);
 assert.notEqual(a.bundle.bundle_version,b.bundle.bundle_version);
});
test('failed build preserves successful manifest and blocks export',t=>{
 const {dir,root,source}=setup(t);build(dir);const previous=fs.readFileSync(path.join(dir,'bundle.json'),'utf8');
 fs.appendFileSync(source,'\n![missing](missing.png)');
 assert.throws(()=>build(dir),/找不到文件/);
 assert.equal(fs.readFileSync(path.join(dir,'bundle.json'),'utf8'),previous);
 assert.throws(()=>exportBundle(dir,path.join(root,'export')));
 assert.equal(fs.existsSync(path.join(dir,'.build.lock')),false);
});
test('source change marks all stale and rejects stale export',t=>{
 const {dir,root,source}=setup(t);build(dir);fs.appendFileSync(source,'\n新增段落。');
 assert.equal(check(dir).stale_platforms.length,3);
 assert.throws(()=>exportBundle(dir,path.join(root,'export')),/过期/);
});
test('export is portable and includes reusable render receipts',t=>{
 const {dir,root}=setup(t);build(dir);const exported=exportBundle(dir,path.join(root,'export'));
 fs.renameSync(path.join(root,'export'),path.join(root,'moved'));
 const moved=path.join(root,'moved',exported.project_dir);
 assert.equal(check(moved).status,'local_ready');
 edit(path.join(moved,'platforms/xiaohongshu.json'),v=>v.tags=['迁移']);
 assert.deepEqual(build(moved).reused,['zhihu','wechat']);
});
test('remote images and outside-workspace symlinks are rejected',t=>{
 const {dir,source,root}=setup(t);
 fs.appendFileSync(source,'\n![remote](https://example.com/a.png)');assert.throws(()=>build(dir));
 fs.writeFileSync(source,'# test\n![outside](outside.png)');
 fs.symlinkSync('/etc/hosts',path.join(root,'source/outside.png'));
 assert.throws(()=>build(dir),/不能读取/);
});
test('tampered render is rejected',t=>{
 const {dir}=setup(t);const {bundle}=build(dir);
 fs.appendFileSync(path.join(dir,bundle.platforms.zhihu.preview),'modified');
 assert.throws(()=>check(dir),/产物被修改/);
});
test('XHS Unicode length, duplicate titles and image order validation',t=>{
 const {dir}=setup(t);const f=path.join(dir,'platforms/xiaohongshu.json');
 edit(f,v=>v.post_title='😀'.repeat(20));build(dir);
 edit(f,v=>v.post_title='😀'.repeat(21));assert.throws(()=>build(dir),/合同/);
 edit(f,v=>v.post_title=v.cover_title);assert.throws(()=>build(dir),/完全相同/);
 edit(f,v=>v.post_title='独立发布标题');
 edit(path.join(dir,'derived/xiaohongshu-cards.json'),v=>v.images=[v.images[0],v.images[0]]);
 assert.throws(()=>build(dir),/合同/);
});
test('raw HTML cannot execute and unsupported structures are visible warnings',t=>{
 const {dir,source}=setup(t);fs.appendFileSync(source,'\n<script>alert(1)</script>\n\n```mermaid\ngraph TD; A-->B\n```\n');
 const {bundle}=build(dir);const html=fs.readFileSync(path.join(dir,bundle.platforms.zhihu.preview),'utf8');
 assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));
 assert.ok(bundle.platforms.zhihu.warnings.length>0);
});
test('content_state attachment preserves existing data and blocks conflicting reference',t=>{
 const {dir,root}=setup(t);const file=path.join(root,'state.json');
 fs.writeFileSync(file,JSON.stringify({content_state:{custom:{keep:true}}}));
 attachState(dir,file);const s=JSON.parse(fs.readFileSync(file));assert.equal(s.content_state.custom.keep,true);
 assert.equal(s.content_state.distribution.package_ref,'distribution/bundle.json');
 edit(file,v=>v.content_state.distribution.package_ref='other/bundle.json');assert.throws(()=>attachState(dir,file),/另一个/);
});
test('HTTP preview redirects home, serves assets, refuses writes and stale HTML',async t=>{
 const {dir,source}=setup(t);const {bundle}=build(dir);const server=previewServer(dir);
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve)});
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base=`http://127.0.0.1:${server.address().port}`;
 const home=await fetch(base+'/');assert.equal(home.status,200);assert.ok(home.url.endsWith(bundle.preview));
 assert.equal((await fetch(base+'/index.html',{redirect:'manual'})).status,302);
 assert.equal((await fetch(base+'/'+bundle.platforms.xiaohongshu.images[0])).status,200);
 assert.equal((await fetch(base+'/project.json')).status,404);
 const status=await (await fetch(base+'/publishing-status')).json();
 assert.equal(status.local.state,'local_ready');assert.equal(status.platforms.length,3);
 assert.equal((await fetch(base+'/publishing-status',{method:'HEAD'})).status,200);
 assert.equal((await fetch(base+'/publishing-status',{method:'POST'})).status,405);
 assert.equal((await fetch(base+'/',{method:'POST'})).status,405);
 fs.appendFileSync(source,'\nChanged');
 assert.equal((await fetch(base+'/'+bundle.platforms.zhihu.preview)).status,409);
 assert.equal((await (await fetch(base+'/publishing-status')).json()).local.state,'stale');
});
test('GIF remains a local article asset and cannot silently become an XHS still',t=>{
 const {dir,root,source}=setup(t);
 fs.writeFileSync(path.join(root,'source/animation.gif'),Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64'));
 fs.appendFileSync(source,'\n![animation](animation.gif)');
 const {bundle}=build(dir);assert.ok(bundle.assets.some(a=>a.type==='gif'));
 assert.ok(bundle.platforms.wechat.warnings.some(w=>w.code==='GIF_UPLOAD_UNVERIFIED'));
 edit(path.join(dir,'derived/xiaohongshu-cards.json'),v=>v.images=['../source/animation.gif']);
 assert.throws(()=>build(dir),/不接受 GIF/);
});
test('all rendered local links resolve without remote rendering dependencies',t=>{
 const {dir}=setup(t);const {bundle}=build(dir);
 const files=[...bundle.outputs,...Object.values(bundle.platforms).flatMap(p=>p.outputs)];
 for(const {ref} of files.filter(f=>f.ref.endsWith('.html'))){
  const file=path.join(dir,ref),html=fs.readFileSync(file,'utf8');
  assert.ok(!/<(?:script|link)\b/i.test(html));
  for(const m of html.matchAll(/\b(src|href)="([^"]+)"/g)){
   if(/^(https?:|mailto:|#)/.test(m[2])) {assert.notEqual(m[1],'src');continue;}
   assert.ok(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(m[2].split('#')[0]))),m[2]);
  }
 }
});
test('selected article platforms need no XHS configuration and survive export',t=>{
 const {dir,root}=setup(t);
 edit(path.join(dir,'project.json'),v=>v.target_platforms=['wechat','zhihu']);
 fs.unlinkSync(path.join(dir,'platforms/xiaohongshu.json'));
 fs.unlinkSync(path.join(dir,'derived/xiaohongshu-cards.json'));
 const {bundle}=build(dir);assert.deepEqual(Object.keys(bundle.platforms),['wechat','zhihu']);
 assert.equal(check(dir).status,'local_ready');
 const exported=exportBundle(dir,path.join(root,'export'));
 assert.equal(check(path.join(exported.destination,exported.project_dir)).status,'local_ready');
 edit(path.join(dir,'project.json'),v=>v.target_platforms=['zhihu']);
 assert.deepEqual(check(dir).stale_platforms,['wechat']);
 assert.deepEqual(Object.keys(build(dir).bundle.platforms),['zhihu']);
});
test('empty and unknown target platforms fail validation',t=>{
 const {dir}=setup(t);
 for(const targets of [[],['invalid'],['zhihu','zhihu']]){
  edit(path.join(dir,'project.json'),v=>v.target_platforms=targets);
  assert.throws(()=>build(dir),/合同/);
 }
});

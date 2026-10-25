import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { check } from './build.js';
import { collect } from './project.js';
import { atomic, input, json, output, readJson, ref, sha, TOOL_ROOT } from './io.js';
import { resolveMap, normalizeText } from './zhihu-sync.js';
import type { XhsConfig } from './model.js';

export interface XhsPlan {
  schema_version: 1; bundle_version: string; source_hash: string; account: string;
  title: string; description: string; tags: string[];
  images: { source_ref: string; sha256: string; bytes: number; width: number; height: number; r2_url: string; upload_file: string }[];
  publication_performed: false;
}
function current(directory: string) {
  if (check(directory).status !== 'local_ready') throw new Error('BUNDLE_STALE');
  const d=collect(directory); if (!d.targets.includes('xiaohongshu')) throw new Error('XHS_NOT_ENABLED'); return d;
}
export function prepareXhs(directory: string, options: { account: string; reuseMap?: string; envFile?: string }) {
  const d=current(directory),cfg=d.configs.xiaohongshu as XhsConfig;
  if (!options.account.trim()) throw new Error('ACCOUNT_REQUIRED');
  const dir=output(d.root,path.join(d.dir,'transfers','xiaohongshu',d.bundleVersion));fs.mkdirSync(dir,{recursive:true});
  const lock=output(d.root,path.join(dir,'.prepare.lock')),fd=fs.openSync(lock,'wx');
  try {
    if (fs.existsSync(path.join(dir,'plan.json')) && readJson<XhsPlan>(path.join(dir,'plan.json')).account!==options.account) throw new Error('ACCOUNT_PLAN_MISMATCH');
    atomic(output(d.root,path.join(dir,'status.json')),json({status:'preparing',publication_performed:false}));
    const byHash=new Map<string,string>();
    // Reuse the same immutable bytes across platforms, even when source references differ.
    if (options.reuseMap) {
      const m=readJson(options.reuseMap);
      if(m.mode!=='upload-only'||m.dry_run||m.missing_files?.length||m.upload_failed?.length||!Array.isArray(m.assets)) throw new Error('R2_MAP_NOT_UPLOADED');
      for(const a of m.assets) {
        const match=d.cards.find(c=>c.sha256===a.sha256&&c.bytes===a.bytes);
        if(!match) continue;
        const file=d.assetFiles.get(match.source_ref)!;
        const single={mode:'upload-only',dry_run:false,missing_files:[],upload_failed:[],assets:[{...a,local_path:path.basename(file)}]};
        const urls=resolveMap(single,path.dirname(file),new Map([[file,match]]));
        if(byHash.has(match.sha256)&&byHash.get(match.sha256)!==urls.get(file)) throw new Error('R2_MAP_CONFLICT');
        byHash.set(match.sha256,urls.get(file)!);
      }
    }
    const missing=d.cards.filter(c=>!byHash.has(c.sha256));
    if(missing.length) {
      const manifest=output(d.root,path.join(dir,'upload-missing.md'));
      atomic(manifest,missing.map((a,i)=>`![asset-${i+1}](<${ref(dir,d.assetFiles.get(a.source_ref)!)}>)`).join('\n')+'\n');
      const mapFile=manifest+'.asset-map.json';
      if(!fs.existsSync(mapFile)) {
        if(!options.envFile) throw new Error('R2_ENV_FILE_REQUIRED');
        const run=spawnSync('python3',['-B',path.resolve(TOOL_ROOT,'../../md-img-r2/scripts/md_img_r2.py'),manifest,'--upload-only','--env-file',path.resolve(options.envFile),'--key-prefix',`wenchang/${d.project.content_id}`],{encoding:'utf8',timeout:300000});
        if(run.error||run.status!==0)throw new Error('R2_UPLOAD_FAILED_CHECK_LOCAL_MAP');
      }
      const urls=resolveMap(readJson(mapFile),dir,new Map(missing.map(a=>[d.assetFiles.get(a.source_ref)!,a])));
      for(const a of missing)byHash.set(a.sha256,urls.get(d.assetFiles.get(a.source_ref)!)!);
    }
    if(current(directory).bundleVersion!==d.bundleVersion)throw new Error('INPUT_CHANGED_DURING_UPLOAD');
    const images=d.cards.map((a,i)=>{
      const file=output(d.root,path.join(dir,'upload',`${String(i+1).padStart(2,'0')}.${a.type}`));
      const bytes=fs.readFileSync(d.assetFiles.get(a.source_ref)!);
      if(sha(bytes)!==a.sha256)throw new Error('IMAGE_CHANGED');
      atomic(file,bytes);
      return {...a,r2_url:byHash.get(a.sha256)!,upload_file:ref(dir,file)};
    });
    const plan:XhsPlan={schema_version:1,bundle_version:d.bundleVersion,source_hash:d.sourceHash,account:options.account,title:cfg.post_title,description:cfg.description,tags:cfg.tags,images,publication_performed:false};
    atomic(output(d.root,path.join(dir,'r2-map.json')),json({bundle_version:d.bundleVersion,images:images.map(({upload_file,...a})=>a)}));
    atomic(output(d.root,path.join(dir,'plan.json')),json(plan));
    atomic(output(d.root,path.join(dir,'status.json')),json({status:'ready_for_browser',publication_performed:false}));
    return {status:'ready_for_browser',plan:path.join(dir,'plan.json'),plan_hash:sha(json(plan)),images:images.length,reused_from_r2_map:images.length-missing.length,publication_performed:false};
  } catch(e) {
    atomic(output(d.root,path.join(dir,'status.json')),json({status:'blocked',code:e instanceof Error&&/^[A-Z_]+$/.test(e.message)?e.message:'PREPARE_FAILED',publication_performed:false}));throw e;
  } finally {fs.closeSync(fd);fs.unlinkSync(lock);}
}
export interface XhsObservation {
  account:string; title:string; description:string; images:{src:string;complete:boolean;width:number;height:number}[];
  topics?: {name:string;id:string}[];
}
// DOM innerText may separate paragraphs with two newlines. Preserve boundaries,
// while tolerating renderer spacing and empty paragraph separators.
export const normalizeXhsDescription = (s:string) => s.normalize('NFC').replace(/\r\n?/g,'\n')
  .split('\n').map(line=>line.replace(/[\t \u00a0\u200b]+/g,' ').trim()).filter(Boolean).join('\n');
export function validateXhs(plan:XhsPlan,o:XhsObservation,reopened:boolean) {
  if(o.account!==plan.account)throw new Error('ACCOUNT_MISMATCH');
  if(o.title!==plan.title||normalizeText(o.description)!==normalizeText(plan.description))throw new Error('TITLE_OR_DESCRIPTION_MISMATCH');
  if(normalizeXhsDescription(o.description)!==normalizeXhsDescription(plan.description))throw new Error('DESCRIPTION_LAYOUT_MISMATCH');
  const tagName=(s:string)=>s.normalize('NFC').replace(/^#/,'').trim();
  const expected=(plan.tags||[]).map(tagName),topics=o.topics||[];
  if(topics.some(t=>typeof t.name!=='string'||typeof t.id!=='string'||!t.id.trim()))throw new Error('TOPIC_NOT_SELECTED');
  const actual=topics.map(t=>tagName(t.name));
  if(new Set(actual).size!==actual.length||actual.length!==expected.length||expected.some(t=>!actual.includes(t)))throw new Error('TOPICS_MISMATCH');
  if(o.images.length!==plan.images.length)throw new Error('IMAGE_COUNT_MISMATCH');
  o.images.forEach((im,i)=>{
    if(!im.complete||im.width!==plan.images[i].width||im.height!==plan.images[i].height)throw new Error('IMAGE_NOT_LOADED');
    if(reopened) {
      const u=new URL(im.src);
      const cdn=u.protocol==='https:'&&u.hostname.endsWith('.xhscdn.com')&&!u.username&&!u.password;
      const blob=u.protocol==='blob:'&&u.origin==='https://creator.xiaohongshu.com'&&/^blob:https:\/\/creator\.xiaohongshu\.com\/[a-zA-Z0-9-]+$/.test(im.src);
      if((!cdn&&!blob)||u.search||u.hash)throw new Error('IMAGE_NOT_PERSISTED');
    }
  });
}
export function verifyXhs(directory:string,evidenceFile:string) {
  const d=current(directory),dir=path.join(d.dir,'transfers','xiaohongshu',d.bundleVersion);
  try {
    const plan=readJson<XhsPlan>(input(d.root,dir,'plan.json')),e=readJson(evidenceFile);
    if(plan.bundle_version!==d.bundleVersion||plan.source_hash!==d.sourceHash||e.plan_hash!==sha(json(plan)))throw new Error('PLAN_MISMATCH');
    for(const a of plan.images)if(sha(fs.readFileSync(input(d.root,dir,a.upload_file)))!==a.sha256)throw new Error('UPLOAD_FILE_CHANGED');
    if(e.saved_in_list!==true||e.reopened_from_list!==true||e.independent_reopen!==true)throw new Error('SAVE_AND_REOPEN_NOT_CONFIRMED');
    validateXhs(plan,e.uploaded,false);validateXhs(plan,e.reopened,true);
    const uploadedSources=new Set(e.uploaded.images.map((im:{src:string})=>im.src));
    if(e.reopened.images.some((im:{src:string})=>im.src.startsWith('blob:')&&uploadedSources.has(im.src)))throw new Error('BLOB_REOPEN_NOT_INDEPENDENT');
    if(new Set(e.reopened.images.map((im:{src:string})=>im.src)).size!==plan.images.length)throw new Error('DUPLICATE_IMAGE_SOURCE');
    if(e.visual_order_verified!==true)throw new Error('VISUAL_ORDER_REVIEW_REQUIRED');
    const receipt={status:'draft_verified',bundle_version:d.bundleVersion,account:plan.account,title:plan.title,checked_at:e.checked_at,images:e.reopened.images,evidence_sha256:sha(fs.readFileSync(evidenceFile)),publication_performed:false};
    atomic(output(d.root,path.join(dir,'receipt.json')),json(receipt));atomic(output(d.root,path.join(dir,'status.json')),json(receipt));return receipt;
  } catch(e) {
    atomic(output(d.root,path.join(dir,'status.json')),json({status:'blocked',code:e instanceof Error&&/^[A-Z_]+$/.test(e.message)?e.message:'VERIFY_FAILED',publication_performed:false}));throw e;
  }
}

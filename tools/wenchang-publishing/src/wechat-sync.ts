import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { check } from './build.js';
import { atomic, sha, readJson, input } from './io.js';
import { readCredentials } from './wechat-preflight.js';
import type { Bundle, ArticleConfig } from './model.js';

export function textOf(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
    .replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&amp;/g,'&').replace(/\s/g,'');
}
export function imageUrls(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1].replace(/&amp;/g,'&'));
}
export function wechatUrl(value: string): boolean {
  try { const u=new URL(value);return ['https:','http:'].includes(u.protocol) && u.hostname==='mmbiz.qpic.cn' && !u.username && !u.password; } catch {return false;}
}
export function imageIdentity(value: string): string {
  if(!wechatUrl(value))return 'invalid:'+value;
  const u=new URL(value);
  // Observed official readback changes HTTP to HTTPS and /0 to /640, preserving asset identity.
  u.protocol='https:';u.pathname=u.pathname.replace(/\/(?:0|640)$/, '/0');
  return u.href;
}
export function verifyArticle(expected: any, actual: any) {
  const images=imageUrls(actual?.content || '');
  return {
    title: actual?.title===expected.title, digest: actual?.digest===expected.digest,
    author: actual?.author===expected.author, text: textOf(actual?.content || '')===textOf(expected.content),
    cover: actual?.thumb_media_id===expected.thumb_media_id,
    images: JSON.stringify(images.map(imageIdentity))===JSON.stringify(imageUrls(expected.content).map(imageIdentity)) && images.every(wechatUrl),
    body_image_count: images.length,
  };
}
const allowed = new Set(['stable_token','draft/batchget','draft/get','draft/add','media/uploadimg','material/add_material']);
export async function apiRequest(endpoint:string, token:string|undefined, body:object|FormData, transport:typeof fetch=fetch):Promise<any> {
  if(!allowed.has(endpoint)) throw new Error('API_NOT_ALLOWED');
  const url=new URL(`https://api.weixin.qq.com/cgi-bin/${endpoint}`);
  if(token)url.searchParams.set('access_token',token);
  if(endpoint==='material/add_material')url.searchParams.set('type','image');
  let response:Response;
  try {response=await transport(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(45000),headers:body instanceof FormData?undefined:{'Content-Type':'application/json'},body:body instanceof FormData?body:JSON.stringify(body)});}
  catch {throw new Error(`NETWORK_UNCERTAIN:${endpoint}`);}
  if(!response.ok)throw new Error(`HTTP_${response.status}:${endpoint}`);
  let data:any; try {data=await response.json();}catch{throw new Error(`INVALID_RESPONSE:${endpoint}`);}
  if(!data||typeof data!=='object')throw new Error(`INVALID_RESPONSE:${endpoint}`);
  if(data.errcode!==undefined&&data.errcode!==0)throw new Error(`WECHAT_${Number(data.errcode)}:${endpoint}`);
  return data;
}
export async function syncDraft(directory:string, configFile:string) {
  const dir=fs.realpathSync(directory), config=fs.realpathSync(configFile);
  const credentials=readCredentials(config);
  if(check(dir).status!=='local_ready')throw new Error('BUNDLE_STALE_REBUILD_FIRST');
  const bundle=readJson<Bundle>(path.join(dir,'bundle.json'));
  const platform=bundle.platforms.wechat;
  if(!platform?.fragment)throw new Error('WECHAT_BUILD_REQUIRED');
  const fragmentFile=input(dir,dir,platform.fragment);
  const metadata=readJson<ArticleConfig>(path.join(dir,'platforms/wechat.json'));
  if(!metadata.cover||!metadata.digest)throw new Error('COVER_AND_DIGEST_REQUIRED');
  const project=readJson(path.join(dir,'project.json'));
  const root=fs.realpathSync(path.resolve(dir,project.workspace_ref));
  const cover=input(root,dir,metadata.cover);
  const fragment=fs.readFileSync(fragmentFile,'utf8');
  const refs=imageUrls(fragment);
  if(!refs.length)throw new Error('NO_BODY_IMAGES');
  const files=refs.map(ref=>input(dir,path.dirname(fragmentFile),ref));
  const fingerprint=sha(JSON.stringify([fragment,metadata,[...files,cover].map(f=>sha(fs.readFileSync(f))),credentials.app_id]));
  const work=path.join(path.dirname(config),'sync',sha(credentials.app_id).slice(0,16),sha(bundle.content_id).slice(0,16));
  fs.mkdirSync(work,{recursive:true,mode:0o700});
  const lock=path.join(work,'lock');const fd=fs.openSync(lock,'wx',0o600);
  const journalFile=path.join(work,'journal.json');
  const journal:any=fs.existsSync(journalFile)?readJson(journalFile):{fingerprint,assets:{},status:'prepared'};
  const save=()=>{atomic(journalFile,JSON.stringify(journal,null,2));fs.chmodSync(journalFile,0o600);};
  try {
    if(journal.fingerprint!==fingerprint)throw new Error('CONTENT_CHANGED_REQUIRES_REVIEW');
    if(journal.status==='add_pending'&&!journal.media_id)throw new Error('PREVIOUS_ADD_UNCERTAIN_MANUAL_RECONCILIATION_REQUIRED');
    const auth=await apiRequest('stable_token',undefined,{grant_type:'client_credential',appid:credentials.app_id,secret:credentials.app_secret,force_refresh:false});
    if(typeof auth.access_token!=='string'||!auth.access_token)throw new Error('TOKEN_MISSING');
    const token=auth.access_token;
    if(!journal.media_id){
      for(let offset=0; ; offset+=20){
        const list=await apiRequest('draft/batchget',token,{offset,count:20,no_content:0});
        if(!Array.isArray(list.item)||!Number.isInteger(list.total_count))throw new Error('DRAFT_LIST_INVALID');
        if(list.item.some((x:any)=>x.content?.news_item?.some((a:any)=>a.title===metadata.title)))throw new Error('EXISTING_TITLE_REQUIRES_REVIEW');
        if(offset+list.item.length>=list.total_count)break;
        if(list.item.length===0||offset>=10000)throw new Error('DRAFT_LIST_INCOMPLETE');
      }
    }
    async function upload(file:string,kind:'body'|'cover') {
      const hash=sha(fs.readFileSync(file)), key=kind+':'+hash;
      if(journal.assets[key])return journal.assets[key];
      const ext=path.extname(file).toLowerCase();
      if(!['.png','.jpg','.jpeg'].includes(ext))throw new Error('ONLY_STATIC_PNG_JPEG_SUPPORTED');
      // macOS sips creates an upload derivative; original images are never modified.
      const derivative=path.join(work,hash+'.jpg');
      execFileSync('/usr/bin/sips',['-s','format','jpeg','-s','formatOptions','85',file,'--out',derivative],{stdio:'ignore'});
      const bytes=fs.readFileSync(derivative);
      if(bytes.length>1000000)throw new Error('IMAGE_DERIVATIVE_TOO_LARGE');
      const form=new FormData();form.append('media',new Blob([bytes],{type:'image/jpeg'}),hash+'.jpg');
      const result=await apiRequest(kind==='body'?'media/uploadimg':'material/add_material',token,form);
      if(kind==='body'&&(!result.url||!wechatUrl(result.url)))throw new Error('IMAGE_URL_INVALID');
      if(kind==='cover'&&typeof result.media_id!=='string')throw new Error('COVER_MEDIA_ID_MISSING');
      const safe={url:result.url,media_id:result.media_id,source_hash:hash,upload_hash:sha(bytes),upload_bytes:bytes.length};
      journal.assets[key]=safe;save();return safe;
    }
    let content=fragment;
    for(let i=0;i<files.length;i++){const asset=await upload(files[i],'body');content=content.split(refs[i]).join(asset.url.replace(/&/g,'&amp;'));}
    const coverAsset=await upload(cover,'cover');
    const article={title:metadata.title,author:metadata.author||'',digest:metadata.digest,content,thumb_media_id:coverAsset.media_id,need_open_comment:0,only_fans_can_comment:0};
    if(!journal.media_id){
      journal.status='add_pending';save();
      const result=await apiRequest('draft/add',token,{articles:[article]});
      if(typeof result.media_id!=='string')throw new Error('DRAFT_MEDIA_ID_MISSING');
      journal.media_id=result.media_id;journal.status='saved_pending_readback';save();
    }
    const readback=await apiRequest('draft/get',token,{media_id:journal.media_id});
    if(!Array.isArray(readback.news_item)||readback.news_item.length!==1)throw new Error('READBACK_ARTICLE_COUNT');
    const validation=verifyArticle(article,readback.news_item[0]);
    const passed=Object.entries(validation).filter(([k])=>k!=='body_image_count').every(([,v])=>v===true);
    journal.status=passed?'draft_verified':'readback_mismatch';journal.validation=validation;save();
    const receipt={status:journal.status,checked_at:new Date().toISOString(),account_name_supplied:credentials.account_name,account_identity_verified:false,content_id:bundle.content_id,bundle_version:bundle.bundle_version,source_hash:bundle.source_hash,media_id:journal.media_id,validation,visual_review:'pending',publication_performed:false};
    atomic(path.join(dir,'wechat-sync-receipt.json'),JSON.stringify(receipt,null,2));
    if(!passed)throw new Error('READBACK_MISMATCH_DRAFT_PRESERVED');
    return receipt;
  } finally {fs.closeSync(fd);fs.unlinkSync(lock);}
}

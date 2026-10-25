import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { check } from './build.js';
import { atomic, sha, readJson, input, stable } from './io.js';
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
// These are the two observed response-only article URLs. All other fields,
// including fields unknown to this client, participate in conflict detection.
const responseOnlyFields = new Set(['url', 'thumb_url']);
export function normalizeRemoteArticle(article: any): any {
  const normalized: any = {};
  for (const [key, value] of Object.entries(article || {})) {
    if (responseOnlyFields.has(key)) continue;
    normalized[key] = key === 'content' && typeof value === 'string'
      ? value.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi, (_, before, src, after) =>
        before + imageIdentity(src.replace(/&amp;/g, '&')).replace(/&/g, '&amp;') + after)
      : value;
  }
  return JSON.parse(stable(normalized));
}
export function remoteConflictFields(expected: any, actual: any): string[] {
  const a = normalizeRemoteArticle(expected), b = normalizeRemoteArticle(actual);
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()
    .filter(key => stable(a[key]) !== stable(b[key]))
    .map(key => /^[a-zA-Z0-9_]+$/.test(key) ? key : 'unrecognized_field');
}
export function desiredArticle(previousLocal: any, nextLocal: any, remote: any): any {
  const desired = structuredClone(remote);
  for (const key of responseOnlyFields) delete desired[key];
  // Preserve the actual platform HTML and unmanaged editor fields when the
  // corresponding local field has not changed (for example a digest-only edit).
  for (const key of ['title', 'author', 'digest', 'content', 'thumb_media_id']) {
    if (previousLocal[key] !== nextLocal[key]) desired[key] = nextLocal[key];
  }
  return desired;
}
const allowed = new Set(['stable_token','draft/batchget','draft/get','draft/add','draft/update','media/uploadimg','material/add_material']);
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
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error(`INVALID_RESPONSE:${endpoint}`);
  if(data.errcode!==undefined&&data.errcode!==0)throw new Error(`WECHAT_${Number(data.errcode)}:${endpoint}`);
  if(endpoint==='draft/update'&&data.errcode!==0)throw new Error(`INVALID_RESPONSE:${endpoint}`);
  return data;
}
export async function syncDraft(directory:string, configFile:string) {
  return runWithReceipt(directory,configFile);
}
// The caller supplies the hash reviewed and approved by the user. Adoption only
// records that exact existing remote draft locally; it never writes to WeChat.
export async function adoptBaseline(directory:string, configFile:string, expectedRemoteHash:string) {
  // Keep a missing runtime argument in adoption mode, where validation rejects
  // it; JavaScript callers must never fall through to the normal sync writer.
  return runWithReceipt(directory,configFile,typeof expectedRemoteHash==='string'?expectedRemoteHash:'','adopt');
}
export async function reconcileBaseline(directory:string, configFile:string, expectedRemoteHash:string) {
  return runWithReceipt(directory,configFile,typeof expectedRemoteHash==='string'?expectedRemoteHash:'','reconcile');
}
type BaselineMode='adopt'|'reconcile';
async function runWithReceipt(directory:string, configFile:string, expectedRemoteHash?:string, baselineMode?:BaselineMode) {
  try {
    if(expectedRemoteHash!==undefined&&!/^[a-f0-9]{64}$/.test(expectedRemoteHash))throw new Error('INVALID_EXPECTED_REMOTE_HASH');
    return await syncDraftWithJournal(directory,configFile,expectedRemoteHash,baselineMode);
  }
  catch(error) {
    const details=error as Error&{sync_receipt_written?:boolean;sync_skip_receipt?:boolean;sync_status?:string;conflict_fields?:string[];recovery_action?:string};
    if(!details?.sync_receipt_written&&!details?.sync_skip_receipt) {
      // Even failures before credentials/lock acquisition invalidate a previous
      // successful receipt for this invocation. Only write into an existing bundle.
      try {
        const dir=fs.realpathSync(directory), bundle=readJson<Bundle>(path.join(dir,'bundle.json'));
        const code=details instanceof Error&&/^[A-Z0-9_]+(?::[a-z/_]+)?$/.test(details.message)?details.message:'LOCAL_CONFIG_OR_IO_ERROR';
        atomic(path.join(dir,'wechat-sync-receipt.json'),JSON.stringify({status:'blocked',operation:'verify',code,checked_at:new Date().toISOString(),content_id:bundle.content_id,bundle_version:bundle.bundle_version,source_hash:bundle.source_hash,account_identity_verified:false,validation:{},conflict_fields:[],recovery_action:'检查当前输入或配置；保留 journal 和原草稿后重试。',visual_review:'pending',publication_performed:false},null,2));
      } catch {/* Preserve the original error when the bundle cannot be read or written. */}
    }
    throw error;
  }
}
async function syncDraftWithJournal(directory:string, configFile:string, expectedRemoteHash?:string, baselineMode?:BaselineMode) {
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
  const lock=path.join(work,'lock');let fd:number;
  try {fd=fs.openSync(lock,'wx',0o600);}
  catch(error) {
    if((error as NodeJS.ErrnoException).code==='EEXIST')
      throw Object.assign(new Error('SYNC_ALREADY_RUNNING'),{sync_skip_receipt:true,sync_status:'blocked',recovery_action:'同一内容已有同步任务；等待它结束后重试，当前任务不会改写该任务的回执。'});
    throw error;
  }
  const journalFile=path.join(work,'journal.json');
  let journal:any;
  let operation:'create'|'update'|'verify'|'reconciled'='verify';
  const save=()=>{atomic(journalFile,JSON.stringify(journal,null,2));fs.chmodSync(journalFile,0o600);};
  const receiptFile=path.join(dir,'wechat-sync-receipt.json');
  function receipt(status:string, extra:Record<string,unknown>={}) {
    const result={status,operation,checked_at:new Date().toISOString(),account_name_supplied:credentials.account_name,account_identity_verified:false,content_id:bundle.content_id,bundle_version:bundle.bundle_version,source_hash:bundle.source_hash,media_id:journal?.media_id,validation:journal?.validation||{},visual_review:'pending',publication_performed:false,...extra};
    atomic(receiptFile,JSON.stringify(result,null,2));
    return result;
  }
  function fail(code:string,status='blocked',fields:string[]=[],action='检查当前回执；保留 journal 和原草稿，解决原因后再同步。'):never {
    throw Object.assign(new Error(code),{sync_status:status,conflict_fields:fields,recovery_action:action});
  }
  function passed(validation:ReturnType<typeof verifyArticle>) {
    return Object.entries(validation).filter(([key])=>key!=='body_image_count').every(([,value])=>value===true);
  }
  function conflict(baseline:any,remote:any):never {
    const fields=remoteConflictFields(baseline,remote);
    journal.status='remote_conflict';journal.conflict_fields=fields;save();
    fail('REMOTE_CONFLICT_DRAFT_PRESERVED','remote_conflict',fields,'远端草稿与已记录快照不一致；先核对差异并决定保留或合并，当前命令不会覆盖。');
  }
  function finish(local:any,remote:any,targetFingerprint:string) {
    const validation=verifyArticle(local,remote);
    if(!passed(validation)) {
      journal.status='readback_mismatch';journal.validation=validation;save();
      fail('READBACK_MISMATCH_DRAFT_PRESERVED','readback_mismatch',[],'回读内容与预期不同；先核对远端草稿，保留 journal 和草稿。');
    }
    journal.schema_version=2;journal.fingerprint=targetFingerprint;journal.local_article=local;
    journal.remote_snapshot=normalizeRemoteArticle(remote);journal.status='draft_verified';journal.validation=validation;
    delete journal.pending_update;delete journal.conflict_fields;save();
    return receipt(journal.status);
  }
  try {
    // Read inside the locked try so malformed or unreadable journals release it.
    journal=fs.existsSync(journalFile)?readJson(journalFile):{schema_version:2,fingerprint,assets:{},status:'prepared'};
    if(!journal||typeof journal!=='object'||!journal.assets||typeof journal.assets!=='object')fail('JOURNAL_INVALID');
    if(baselineMode==='adopt') {
      if(typeof journal.media_id!=='string'||!journal.media_id)fail('BASELINE_EXISTING_DRAFT_REQUIRED');
      if(journal.pending_update||['add_pending','saved_pending_readback','update_pending'].includes(journal.status))
        fail('BASELINE_PENDING_OPERATION_REQUIRES_RECONCILIATION','blocked',[],'已有尚未确认的写入；先按原输入回读对账，当前命令不会采纳基线或覆盖 pending。');
      if(journal.fingerprint!==fingerprint)
        fail('BASELINE_LOCAL_INPUT_CHANGED','blocked',[],'恢复上次成功同步的本地输入后再采纳已审基线，当前命令不会变更本地或远端内容。');
    }
    if(baselineMode==='reconcile') {
      if(typeof journal.media_id!=='string'||!journal.media_id||journal.schema_version!==2||!journal.remote_snapshot||typeof journal.remote_snapshot!=='object')
        fail('RECONCILIATION_BASELINE_REQUIRED');
      if(journal.pending_update) {
        if(!['remote_conflict','readback_mismatch'].includes(journal.status))fail('RECONCILIATION_STATUS_REQUIRED');
        if(journal.pending_update.target_fingerprint!==fingerprint)fail('RECONCILIATION_LOCAL_INPUT_CHANGED');
        if(!journal.pending_update.expected_target||!journal.pending_update.target_local_article)fail('JOURNAL_INVALID');
      } else if(journal.fingerprint!==fingerprint||!journal.local_article||journal.baseline_approval?.snapshot_hash!==expectedRemoteHash||journal.baseline_approval?.approved_scope!=='accept_reviewed_remote_html_after_update') {
        fail('RECONCILIATION_PENDING_REQUIRED','blocked',[],'没有与当前本地版本及已审快照对应的待对账更新；当前命令不会替换其他既有基线。');
      }
      if(journal.baseline_reconciliations!==undefined&&!Array.isArray(journal.baseline_reconciliations))fail('JOURNAL_INVALID');
    }
    if(journal.status==='add_pending'&&!journal.media_id)fail('PREVIOUS_ADD_UNCERTAIN_MANUAL_RECONCILIATION_REQUIRED','blocked',[],'先人工对账上次新增草稿；未确认前禁止再次新增，也不要删除 journal。');
    if(journal.pending_update&&journal.pending_update.target_fingerprint!==fingerprint)
      fail('PENDING_UPDATE_INPUT_CHANGED','update_pending',[],'先恢复上次待确认的本地版本并重试，让系统读取远端对账；确认完成后再修改输入。');
    if(journal.media_id&&!journal.remote_snapshot&&journal.fingerprint!==fingerprint)
      fail('LEGACY_BASELINE_REQUIRED','blocked',[],'旧 journal 缺少远端基线；先恢复上次成功的本地输入并同步一次完成只读迁移，再进行改稿。');
    const auth=await apiRequest('stable_token',undefined,{grant_type:'client_credential',appid:credentials.app_id,secret:credentials.app_secret,force_refresh:false});
    if(typeof auth.access_token!=='string'||!auth.access_token)throw new Error('TOKEN_MISSING');
    const token=auth.access_token;
    async function getArticle() {
      const readback=await apiRequest('draft/get',token,{media_id:journal.media_id});
      if(!Array.isArray(readback.news_item)||readback.news_item.length!==1)throw new Error('READBACK_ARTICLE_COUNT');
      return readback.news_item[0];
    }
    if(baselineMode==='reconcile') {
      const remote=await getArticle();
      const snapshot=normalizeRemoteArticle(remote);
      const snapshotHash=sha(JSON.stringify(snapshot));
      if(snapshotHash!==expectedRemoteHash)
        fail('REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED','blocked',[],'远端草稿与已审快照不同；先重新核对差异并由用户确认，当前命令没有写入远端。');
      const pending=journal.pending_update;
      const expected=pending?.expected_target||journal.remote_snapshot;
      const fields=remoteConflictFields(expected,remote);
      if(fields.some(field=>field!=='content')||(!pending&&fields.length!==0))
        fail('RECONCILIATION_SCOPE_MISMATCH_REVIEW_REQUIRED','blocked',fields,'远端存在本次已审 HTML 范围之外的差异；保留原记录与待确认更新，先由用户核对。');
      const local=pending?.target_local_article||journal.local_article;
      const validation=verifyArticle(local,remote);
      if(!passed(validation))
        fail('RECONCILIATION_CORE_MISMATCH_REVIEW_REQUIRED','blocked',[],'正文文字、图序、封面或其他核心内容与本地目标不符；保留原记录与待确认更新，先人工核对。');
      operation='reconciled';
      if(!pending)return receipt('draft_verified',{validation,baseline_reconciled:true,idempotent:true});
      const recordedAt=new Date().toISOString();
      const history={remote_snapshot:structuredClone(journal.remote_snapshot),baseline_approval:journal.baseline_approval?structuredClone(journal.baseline_approval):null,resolved_pending_update:structuredClone(pending),recorded_at:recordedAt};
      journal.baseline_reconciliations=[...(journal.baseline_reconciliations||[]),history];
      journal.baseline_approval={snapshot_hash:snapshotHash,approved_scope:'accept_reviewed_remote_html_after_update',recorded_at:recordedAt};
      journal.fingerprint=pending.target_fingerprint;journal.local_article=local;journal.remote_snapshot=snapshot;
      journal.status='draft_verified';journal.validation=validation;delete journal.pending_update;delete journal.conflict_fields;save();
      return receipt(journal.status,{baseline_reconciled:true});
    }
    if(baselineMode==='adopt') {
      const remote=await getArticle();
      const snapshot=normalizeRemoteArticle(remote);
      const snapshotHash=sha(JSON.stringify(snapshot));
      if(snapshotHash!==expectedRemoteHash)
        fail('REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED','blocked',[],'远端草稿与已审快照不同；重新查看差异并由用户确认后再采纳，当前命令没有写入远端。');
      // Adoption cannot replace an existing baseline, even with a newly supplied
      // hash. Only repeating the same recorded approval is idempotent.
      if(journal.remote_snapshot&&remoteConflictFields(journal.remote_snapshot,remote).length!==0)
        conflict(journal.remote_snapshot,remote);
      let content=fragment;
      for(let i=0;i<files.length;i++) {
        const asset=journal.assets['body:'+sha(fs.readFileSync(files[i]))];
        if(!asset||!wechatUrl(asset.url))fail('BASELINE_ASSET_CACHE_REQUIRED');
        content=content.split(refs[i]).join(asset.url.replace(/&/g,'&amp;'));
      }
      const coverAsset=journal.assets['cover:'+sha(fs.readFileSync(cover))];
      if(typeof coverAsset?.media_id!=='string'||!coverAsset.media_id)fail('BASELINE_ASSET_CACHE_REQUIRED');
      const local={title:metadata.title,author:metadata.author||'',digest:metadata.digest,content,thumb_media_id:coverAsset.media_id,need_open_comment:0,only_fans_can_comment:0};
      const validation=verifyArticle(local,remote);
      if(!passed(validation))
        fail('BASELINE_CORE_MISMATCH_REVIEW_REQUIRED','blocked',[],'标题、摘要、作者、正文文字、封面或图片与原本地预期不符；当前授权仅允许保留已审版式和纯文字引用，请先人工核对。');
      if(journal.remote_snapshot) {
        if(journal.baseline_approval?.snapshot_hash!==snapshotHash||journal.baseline_approval?.approved_scope!=='preserve_remote_html_and_plain_text_references')
          fail('BASELINE_ALREADY_EXISTS','blocked',[],'已有远端基线；直接使用正常同步，当前命令不会替换既有基线。');
        return receipt('draft_verified',{validation,baseline_adopted:true,idempotent:true});
      }
      journal.schema_version=2;journal.local_article=local;journal.remote_snapshot=snapshot;
      journal.baseline_approval={snapshot_hash:snapshotHash,approved_scope:'preserve_remote_html_and_plain_text_references',recorded_at:new Date().toISOString()};
      journal.status='draft_verified';journal.validation=validation;delete journal.conflict_fields;save();
      return receipt(journal.status,{baseline_adopted:true});
    }
    async function sendPendingUpdate() {
      const pending=journal.pending_update;
      operation='update';journal.status='update_pending';
      pending.attempt_count=(pending.attempt_count||0)+1;save();
      let writeError:unknown;
      try {
        await apiRequest('draft/update',token,{media_id:journal.media_id,index:0,articles:pending.expected_target});
      } catch(error) {writeError=error;}
      // A write can apply even when its response is lost, malformed or HTTP-failed.
      // Exactly one read reconciles this invocation; there is no write retry here.
      let remote:any;
      try {remote=await getArticle();}
      catch {
        fail('UPDATE_PENDING_RECONCILIATION_REQUIRED','update_pending',[],'更新结果或回读不确定；保留当前输入后再次同步，系统将先读取远端对账。');
      }
      if(remoteConflictFields(pending.expected_target,remote).length===0) {
        if(writeError)operation='reconciled';
        return finish(pending.target_local_article,remote,pending.target_fingerprint);
      }
      if(remoteConflictFields(pending.baseline,remote).length===0) {
        journal.status='update_pending';save();
        if(writeError instanceof Error&&/^WECHAT_\d+:draft\/update$/.test(writeError.message))
          fail(writeError.message,'update_pending',[],'平台拒绝本次更新，远端仍为更新前版本；按错误码排查后，保持当前输入再次同步并先读对账。');
        fail('UPDATE_PENDING_RECONCILIATION_REQUIRED','update_pending',[],'远端仍为更新前版本；保持当前输入再次同步，先读后最多重发一次更新。');
      }
      conflict(pending.baseline,remote);
    }
    if(journal.pending_update) {
      const pending=journal.pending_update;
      const remote=await getArticle();
      if(remoteConflictFields(pending.expected_target,remote).length===0) {
        operation='reconciled';
        return finish(pending.target_local_article,remote,pending.target_fingerprint);
      }
      if(remoteConflictFields(pending.baseline,remote).length!==0)conflict(pending.baseline,remote);
      // The pending write is confirmed absent. This invocation may send it once.
      return await sendPendingUpdate();
    }
    let remote:any;
    if(journal.media_id) {
      remote=await getArticle();
      if(journal.remote_snapshot&&remoteConflictFields(journal.remote_snapshot,remote).length!==0)
        conflict(journal.remote_snapshot,remote);
      if(journal.remote_snapshot&&!journal.local_article)fail('LOCAL_BASELINE_REQUIRED');
      if(journal.remote_snapshot&&journal.fingerprint===fingerprint)
        return finish(journal.local_article,remote,fingerprint);
    }
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
      if(journal.media_id&&!journal.remote_snapshot)fail('LEGACY_ASSET_BASELINE_REQUIRED');
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
      if(kind==='cover'&&(typeof result.media_id!=='string'||!result.media_id))throw new Error('COVER_MEDIA_ID_MISSING');
      const safe={url:result.url,media_id:result.media_id,source_hash:hash,upload_hash:sha(bytes),upload_bytes:bytes.length};
      journal.assets[key]=safe;save();return safe;
    }
    let content=fragment;
    for(let i=0;i<files.length;i++){const asset=await upload(files[i],'body');content=content.split(refs[i]).join(asset.url.replace(/&/g,'&amp;'));}
    const coverAsset=await upload(cover,'cover');
    const article={title:metadata.title,author:metadata.author||'',digest:metadata.digest,content,thumb_media_id:coverAsset.media_id,need_open_comment:0,only_fans_can_comment:0};
    if(!journal.media_id){
      operation='create';journal.fingerprint=fingerprint;journal.status='add_pending';journal.local_article=article;save();
      const result=await apiRequest('draft/add',token,{articles:[article]});
      if(typeof result.media_id!=='string'||!result.media_id)throw new Error('DRAFT_MEDIA_ID_MISSING');
      journal.media_id=result.media_id;journal.status='saved_pending_readback';save();
      return finish(article,await getArticle(),fingerprint);
    }
    // Legacy migration needs exact prior local inputs and full HTML equality
    // after only observed image URL aliases. Text-only verification would
    // silently adopt changed links or formatting as an approved baseline.
    if(!journal.remote_snapshot) {
      if(normalizeRemoteArticle({content:article.content}).content!==normalizeRemoteArticle(remote).content) {
        journal.status='remote_conflict';journal.conflict_fields=['content'];save();
        fail('LEGACY_REMOTE_REVIEW_REQUIRED','remote_conflict',['content'],'旧 journal 缺少远端基线，当前正文链接或 HTML 与原本地输入不同；先人工核对差异并决定如何合并，当前命令不会采纳远端正文为基线。');
      }
      return finish(article,remote,fingerprint);
    }
    const desired=desiredArticle(journal.local_article,article,remote);
    if(remoteConflictFields(desired,remote).length===0)return finish(article,remote,fingerprint);
    // Recheck after any uploads to narrow the read/write race. This client has no
    // verified conditional revision token, so an edit after this read can still
    // race the update; do not claim an atomic compare-and-swap guarantee.
    const latest=await getArticle();
    if(remoteConflictFields(journal.remote_snapshot,latest).length!==0)conflict(journal.remote_snapshot,latest);
    const target=desiredArticle(journal.local_article,article,latest);
    journal.pending_update={baseline:journal.remote_snapshot,target_fingerprint:fingerprint,expected_target:target,target_local_article:article,requested_at:new Date().toISOString(),attempt_count:0};
    journal.status='update_pending';save();
    return await sendPendingUpdate();
  } catch(error) {
    const details=error as Error&{sync_receipt_written?:boolean;sync_status?:string;conflict_fields?:string[];recovery_action?:string};
    const status=details.sync_status||(journal?.pending_update?'update_pending':'blocked');
    const code=details instanceof Error&&/^[A-Z0-9_]+(?::[a-z/_]+)?$/.test(details.message)?details.message:'LOCAL_CONFIG_OR_IO_ERROR';
    receipt(status,{code,conflict_fields:details.conflict_fields||[],recovery_action:details.recovery_action||'保留 journal 和原草稿；先核对失败原因，写入不确定时再次同步会先读取远端。',validation:{}});
    if(details&&typeof details==='object')details.sync_receipt_written=true;
    throw error;
  } finally {fs.closeSync(fd);fs.unlinkSync(lock);}
}

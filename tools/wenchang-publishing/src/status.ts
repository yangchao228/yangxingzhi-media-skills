import fs from 'node:fs';
import path from 'node:path';
import { check } from './build.js';
import { sha, stable, validate, within } from './io.js';
import { loadProject } from './project.js';
import { PLATFORMS, PublishingError, type Bundle, type Platform } from './model.js';
import { validateObservation } from './zhihu-sync.js';
import { validateXhs } from './xhs-sync.js';

export type PublishingState = 'not_started' | 'ready_for_browser' | 'blocked' | 'historical_verified' | 'verified_current' | 'stale_receipt' | 'invalid_evidence';
type Relation = 'none' | 'current' | 'historical_equivalent' | 'stale' | 'invalid';
interface ReceiptSummary { relation: Relation; status?: string; bundle_version?: string }
export interface PlatformStatus {
  platform: Platform; state: PublishingState; receipt: ReceiptSummary; checked_at?: string;
  attempt_id?: string; started_at?: string; updated_at?: string; recovery_action?: string;
  draft_storage: 'platform' | 'browser_local' | 'unknown'; review_pending: string[];
  next_action: string; issue_codes: string[];
  account_identity_verified?: false; visual_review?: 'pending'; api_readback_verified?: boolean;
  operation?: 'create' | 'update' | 'verify' | 'reconciled'; conflict_fields?: string[];
  evidence_scope?: 'default' | 'chrome';
  historical?: { state: PublishingState; receipt: ReceiptSummary; checked_at?: string; evidence_scope?: 'default' | 'chrome' }[];
}
export interface PublishingStatus {
  checked_at: string; content_id?: string; bundle_version: string | null;
  local: { state: 'local_ready' | 'stale' | 'blocked'; issue_codes: string[]; changed_inputs?: number; next_action: string };
  platforms: PlatformStatus[]; publication_performed: false;
}
const HASH = /^[a-f0-9]{64}$/;
const KNOWN_STATUS = new Set(['preparing', 'verifying', 'ready_for_browser', 'blocked', 'draft_verified', 'readback_mismatch', 'prepared', 'saved_pending_readback', 'add_pending', 'update_pending', 'remote_conflict']);
const fail = (code: string): never => { throw new Error(code); };
const codeOf = (e: unknown) => e instanceof PublishingError
  ? e.issues.map(i => i.code).filter(c => /^[A-Z][A-Z0-9_]{0,80}$/.test(c))
  : [e instanceof Error && /^[A-Z][A-Z0-9_]{0,80}$/.test(e.message) ? e.message : 'LOCAL_STATUS_UNAVAILABLE'];
const iso = (value: unknown): string | undefined => typeof value === 'string' && value.length < 80 && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : undefined;

// All evidence reads are fixed local paths below distribution. Reject symlinks even
// when their target happens to be inside distribution; no credentials are followed.
function safePath(dir: string, relative: string, optional = false): string | undefined {
  if (!relative || path.isAbsolute(relative) || path.win32.isAbsolute(relative) || /[\\\0:]/.test(relative)) fail('UNSAFE_STATUS_PATH');
  const target = path.resolve(dir, relative);
  if (!within(dir, target) || target === dir) fail('UNSAFE_STATUS_PATH');
  let part = dir;
  const components = path.relative(dir, target).split(path.sep);
  for (const [index, component] of components.entries()) {
    part = path.join(part, component);
    let stat: fs.Stats;
    try { stat = fs.lstatSync(part); } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT' && optional) return undefined;
      return fail('STATUS_FILE_MISSING');
    }
    if (stat.isSymbolicLink()) fail('UNSAFE_STATUS_PATH');
    if (index < components.length - 1 && !stat.isDirectory()) fail('UNSAFE_STATUS_PATH');
  }
  return target;
}
function read(dir: string, relative: string, optional = false): any {
  const file = safePath(dir, relative, optional);
  if (!file) return undefined;
  const stat = fs.statSync(file);
  if (!stat.isFile() || stat.size > 20 * 1024 * 1024) fail('INVALID_STATUS_FILE');
  try { const value = JSON.parse(fs.readFileSync(file, 'utf8')); if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_STATUS_JSON'); return value; }
  catch { return fail('INVALID_STATUS_JSON'); }
}
function hashFile(dir: string, relative: string): string {
  const file = safePath(dir, relative)!;
  if (!fs.statSync(file).isFile() || fs.statSync(file).size > 64 * 1024 * 1024) fail('INVALID_OUTPUT_FILE');
  return sha(fs.readFileSync(file));
}
function bundleAt(dir: string, version?: string): Bundle {
  if (version && !HASH.test(version)) fail('INVALID_BUNDLE_VERSION');
  const bundle = read(dir, version ? `builds/${version}/bundle.json` : 'bundle.json');
  validate('bundle', bundle);
  if (version && bundle.bundle_version !== version) fail('SNAPSHOT_VERSION_MISMATCH');
  return bundle;
}
function outputs(dir: string, bundle: Bundle, platform: Platform): Map<string, string> {
  const build = bundle.platforms[platform];
  if (!build || !HASH.test(build.version) || !Array.isArray(build.outputs) || !build.outputs.length) fail('PLATFORM_OUTPUTS_MISSING');
  const prefix = `renders/${platform}/${build.version}/`, result = new Map<string, string>();
  for (const item of build.outputs) {
    if (typeof item.ref !== 'string' || !item.ref.startsWith(prefix) || !HASH.test(item.sha256)) fail('UNSAFE_OUTPUT_REFERENCE');
    const key = item.ref.slice(prefix.length);
    if (!key || key.split('/').some(p => !p || p === '.' || p === '..') || result.has(key)) fail('INVALID_OUTPUT_REFERENCE');
    const file = safePath(dir, item.ref)!;
    if (!fs.statSync(file).isFile() || fs.statSync(file).size !== item.bytes || hashFile(dir, item.ref) !== item.sha256) fail('OUTPUT_HASH_MISMATCH');
    result.set(key, item.sha256);
  }
  return result;
}
function inputSet(bundle: Bundle, platform: Platform): string {
  const items = bundle.platforms[platform]?.inputs;
  if (!Array.isArray(items) || !items.length || items.some(i => typeof i.ref !== 'string' || !HASH.test(i.sha256))) fail('PLATFORM_INPUTS_INVALID');
  const entries = items.map(i => [i.ref, i.sha256]).sort(([a], [b]) => a.localeCompare(b, 'en'));
  if (new Set(entries.map(i => i[0])).size !== entries.length) fail('PLATFORM_INPUTS_INVALID');
  return stable(entries);
}
function relation(dir: string, bundle: Bundle, platform: Platform, version: string, sourceHash?: string): Relation {
  if (!HASH.test(version) || (sourceHash !== undefined && !HASH.test(sourceHash))) fail('RECEIPT_VERSION_INVALID');
  const saved = bundleAt(dir, version);
  if (sourceHash !== undefined && saved.source_hash !== sourceHash) fail('RECEIPT_SOURCE_MISMATCH');
  const before = outputs(dir, saved, platform), after = outputs(dir, bundle, platform);
  const equivalent = saved.content_id === bundle.content_id && saved.source_hash === bundle.source_hash && inputSet(saved, platform) === inputSet(bundle, platform)
    && stable([...before].sort()) === stable([...after].sort());
  if (version === bundle.bundle_version) {
    if (!equivalent) fail('CURRENT_SNAPSHOT_MISMATCH');
    return 'current';
  }
  return equivalent ? 'historical_equivalent' : 'stale';
}
interface Candidate { base: string; version: string; activity: number; invalid?: boolean }
function candidates(dir: string, platform: Platform): Candidate[] {
  const relative = `transfers/${platform}`, folder = safePath(dir, relative, true);
  if (!folder) return [];
  if (!fs.statSync(folder).isDirectory()) fail('INVALID_TRANSFER_DIRECTORY');
  const entries = fs.readdirSync(folder, { withFileTypes: true });
  if (entries.length > 1000) fail('TOO_MANY_TRANSFER_RECORDS');
  return entries.filter(entry => HASH.test(entry.name)).map(entry => {
    const base = `${relative}/${entry.name}`;
    try {
      const p = safePath(dir, base)!;
      if (!fs.statSync(p).isDirectory()) fail('INVALID_TRANSFER_DIRECTORY');
      let activity = 0;
      for (const name of ['status.json', 'receipt.json', 'plan.json']) {
        const f = safePath(dir, `${base}/${name}`, true);
        if (f) activity = Math.max(activity, fs.statSync(f).mtimeMs);
      }
      return { base, version: entry.name, activity };
    } catch { return { base, version: entry.name, activity: Number.MAX_SAFE_INTEGER, invalid: true }; }
  }).sort((a, b) => b.activity - a.activity || a.version.localeCompare(b.version));
}
function initial(platform: Platform): PlatformStatus {
  return { platform, state: 'not_started', receipt: { relation: 'none' }, draft_storage: platform === 'xiaohongshu' ? 'browser_local' : 'platform', review_pending: [], next_action: '准备该平台的草稿同步。', issue_codes: [] };
}
function invalid(result: PlatformStatus, error: unknown): PlatformStatus {
  return { ...result, state: 'invalid_evidence', receipt: { ...result.receipt, relation: 'invalid' }, issue_codes: codeOf(error), next_action: '检查本地回执、计划、证据及历史产物；修复后重新核验。' };
}
function validatePlan(plan: any, version: string, sourceHash: string): void {
  if (plan.bundle_version !== version || plan.source_hash !== sourceHash || plan.schema_version !== 1
    || plan.publication_performed !== false || typeof plan.account !== 'string' || !plan.account.trim()
    || typeof plan.title !== 'string' || !plan.title.trim() || !Array.isArray(plan.images)) fail('EVIDENCE_PLAN_MISMATCH');
  for (const image of plan.images) {
    if (!image || typeof image !== 'object' || !HASH.test(image.sha256) || !Number.isFinite(image.width)
      || !Number.isFinite(image.height) || image.width <= 0 || image.height <= 0) fail('PLAN_IMAGES_INVALID');
  }
}
function boundEvidence(dir: string, candidate: Candidate, expectedHash: unknown): { evidence: any; scope: 'default' | 'chrome' } {
  if (typeof expectedHash !== 'string' || !HASH.test(expectedHash)) fail('EVIDENCE_HASH_MISMATCH');
  // verify accepts an explicit evidence file. Resolve only these known browser
  // scopes by immutable bytes; never infer trust from a filename or search broadly.
  for (const [relative, scope] of [['evidence.json', 'default'], ['chrome/evidence.json', 'chrome']] as const) {
    const reference = `${candidate.base}/${relative}`;
    if (!safePath(dir, reference, true)) continue;
    if (hashFile(dir, reference) === expectedHash) return { evidence: read(dir, reference), scope };
  }
  return fail('EVIDENCE_HASH_MISMATCH');
}
function archivedReceipts(dir: string, candidate: Candidate): { state: PublishingState; receipt: ReceiptSummary; checked_at?: string }[] {
  const history = safePath(dir, `${candidate.base}/history`, true);
  if (!history || !fs.statSync(history).isDirectory()) return [];
  return fs.readdirSync(history, { withFileTypes: true }).filter(entry => entry.isDirectory()).flatMap(entry => {
    try {
      const receipt = read(dir, `${candidate.base}/history/${entry.name}/receipt.json`, true);
      if (!receipt || receipt.status !== 'draft_verified' || receipt.publication_performed !== false) return [];
      return [{ state: 'historical_verified' as const, receipt: { relation: 'historical_equivalent' as const, status: 'draft_verified', bundle_version: receipt.bundle_version }, ...(iso(receipt.checked_at) ? { checked_at: iso(receipt.checked_at) } : {}) }];
    } catch { return []; }
  });
}
function browserEvidence(dir: string, candidate: Candidate, platform: 'zhihu' | 'xiaohongshu', receipt: any, bundle: Bundle): 'default' | 'chrome' {
  const plan = read(dir, `${candidate.base}/plan.json`), { evidence, scope } = boundEvidence(dir, candidate, receipt.evidence_sha256);
  validatePlan(plan, candidate.version, bundle.source_hash);
  if (evidence.plan_hash !== hashFile(dir, `${candidate.base}/plan.json`) || plan.bundle_version !== candidate.version || plan.source_hash !== bundle.source_hash
    || plan.publication_performed !== false || evidence.independent_reopen !== true) fail('EVIDENCE_PLAN_MISMATCH');
  if (!iso(evidence.checked_at) || iso(evidence.checked_at) !== iso(receipt.checked_at) || receipt.account !== plan.account || typeof plan.account !== 'string' || !plan.account.trim()) fail('EVIDENCE_RECEIPT_MISMATCH');
  if (stable(receipt.images) !== stable(evidence.reopened?.images)) fail('RECEIPT_IMAGES_MISMATCH');
  if (platform === 'zhihu') {
    if (receipt.source_hash !== plan.source_hash || receipt.draft_url !== plan.draft_url) fail('EVIDENCE_RECEIPT_MISMATCH');
    validateObservation(plan, evidence.imported); validateObservation(plan, evidence.reopened);
    if (evidence.imported.images.some((im: any, i: number) => im.src !== evidence.reopened.images[i].src)) fail('REOPEN_IMAGE_IDENTITY_MISMATCH');
  } else {
    if (receipt.title !== plan.title || evidence.saved_in_list !== true || evidence.reopened_from_list !== true || evidence.visual_order_verified !== true) fail('SAVE_AND_REOPEN_NOT_CONFIRMED');
    for (const image of plan.images) {
      if (typeof image.upload_file !== 'string' || !/^upload\/[a-zA-Z0-9._-]+$/.test(image.upload_file)) fail('UNSAFE_UPLOAD_REFERENCE');
      if (hashFile(dir, `${candidate.base}/${image.upload_file}`) !== image.sha256) fail('UPLOAD_FILE_CHANGED');
    }
    validateXhs(plan, evidence.uploaded, false); validateXhs(plan, evidence.reopened, true);
    const uploaded = new Set(evidence.uploaded.images.map((im: any) => im.src));
    if (evidence.reopened.images.some((im: any) => im.src.startsWith('blob:') && uploaded.has(im.src))) fail('BLOB_REOPEN_NOT_INDEPENDENT');
    if (new Set(evidence.reopened.images.map((im: any) => im.src)).size !== plan.images.length) fail('DUPLICATE_IMAGE_SOURCE');
  }
  return scope;
}
function browserStatus(dir: string, bundle: Bundle, platform: 'zhihu' | 'xiaohongshu', candidate: Candidate): PlatformStatus {
  let result = initial(platform);
  try {
    if (candidate.invalid) fail('UNSAFE_STATUS_PATH');
    const status = read(dir, `${candidate.base}/status.json`, true), receipt = read(dir, `${candidate.base}/receipt.json`, true);
    if (status && !KNOWN_STATUS.has(status.status)) fail('UNKNOWN_TRANSFER_STATUS');
    if (status) {
      result.attempt_id = typeof status.attempt_id === 'string' ? status.attempt_id : undefined;
      result.started_at = iso(status.started_at);
      result.updated_at = iso(status.updated_at);
      result.recovery_action = typeof status.recovery_action === 'string' ? status.recovery_action : undefined;
    }
    result.checked_at = iso(status?.checked_at) || iso(status?.updated_at) || iso(receipt?.checked_at);
    if (status && status.status !== 'draft_verified') {
      result.state = status.status === 'ready_for_browser' && candidate.version === bundle.bundle_version ? 'ready_for_browser' : 'blocked';
      if (result.state === 'ready_for_browser') {
        const plan = read(dir, `${candidate.base}/plan.json`);
        validatePlan(plan, candidate.version, bundle.source_hash);
      }
      result.receipt = { relation: receipt ? 'stale' : 'none', status: status.status, bundle_version: candidate.version };
      const errorCode = typeof status.last_error_code === 'string' && /^[A-Z][A-Z0-9_]{0,80}$/.test(status.last_error_code)
        ? status.last_error_code
        : typeof status.code === 'string' && /^[A-Z][A-Z0-9_]{0,80}$/.test(status.code) ? status.code : 'TRANSFER_NOT_VERIFIED';
      result.issue_codes = [errorCode];
      if (receipt?.status === 'draft_verified' && receipt.publication_performed === false) {
        result.historical = [{ state: 'historical_verified', receipt: { relation: 'historical_equivalent', status: 'draft_verified', bundle_version: receipt.bundle_version }, ...(iso(receipt.checked_at) ? { checked_at: iso(receipt.checked_at) } : {}) }];
      }
      result.historical = [...(result.historical || []), ...archivedReceipts(dir, candidate)];
      result.next_action = result.state === 'ready_for_browser' ? '在目标浏览器保存草稿，再独立重开并核验。' : result.recovery_action || '先处理最新同步状态；旧成功回执只能作为历史记录，不能替代本次核验。';
      return result;
    }
    if (!receipt) { if (status?.status === 'draft_verified') fail('VERIFIED_RECEIPT_MISSING'); return result; }
    if (receipt.status !== 'draft_verified' || receipt.publication_performed !== false || receipt.bundle_version !== candidate.version || !iso(receipt.checked_at)) fail('INVALID_VERIFIED_RECEIPT');
    const saved = bundleAt(dir, candidate.version);
    result.evidence_scope = browserEvidence(dir, candidate, platform, receipt, saved);
    if (result.evidence_scope === 'chrome') result.issue_codes.push('EVIDENCE_SCOPED_CHROME');
    const rel = relation(dir, bundle, platform, candidate.version, receipt.source_hash);
    result.receipt = { relation: rel, status: 'draft_verified', bundle_version: candidate.version };
    result.state = rel === 'current' ? 'verified_current' : rel === 'historical_equivalent' ? 'historical_verified' : 'stale_receipt';
    result.checked_at = iso(receipt.checked_at);
    result.review_pending = platform === 'zhihu' ? ['visual_review'] : ['browser_restart_persistence'];
    result.next_action = rel === 'stale' ? '当前内容与回执版本不同，重新同步并独立核验。' : platform === 'zhihu' ? '检查平台草稿排版与封面；发布由用户决定。' : '由用户安排浏览器重启持久性验收；发布由用户决定。';
    return result;
  } catch (error) { return invalid(result, error); }
}
function wechatStatus(dir: string, bundle: Bundle): PlatformStatus {
  let result = initial('wechat');
  result.review_pending = ['account_identity', 'visual_review']; result.account_identity_verified = false; result.visual_review = 'pending';
  try {
    const receipt = read(dir, 'wechat-sync-receipt.json', true);
    if (!receipt) return result;
    if (!KNOWN_STATUS.has(receipt.status) || !HASH.test(receipt.bundle_version)) fail('INVALID_WECHAT_RECEIPT');
    result.checked_at = iso(receipt.checked_at);
    result.receipt = { relation: 'stale', status: receipt.status, bundle_version: receipt.bundle_version };
    if (['create', 'update', 'verify', 'reconciled'].includes(receipt.operation)) result.operation = receipt.operation;
    if (receipt.status !== 'draft_verified') {
      result.conflict_fields = Array.isArray(receipt.conflict_fields) ? receipt.conflict_fields.filter((field: unknown) => typeof field === 'string' && /^[a-zA-Z0-9_]{1,80}$/.test(field)).slice(0, 40) : [];
      const code = typeof receipt.code === 'string' && /^[A-Z][A-Z0-9_]{0,80}(?::[a-z/_]+)?$/.test(receipt.code) ? receipt.code : 'WECHAT_READBACK_NOT_VERIFIED';
      return { ...result, state: 'blocked', issue_codes: [code], next_action: receipt.status === 'remote_conflict'
        ? '远端草稿已修改；保留改动，先查看差异并由用户决定合并方式。'
        : receipt.status === 'update_pending' ? '保持待确认的本地版本再次同步，先读取原草稿对账；不要删除 journal 或新建草稿。'
        : '检查公众号最新同步与回读结果，保留现有草稿和 journal。' };
    }
    if (!result.checked_at || !HASH.test(receipt.source_hash) || receipt.publication_performed !== false || receipt.content_id !== bundle.content_id
      || !['title', 'digest', 'author', 'text', 'cover', 'images'].every(key => receipt.validation?.[key] === true)
      || !Number.isInteger(receipt.validation?.body_image_count) || receipt.validation.body_image_count < 0) fail('INVALID_WECHAT_VALIDATION');
    const rel = relation(dir, bundle, 'wechat', receipt.bundle_version, receipt.source_hash);
    result.receipt.relation = rel; result.api_readback_verified = true;
    result.state = rel === 'current' ? 'verified_current' : rel === 'historical_equivalent' ? 'historical_verified' : 'stale_receipt';
    result.next_action = rel === 'stale' ? '当前公众号内容已变化，检查后更新原草稿并重新回读。' : '由用户核对公众号身份、后台排版及封面；API 回读仅代表数据核验。';
    return result;
  } catch (error) { return invalid(result, error); }
}

/** Read-only local status. No uploads, browser access, credentials, or receipt writes. */
export function publishingStatus(directory: string): PublishingStatus {
  const result: PublishingStatus = { checked_at: new Date().toISOString(), bundle_version: null,
    local: { state: 'blocked', issue_codes: [], next_action: '补齐本地配置并构建分发包。' }, platforms: [], publication_performed: false };
  let targets: readonly Platform[] = PLATFORMS, dir: string, bundle: Bundle;
  try {
    const lexical = path.resolve(directory);
    if (fs.lstatSync(lexical).isSymbolicLink()) fail('UNSAFE_STATUS_PATH');
    dir = fs.realpathSync(lexical); safePath(dir, 'project.json');
    const loaded = loadProject(dir); targets = loaded.project.target_platforms || PLATFORMS;
    if (/^[\p{L}\p{N}_.-]{1,160}$/u.test(loaded.project.content_id)) result.content_id = loaded.project.content_id;
    // Check fixed configuration paths before collect/check may follow them.
    for (const platform of targets) safePath(dir, `platforms/${platform}.json`);
    bundle = bundleAt(dir); result.bundle_version = bundle.bundle_version;
    try {
      for (const platform of targets) outputs(dir, bundle, platform);
      for (const item of bundle.outputs) safePath(dir, item.ref);
      const local = check(dir);
      result.local = { state: local.status === 'local_ready' ? 'local_ready' : 'stale', issue_codes: local.status === 'stale' ? ['BUNDLE_STALE'] : [], changed_inputs: local.changed_inputs.length,
        next_action: local.status === 'stale' ? '输入或渲染器已变化，重新构建后核验平台草稿。' : '本地产物校验通过；按各平台状态继续。' };
    } catch (error) { result.local.issue_codes = codeOf(error); }
  } catch (error) {
    result.local.issue_codes = codeOf(error);
    result.platforms = targets.map(platform => ({ ...initial(platform), state: 'blocked', issue_codes: [...result.local.issue_codes], next_action: result.local.next_action }));
    return result;
  }
  result.platforms = targets.map(platform => {
    let item: PlatformStatus;
    if (platform === 'wechat') item = wechatStatus(dir, bundle);
    else {
      try {
        const list = candidates(dir, platform);
        // Any attempt for the current bundle takes precedence over older evidence.
        const current = list.find(c => c.version === bundle.bundle_version), ordered = current ? [current, ...list.filter(c => c !== current)] : list;
        const records = ordered.map(c => browserStatus(dir, bundle, platform, c));
        item = records[0] || initial(platform);
        if (records.length > 1) item.historical = records.slice(1).map(r => ({ state: r.state, receipt: r.receipt, ...(r.checked_at ? { checked_at: r.checked_at } : {}), ...(r.evidence_scope ? { evidence_scope: r.evidence_scope } : {}) }));
      } catch (error) { item = invalid(initial(platform), error); }
    }
    if (result.local.state !== 'local_ready') {
      if (item.state === 'verified_current' || item.state === 'historical_verified') {
        item.historical = [{ state: item.state, receipt: { ...item.receipt }, ...(item.checked_at ? { checked_at: item.checked_at } : {}), ...(item.evidence_scope ? { evidence_scope: item.evidence_scope } : {}) }, ...(item.historical || [])];
        item = { ...item, state: 'stale_receipt', receipt: { ...item.receipt, relation: 'stale' }, next_action: result.local.next_action };
      } else if (item.state === 'not_started' || item.state === 'ready_for_browser') item = { ...item, state: 'blocked', next_action: result.local.next_action };
    }
    return item;
  });
  return result;
}

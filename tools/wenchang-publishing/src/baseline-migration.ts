import fs from 'node:fs';
import path from 'node:path';
import { check } from './build.js';
import { collect } from './project.js';
import { json, output, sha, stable } from './io.js';
import { readVerifiedBrowserBaseline } from './status.js';
import { RemotePreflightError } from './remote-preflight.js';
import { preflightZhihuBaseline, validateObservation } from './zhihu-sync.js';
import { preflightXhsBaseline, validateXhs } from './xhs-sync.js';

type BrowserPlatform = 'zhihu' | 'xiaohongshu';
const HASH = /^[a-f0-9]{64}$/;
const fail = (code: string): never => { throw new RemotePreflightError(code); };

// Only fixed paths inside the selected distribution are used for migration links.
// Reject symlinks in every component, including dangling ones, before reading.
function localFile(dir: string, relative: string): string {
  let cursor = dir;
  for (const part of relative.split('/')) {
    if (!part || part === '.' || part === '..' || /[\\:\0]/.test(part)) fail('UNSAFE_BASELINE_PATH');
    cursor = path.join(cursor, part);
    if (fs.lstatSync(cursor).isSymbolicLink()) fail('UNSAFE_BASELINE_PATH');
  }
  if (!fs.statSync(cursor).isFile() || fs.statSync(cursor).size > 20 * 1024 * 1024) fail('INVALID_BASELINE_FILE');
  return cursor;
}
function decode(bytes: Buffer): any {
  try { const v = JSON.parse(bytes.toString('utf8')); if (!v || typeof v !== 'object' || Array.isArray(v)) fail('INVALID_BASELINE_FILE'); return v; }
  catch { return fail('INVALID_BASELINE_FILE'); }
}
function read(file: string): any { return decode(fs.readFileSync(file)); }
function present(file: string): boolean {
  try { fs.lstatSync(file); return true; }
  catch (e) { if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e; return false; }
}
function current(directory: string, platform: BrowserPlatform) {
  const dir = path.resolve(directory);
  if (fs.lstatSync(dir).isSymbolicLink()) fail('UNSAFE_BASELINE_PATH');
  localFile(dir, 'project.json'); localFile(dir, 'bundle.json');
  if (check(dir).status !== 'local_ready') fail('BUNDLE_STALE');
  const data = collect(dir);
  if (!data.targets.includes(platform)) fail('PLATFORM_NOT_ENABLED');
  const base = `transfers/${platform}/${data.bundleVersion}`;
  const planBytes = fs.readFileSync(localFile(dir, `${base}/plan.json`)), plan = decode(planBytes);
  const state = read(localFile(dir, `${base}/status.json`)), planHash = sha(planBytes);
  if (plan.bundle_version !== data.bundleVersion || plan.source_hash !== data.sourceHash || plan.schema_version !== 1
    || plan.publication_performed !== false || state.publication_performed !== false
    || typeof state.attempt_id !== 'string' || !state.attempt_id.trim()
    || state.plan_hash !== planHash || sha(json(plan)) !== planHash) fail('MIGRATION_TARGET_PLAN_MISMATCH');
  // A verified target or uncertain save must never be turned back into an edit attempt.
  // prepare archives receipts: their absence at the root cannot erase a past success.
  if (state.status !== 'ready_for_browser' || present(path.join(dir, base, 'receipt.json'))
    || present(path.join(dir, base, 'history'))) fail('MIGRATION_TARGET_NOT_READY');
  return { dir, data, base, plan, planHash, attemptId: state.attempt_id as string };
}
function context(directory: string, platform: BrowserPlatform, version: string) {
  if (!HASH.test(version)) fail('INVALID_BUNDLE_VERSION');
  const target = current(directory, platform);
  if (version === target.data.bundleVersion) fail('BASELINE_MIGRATION_NOT_NEEDED');
  const source = readVerifiedBrowserBaseline(target.dir, platform, version);
  if (source.bundle.content_id !== target.data.project.content_id) fail('BASELINE_CONTENT_MISMATCH');
  if (source.plan.account !== target.plan.account) fail('ACCOUNT_MISMATCH');
  if (platform === 'zhihu' && source.plan.draft_url !== target.plan.draft_url) fail('DRAFT_OR_ACCOUNT_MISMATCH');
  if (platform === 'xiaohongshu' && source.scope !== 'chrome') fail('CHROME_BASELINE_REQUIRED');
  const binding = { schema_version: 1, platform, content_id: source.bundle.content_id,
    source_bundle_version: version, source_plan_hash: source.plan_hash,
    source_evidence_sha256: source.evidence_sha256, source_receipt_sha256: source.receipt_sha256,
    evidence_scope: source.scope, target_bundle_version: target.data.bundleVersion, target_plan_hash: target.planHash,
    target_attempt_id: target.attemptId,
    publication_performed: false };
  return { ...target, source, binding };
}
type Context = ReturnType<typeof context>;

function freshPreflight(c: Context, platform: BrowserPlatform, file: string) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.size > 20 * 1024 * 1024) fail('INVALID_BASELINE_FILE');
  const bytes = fs.readFileSync(file), envelope = decode(bytes), time = Date.parse(envelope.checked_at), now = Date.now();
  if (envelope.independent_reopen !== true || typeof envelope.checked_at !== 'string' || !Number.isFinite(time) || time < Date.parse(c.source.evidence.checked_at)
    || now - time > 5 * 60_000 || time > now + 5_000) fail('FRESH_EVIDENCE_REQUIRED');
  if (envelope.status && envelope.status !== 'draft_verified' || envelope.code) fail('REMOTE_OBSERVATION_INVALID');
  if (platform === 'xiaohongshu' && (envelope.browser !== 'chrome' || envelope.reopened_from_list !== true
    || envelope.saved_in_list !== true || envelope.visual_order_verified !== true || envelope.draft_match_count !== 1)) fail('ORIGINAL_CHROME_DRAFT_REQUIRED');
  const o = envelope.observation;
  const fields = platform === 'zhihu' ? ['url', 'account', 'title', 'text'] : ['account', 'title', 'description'];
  if (!o || fields.some(k => typeof o[k] !== 'string') || !Array.isArray(o.images)
    || o.images.some((im: any) => !im || typeof im.src !== 'string' || typeof im.complete !== 'boolean'
      || !Number.isFinite(im.width) || !Number.isFinite(im.height))
    || o.topics !== undefined && (!Array.isArray(o.topics) || o.topics.some((t: any) => !t || typeof t.name !== 'string' || typeof t.id !== 'string'))) fail('REMOTE_OBSERVATION_INVALID');
  const baseline = c.source.evidence.reopened;
  if (platform === 'zhihu' && ['saved', 'busy', 'failed'].some(key => typeof o[key] !== 'boolean')) fail('REMOTE_OBSERVATION_INVALID');
  if (o.busy || o.failed || o.saved === false) fail('REMOTE_DRAFT_NOT_READY');
  if (platform === 'zhihu') {
    preflightZhihuBaseline(c.plan, baseline, o);
    validateObservation(c.source.plan, o);
  } else {
    preflightXhsBaseline(c.plan, baseline, o);
    validateXhs(c.source.plan, o, true);
    if (new Set(o.images.map((im: { src: string }) => im.src)).size !== o.images.length) fail('DUPLICATE_IMAGE_SOURCE');
  }
  return { checked_at: envelope.checked_at as string, observation_sha256: sha(bytes) };
}
function recordFile(c: Context): string { return output(c.data.root, path.join(c.dir, c.base, 'baseline-migration.json')); }
function requireRecord(c: Context, record: any) {
  const expected = { ...c.binding, status: 'baseline_linked', migration_id: sha(json(c.binding)) };
  if (Object.keys(expected).some(key => stable(record[key]) !== stable(expected[key as keyof typeof expected]))
    || !Number.isFinite(Date.parse(record.checked_at)) || !HASH.test(record.observation_sha256)) fail('BASELINE_MIGRATION_MISMATCH');
}

/** Offline-only link. Never rewrites evidence, receipts, status, or any remote draft. */
export function migrateBaseline(directory: string, platform: BrowserPlatform, sourceVersion: string, observationFile: string) {
  const c = context(directory, platform, sourceVersion), fresh = freshPreflight(c, platform, observationFile);
  const file = recordFile(c);
  if (present(file)) {
    const record = read(localFile(c.dir, `${c.base}/baseline-migration.json`)); requireRecord(c, record);
    return { ...record, reused: true };
  }
  const record = { ...c.binding, status: 'baseline_linked', migration_id: sha(json(c.binding)), ...fresh };
  // Exclusive creation: existing links are immutable; a partial interrupted file fails closed.
  fs.writeFileSync(file, json(record), { flag: 'wx', mode: 0o600 });
  return { ...record, reused: false };
}

/** Revalidate the entire old/new chain and a fresh read on every pre-edit use. */
export function readMigratedBaseline(directory: string, platform: BrowserPlatform, observationFile: string) {
  const target = current(directory, platform);
  const record = read(localFile(target.dir, `${target.base}/baseline-migration.json`));
  const c = context(directory, platform, record.source_bundle_version); requireRecord(c, record);
  freshPreflight(c, platform, observationFile);
  return { status: 'remote_unchanged' as const, changed_fields: [], migration_id: record.migration_id as string,
    target_plan_hash: c.planHash, baseline: c.source.evidence.reopened,
    requires_save_and_reopen: true, publication_performed: false };
}

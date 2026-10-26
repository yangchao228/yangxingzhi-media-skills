import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { check } from './build.js';
import { collect } from './project.js';
import { atomic, input, json, output, readJson, ref, sha, TOOL_ROOT } from './io.js';
import { article, markdown, scan } from './render.js';
import { archiveReceipt, newAttempt, readTransferState, recoveryAction, writeTransferState, type TransferState } from './transfer-state.js';
import { assertFreshObservation, RemotePreflightError, stableRemoteImageSource } from './remote-preflight.js';
import type { ArticleConfig } from './model.js';

export const normalizeText = (s: string) => s.normalize('NFC').replace(/\s+/gu, '');
export function draftUrl(value: string) {
  if (!/^https:\/\/zhuanlan\.zhihu\.com\/p\/\d+\/edit$/.test(value)) throw new Error('ZHIHU_DRAFT_URL_REQUIRED');
  return value;
}
interface Mapping { mode: string; dry_run: boolean; assets: { local_path: string; sha256: string; bytes: number; url: string; status: string }[]; missing_files: unknown[]; upload_failed: unknown[] }
export interface ZhihuPlan {
  schema_version: 1; bundle_version: string; source_hash: string; draft_url: string; account: string;
  title: string; html: string; expected_text: string;
  images: { source_ref: string; sha256: string; width: number; height: number; r2_url: string }[];
  publication_performed: false;
}
function current(directory: string) {
  if (check(directory).status !== 'local_ready') throw new Error('BUNDLE_STALE');
  const data = collect(directory);
  if (!data.targets.includes('zhihu')) throw new Error('ZHIHU_NOT_ENABLED');
  return data;
}
export function resolveMap(mapping: Mapping, base: string, files: Map<string, { sha256: string; bytes: number }>) {
  if (mapping.mode !== 'upload-only' || mapping.dry_run || mapping.missing_files.length || mapping.upload_failed.length) throw new Error('R2_MAP_NOT_UPLOADED');
  const urls = new Map<string, string>();
  for (const a of mapping.assets) {
    const absolute = path.resolve(base, a.local_path), expected = files.get(absolute);
    if (!expected || a.status !== 'uploaded' || a.sha256 !== expected.sha256 || a.bytes !== expected.bytes || urls.has(absolute)) throw new Error('R2_MAP_MISMATCH');
    const u = new URL(a.url);
    if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash) throw new Error('R2_PUBLIC_URL_REQUIRED');
    urls.set(absolute, u.href);
  }
  if (urls.size !== files.size) throw new Error('R2_MAP_INCOMPLETE');
  return urls;
}
export function sourceText(source: string) {
  const tokens = markdown().parse(source, {});
  if (tokens[0]?.type === 'heading_open' && tokens[0].tag === 'h1') tokens.splice(0, 3);
  const parts: string[] = [];
  const visit = (ts: any[]) => { for (const t of ts) {
    if (t.type === 'image') continue;
    if (t.children) visit(t.children);
    else if (['text', 'code_inline', 'code_block', 'fence', 'html_inline'].includes(t.type)) parts.push(t.content);
  }};
  visit(tokens); return normalizeText(parts.join(''));
}
export function prepareZhihu(directory: string, options: { draft: string; account: string; envFile?: string; mapFile?: string }) {
  draftUrl(options.draft);
  if (!options.account.trim()) throw new Error('ACCOUNT_REQUIRED');
  const data = current(directory);
  const transfer = output(data.root, path.join(data.dir, 'transfers', 'zhihu', data.bundleVersion));
  fs.mkdirSync(transfer, { recursive: true });
  const lock = output(data.root, path.join(transfer, '.prepare.lock'));
  const fd = fs.openSync(lock, 'wx');
  const attempt = newAttempt();
  try {
    const priorPlanPath = path.join(transfer, 'plan.json');
    if (fs.existsSync(priorPlanPath)) {
      const prior = readJson<ZhihuPlan>(priorPlanPath);
      if (prior.draft_url !== options.draft || prior.account !== options.account) throw new Error('EXISTING_PLAN_TARGET_MISMATCH');
    }
    // A new prepare is a new attempt. Preserve an earlier successful receipt as history.
    archiveReceipt(transfer, path.join(transfer, 'receipt.json'));
    writeTransferState(path.join(transfer, 'status.json'), { status: 'preparing', ...attempt });
    const sourceFile = input(data.root, data.dir, data.project.source_ref);
    const files = new Map([...data.bodyImages.values()].map(a => [data.assetFiles.get(a.source_ref)!, a]));
    const manifest = path.join(transfer, 'upload-input.md');
    // Generated resource list only: never pass the editable article to a rewriting uploader.
    atomic(output(data.root, manifest), [...files.keys()].map((f, i) => `![asset-${i + 1}](<${ref(transfer, f)}>)`).join('\n') + '\n');
    const mapFile = options.mapFile ? path.resolve(options.mapFile) : manifest + '.asset-map.json';
    let mapping: Mapping;
    const base = options.mapFile ? path.dirname(sourceFile) : transfer;
    if (options.mapFile || fs.existsSync(mapFile)) {
      mapping = readJson<Mapping>(mapFile);
      resolveMap(mapping, base, files); // Bad or partial maps require explicit diagnosis; no blind retry.
    } else {
      if (!options.envFile) throw new Error('R2_ENV_FILE_REQUIRED');
      const script = path.resolve(TOOL_ROOT, '../../md-img-r2/scripts/md_img_r2.py');
      const run = spawnSync('python3', ['-B', script, manifest, '--upload-only', '--env-file', path.resolve(options.envFile), '--key-prefix', `wenchang/${data.project.content_id}`], { encoding: 'utf8', timeout: 300000 });
      if (run.error || run.status !== 0) throw new Error('R2_UPLOAD_FAILED_CHECK_LOCAL_MAP');
      mapping = readJson<Mapping>(mapFile);
    }
    const urls = resolveMap(mapping, base, files);
    if (current(directory).bundleVersion !== data.bundleVersion) throw new Error('INPUT_CHANGED_DURING_UPLOAD');
    const replacements = new Map([...data.bodyImages].map(([r, a]) => [r, urls.get(data.assetFiles.get(a.source_ref)!)!]));
    const images = scan(data.source).images.map(r => {
      const a = data.bodyImages.get(r)!;
      return { source_ref: a.source_ref, sha256: a.sha256, width: a.width, height: a.height, r2_url: replacements.get(r)! };
    });
    const plan: ZhihuPlan = { schema_version: 1, bundle_version: data.bundleVersion, source_hash: data.sourceHash,
      draft_url: options.draft, account: options.account, title: (data.configs.zhihu as ArticleConfig).title,
      html: article(data.source, 'zhihu', replacements), expected_text: sourceText(data.source), images, publication_performed: false };
    atomic(output(data.root, path.join(transfer, 'r2-map.json')), json({ bundle_version: data.bundleVersion, source_hash: data.sourceHash, images }));
    atomic(output(data.root, path.join(transfer, 'article.fragment.html')), plan.html);
    atomic(output(data.root, path.join(transfer, 'plan.json')), json(plan));
    writeTransferState(path.join(transfer, 'status.json'), { status: 'ready_for_browser', bundle_version: data.bundleVersion, plan_hash: sha(json(plan)), ...attempt });
    return { status: 'ready_for_browser', plan: path.join(transfer, 'plan.json'), plan_hash: sha(json(plan)), images: images.length, draft_url: plan.draft_url, publication_performed: false };
  } catch (e) {
    const code = e instanceof Error && /^[A-Z][A-Z0-9_]{0,80}$/.test(e.message) ? e.message : 'PREPARE_FAILED';
    writeTransferState(path.join(transfer, 'status.json'), { status: 'blocked', last_error_code: code, recovery_action: recoveryAction(code), ...attempt });
    throw e;
  } finally { fs.closeSync(fd); if (fs.existsSync(lock)) fs.unlinkSync(lock); }
}

export interface Observation {
  url: string; account: string; title: string; text: string; saved: boolean; busy: boolean; failed: boolean;
  images: { src: string; complete: boolean; width: number; height: number }[];
}
export function validateObservation(plan: ZhihuPlan, o: Observation) {
  if (o.url !== plan.draft_url || o.account !== plan.account) throw new Error('DRAFT_OR_ACCOUNT_MISMATCH');
  if (o.title !== plan.title || normalizeText(o.text) !== plan.expected_text) throw new Error('TITLE_OR_BODY_MISMATCH');
  if (o.failed) throw new Error('IMAGE_TRANSFER_FAILED');
  if (!o.saved || o.busy) throw new Error('DRAFT_NOT_SAVED');
  if (o.images.length !== plan.images.length) throw new Error('IMAGE_COUNT_MISMATCH');
  o.images.forEach((image, index) => {
    const u = new URL(image.src), a = plan.images[index];
    if (u.protocol !== 'https:' || !(u.hostname === 'pic-private.zhihu.com' || u.hostname.endsWith('.zhimg.com')) || u.search || u.hash) throw new Error('IMAGE_NOT_TRANSFERRED');
    if (!image.complete || image.width <= 0 || image.height <= 0 || Math.abs(image.width / image.height - a.width / a.height) > 0.015) throw new Error('IMAGE_LOAD_OR_DIMENSIONS_FAILED');
  });
}

/** Compare the last accepted remote draft with the fresh read taken immediately before editing. */
export function compareZhihuBaseline(baseline: Observation, current: Observation): string[] {
  const changed: string[] = [];
  if (baseline.url !== current.url) changed.push('url');
  if (baseline.account !== current.account) changed.push('account');
  if (baseline.title !== current.title) changed.push('title');
  if (normalizeText(baseline.text) !== normalizeText(current.text)) changed.push('body');
  if (baseline.images.length !== current.images.length) changed.push('images.count');
  const count = Math.min(baseline.images.length, current.images.length);
  for (let i = 0; i < count; i++) {
    const a = baseline.images[i], b = current.images[i];
    if (stableRemoteImageSource(a.src) !== stableRemoteImageSource(b.src)) changed.push(`images[${i}].src`);
    if (a.width !== b.width || a.height !== b.height) changed.push(`images[${i}].dimensions`);
  }
  return changed;
}

export function preflightZhihuBaseline(plan: ZhihuPlan, baseline: Observation | undefined, current: Observation): { status: 'remote_unchanged'; changed_fields: [] } {
  if (!baseline) throw new RemotePreflightError('BASELINE_REQUIRED');
  if (current.url !== plan.draft_url || current.account !== plan.account || baseline.url !== plan.draft_url || baseline.account !== plan.account) {
    throw new RemotePreflightError('DRAFT_OR_ACCOUNT_MISMATCH');
  }
  assertFreshObservation(current);
  const changed = compareZhihuBaseline(baseline, current);
  if (changed.length) throw new RemotePreflightError('REMOTE_BASELINE_CHANGED', changed);
  return { status: 'remote_unchanged', changed_fields: [] };
}
export function verifyZhihu(directory: string, evidenceFile: string) {
  const data = current(directory);
  const transfer = path.join(data.dir, 'transfers', 'zhihu', data.bundleVersion);
  const statusFile = path.join(transfer, 'status.json');
  const existing: TransferState = readTransferState(statusFile) || { ...newAttempt(), status: 'ready_for_browser', publication_performed: false };
  let plan: ZhihuPlan | undefined;
  let planHash: string | undefined;
  try {
    plan = readJson<ZhihuPlan>(input(data.root, transfer, 'plan.json'));
    planHash = sha(json(plan));
    writeTransferState(statusFile, { ...existing, status: 'verifying', plan_hash: planHash });
    if (plan.bundle_version !== data.bundleVersion || plan.source_hash !== data.sourceHash) throw new Error('PLAN_STALE');
    const evidence = readJson<{ plan_hash: string; imported: Observation; reopened: Observation; independent_reopen: boolean; checked_at: string; code?: string; status?: string }>(evidenceFile);
    if ((evidence.code === 'WAIT_TIMEOUT' || evidence.code === 'SAVE_PENDING_READBACK') || (evidence.status && evidence.status !== 'draft_verified')) throw new Error(evidence.code || 'SAVE_PENDING_READBACK');
    if (existing.last_error_code === 'WAIT_TIMEOUT' || existing.last_error_code === 'SAVE_PENDING_READBACK') {
      if (!evidence.checked_at || Date.parse(evidence.checked_at) <= Date.parse(existing.updated_at)) throw new Error('FRESH_EVIDENCE_REQUIRED');
    }
    if (evidence.plan_hash !== planHash || evidence.independent_reopen !== true) throw new Error('EVIDENCE_PLAN_OR_REOPEN_MISMATCH');
    validateObservation(plan, evidence.imported); validateObservation(plan, evidence.reopened);
    if (evidence.imported.images.some((im, i) => im.src !== evidence.reopened.images[i].src)) throw new Error('REOPEN_IMAGE_IDENTITY_MISMATCH');
    const receipt = { status: 'draft_verified', bundle_version: data.bundleVersion, source_hash: data.sourceHash, draft_url: plan.draft_url,
      account: plan.account, checked_at: evidence.checked_at, evidence_sha256: sha(fs.readFileSync(evidenceFile)), images: evidence.reopened.images,
      validation: ['title', 'normalized_body', 'image_count_order', 'platform_host', 'loaded_dimensions', 'saved', 'independent_reopen'],
      visual_review: 'separate_screenshot_review_required', publication_performed: false,
      attempt_id: existing.attempt_id, started_at: existing.started_at, updated_at: new Date().toISOString(), plan_hash: planHash };
    atomic(output(data.root, path.join(transfer, 'receipt.json')), json(receipt));
    writeTransferState(statusFile, { ...existing, status: 'draft_verified', checked_at: receipt.checked_at, plan_hash: planHash });
    return receipt;
  } catch (e) {
    const code = e instanceof Error && /^[A-Z][A-Z0-9_]{0,80}$/.test(e.message) ? e.message : 'VERIFY_FAILED';
    writeTransferState(statusFile, { ...existing, status: 'blocked', ...(planHash ? { plan_hash: planHash } : {}), last_error_code: code, recovery_action: recoveryAction(code) });
    throw e;
  }
}

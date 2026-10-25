import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRuntimeFixture } from './runtime-fixture.mjs';
// An alternate compiled directory lets this suite run without touching shared dist.
const dist = process.env.WENCHANG_STATUS_TEST_DIST || fileURLToPath(new URL('../dist/', import.meta.url));
const fromDist = name => import(pathToFileURL(path.join(dist, name)).href);
const { init, collect } = await fromDist('project.js');
const { build } = await fromDist('build.js');
const { publishingStatus } = await fromDist('status.js');
const { sha, json } = await fromDist('io.js');
const { sourceText } = await fromDist('zhihu-sync.js');
const draft = 'https://zhuanlan.zhihu.com/p/123/edit';
const checked = '2026-10-25T03:00:00.000Z';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, json(value)); };
const edit = (file, fn) => { const v = read(file); fn(v); write(file, v); };
const one = (result, platform = 'zhihu') => result.platforms.find(p => p.platform === platform);
function setup(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'wenchang-status-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = createRuntimeFixture(root);
  const dir = path.join(root, 'distribution');
  init({ workspace: root, out: dir, source: fixture.source, metadata: fixture.metadata });
  const { bundle } = build(dir);
  return { root, dir, bundle, source: fixture.source };
}
function proof(dir, platform = 'zhihu', version) {
  const bundle = version ? read(path.join(dir, 'builds', version, 'bundle.json')) : read(path.join(dir, 'bundle.json'));
  const d = collect(dir), base = path.join(dir, 'transfers', platform, bundle.bundle_version);
  const images = (platform === 'zhihu' ? [...d.bodyImages.values()] : d.cards).map((a, i) => {
    const image = { source_ref: a.source_ref, sha256: a.sha256, width: a.width, height: a.height };
    if (platform === 'xiaohongshu') {
      image.upload_file = `upload/${i}.png`; write(path.join(base, image.upload_file), 'placeholder');
      fs.copyFileSync(d.assetFiles.get(a.source_ref), path.join(base, image.upload_file));
    }
    return image;
  });
  const plan = { schema_version: 1, bundle_version: bundle.bundle_version, source_hash: bundle.source_hash,
    account: 'test', title: platform === 'zhihu' ? d.configs.zhihu.title : d.configs.xiaohongshu.post_title,
    ...(platform === 'zhihu' ? { draft_url: draft, expected_text: sourceText(d.source), html: '<p>body</p>' } : { description: d.configs.xiaohongshu.description, tags: [] }),
    images, publication_performed: false };
  const observed = { account: plan.account, title: plan.title,
    ...(platform === 'zhihu' ? { url: draft, text: plan.expected_text, saved: true, busy: false, failed: false } : { description: plan.description }),
    images: images.map((a, i) => ({ src: platform === 'zhihu' ? `https://pic-private.zhihu.com/${i}.png` : `https://sns.xhscdn.com/${i}.png`, complete: true, width: a.width, height: a.height })) };
  const evidence = { plan_hash: sha(json(plan)), independent_reopen: true, checked_at: checked,
    ...(platform === 'zhihu' ? { imported: observed } : { uploaded: observed, saved_in_list: true, reopened_from_list: true, visual_order_verified: true }), reopened: structuredClone(observed) };
  const receipt = { status: 'draft_verified', bundle_version: bundle.bundle_version, account: plan.account,
    ...(platform === 'zhihu' ? { source_hash: bundle.source_hash, draft_url: draft } : { title: plan.title }),
    checked_at: checked, evidence_sha256: sha(json(evidence)), images: observed.images, publication_performed: false };
  write(path.join(base, 'plan.json'), plan); write(path.join(base, 'evidence.json'), evidence);
  write(path.join(base, 'receipt.json'), receipt); write(path.join(base, 'status.json'), { status: 'draft_verified', checked_at: checked });
  return { base, plan, evidence, receipt };
}
function wechatProof(dir) {
  const b = read(path.join(dir, 'bundle.json'));
  write(path.join(dir, 'wechat-sync-receipt.json'), { status: 'draft_verified', bundle_version: b.bundle_version,
    source_hash: b.source_hash, content_id: b.content_id, checked_at: checked, publication_performed: false,
    media_id: 'secret-media-id', account_name_supplied: 'secret-account', account_identity_verified: true, visual_review: 'passed',
    validation: { title: true, digest: true, author: true, text: true, cover: true, images: true, body_image_count: 2 } });
}

test('no receipt is not_started; status performs no writes', t => {
  const { dir } = setup(t);
  const snapshot = () => {
    const list = [];
    const visit = p => { for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
      const file = path.join(p, entry.name), stat = fs.statSync(file);
      if (entry.isDirectory()) visit(file); else list.push([path.relative(dir, file), sha(fs.readFileSync(file)), stat.mtimeMs]);
    } }; visit(dir); return list;
  };
  const before = snapshot(), result = publishingStatus(dir);
  assert.equal(result.local.state, 'local_ready');
  assert.ok(result.platforms.every(p => p.state === 'not_started'));
  assert.deepEqual(snapshot(), before);
});
test('current verified browser receipts bind actual evidence and plan', t => {
  const { dir } = setup(t); proof(dir); proof(dir, 'xiaohongshu');
  const status = publishingStatus(dir);
  assert.equal(one(status).state, 'verified_current');
  assert.equal(one(status, 'xiaohongshu').state, 'verified_current');
  assert.equal(one(status, 'xiaohongshu').draft_storage, 'browser_local');
  assert.deepEqual(one(status, 'xiaohongshu').review_pending, ['browser_restart_persistence']);
});
test('wechat API readback retains identity and visual review requirements and hides identifiers', t => {
  const { dir } = setup(t); wechatProof(dir);
  const status = publishingStatus(dir), w = one(status, 'wechat');
  assert.equal(w.state, 'verified_current'); assert.equal(w.api_readback_verified, true);
  assert.equal(w.account_identity_verified, false); assert.equal(w.visual_review, 'pending');
  assert.doesNotMatch(JSON.stringify(status), /secret-media-id|secret-account/);
});
test('wechat update conflicts and pending recovery remain actionable without leaking remote data', t => {
  const { dir } = setup(t); wechatProof(dir);
  const file = path.join(dir, 'wechat-sync-receipt.json');
  edit(file, value => { value.status = 'remote_conflict'; value.operation = 'update'; value.code = 'REMOTE_CONFLICT_DRAFT_PRESERVED'; value.conflict_fields = ['content', 'cover_info', 'https://private.example/token']; value.raw_remote = 'private body'; });
  let result = publishingStatus(dir), item = one(result, 'wechat');
  assert.equal(item.state, 'blocked'); assert.equal(item.operation, 'update');
  assert.deepEqual(item.conflict_fields, ['content', 'cover_info']);
  assert.deepEqual(item.issue_codes, ['REMOTE_CONFLICT_DRAFT_PRESERVED']);
  assert.doesNotMatch(JSON.stringify(result), /private\.example|private body|secret-account/);
  edit(file, value => { value.status = 'update_pending'; value.code = 'UPDATE_PENDING_RECONCILIATION_REQUIRED'; });
  item = one(publishingStatus(dir), 'wechat');
  assert.equal(item.state, 'blocked'); assert.match(item.next_action, /对账/);
});
test('prior bundle is historical_verified only when source, platform inputs and output hashes match', t => {
  const { dir, bundle } = setup(t); proof(dir); wechatProof(dir);
  edit(path.join(dir, 'platforms/xiaohongshu.json'), v => { v.tags = ['new']; }); build(dir);
  const status = publishingStatus(dir);
  assert.notEqual(status.bundle_version, bundle.bundle_version);
  assert.equal(one(status).state, 'historical_verified');
  assert.equal(one(status).receipt.relation, 'historical_equivalent');
  assert.equal(one(status, 'wechat').state, 'historical_verified');
  assert.equal(read(path.join(dir, 'transfers/zhihu', bundle.bundle_version, 'receipt.json')).bundle_version, bundle.bundle_version);
});
test('source change preserves history but cannot claim current validation', t => {
  const { dir, source } = setup(t); proof(dir); fs.appendFileSync(source, '\nnew body\n');
  let status = publishingStatus(dir);
  assert.equal(status.local.state, 'stale'); assert.equal(one(status).state, 'stale_receipt');
  assert.equal(one(status).historical[0].state, 'verified_current');
  build(dir); status = publishingStatus(dir);
  assert.equal(status.local.state, 'local_ready'); assert.equal(one(status).state, 'stale_receipt');
});
test('platform input change prevents historical equivalence after rebuilding', t => {
  const { dir } = setup(t); proof(dir);
  edit(path.join(dir, 'platforms/zhihu.json'), v => { v.title += ' changed'; }); build(dir);
  assert.equal(one(publishingStatus(dir)).state, 'stale_receipt');
});
test('different content identity cannot inherit an otherwise equivalent historical receipt', t => {
  const { dir } = setup(t); proof(dir);
  edit(path.join(dir, 'project.json'), v => { v.content_id = 'different-article'; }); build(dir);
  assert.equal(one(publishingStatus(dir)).state, 'stale_receipt');
});
test('tampered historical rendered bytes invalidate evidence even with matching inputs', t => {
  const { dir, bundle } = setup(t); proof(dir);
  edit(path.join(dir, 'platforms/xiaohongshu.json'), v => { v.tags = ['new']; }); build(dir);
  fs.appendFileSync(path.join(dir, bundle.platforms.zhihu.preview), 'tampered');
  const status = publishingStatus(dir);
  assert.equal(status.local.state, 'blocked');
  assert.equal(one(status).state, 'invalid_evidence');
});
test('different valid historical output hash set is stale rather than equivalent', t => {
  const { dir, bundle } = setup(t), oldVersion = 'a'.repeat(64), renderVersion = 'b'.repeat(64);
  const old = structuredClone(bundle), p = old.platforms.zhihu, prefix = `renders/zhihu/${renderVersion}/`;
  fs.cpSync(path.join(dir, 'renders/zhihu', p.version), path.join(dir, 'renders/zhihu', renderVersion), { recursive: true });
  const priorPrefix = `renders/zhihu/${p.version}/`; p.version = renderVersion;
  for (const f of p.outputs) f.ref = f.ref.replace(priorPrefix, prefix);
  p.preview = p.preview.replace(priorPrefix, prefix); p.fragment = p.fragment.replace(priorPrefix, prefix);
  const output = p.outputs[0]; fs.appendFileSync(path.join(dir, output.ref), 'different');
  output.sha256 = sha(fs.readFileSync(path.join(dir, output.ref))); output.bytes = fs.statSync(path.join(dir, output.ref)).size;
  old.bundle_version = oldVersion; write(path.join(dir, 'builds', oldVersion, 'bundle.json'), old); proof(dir, 'zhihu', oldVersion);
  assert.equal(one(publishingStatus(dir)).state, 'stale_receipt');
});
test('latest blocked status takes precedence over old successful receipt', t => {
  const { dir, bundle } = setup(t); proof(dir);
  edit(path.join(dir, 'platforms/xiaohongshu.json'), v => { v.tags = ['new']; }); const { bundle: current } = build(dir);
  write(path.join(dir, 'transfers/zhihu', current.bundle_version, 'status.json'), { status: 'blocked', code: 'MANUAL_REVIEW_REQUIRED', token: 'must-not-leak' });
  const status = one(publishingStatus(dir));
  assert.equal(status.state, 'blocked'); assert.equal(status.historical[0].receipt.bundle_version, bundle.bundle_version);
  assert.equal(status.historical[0].state, 'historical_verified'); assert.doesNotMatch(JSON.stringify(status), /must-not-leak/);
});
test('blocked status within the same attempt overrides a previous receipt', t => {
  const { dir } = setup(t), { base } = proof(dir);
  write(path.join(base, 'status.json'), { status: 'verifying' });
  assert.equal(one(publishingStatus(dir)).state, 'blocked');
});
test('prepared browser state requires a current matching plan', t => {
  const { dir } = setup(t), { base } = proof(dir);
  fs.unlinkSync(path.join(base, 'receipt.json')); write(path.join(base, 'status.json'), { status: 'ready_for_browser' });
  assert.equal(one(publishingStatus(dir)).state, 'ready_for_browser');
  edit(path.join(base, 'plan.json'), v => { v.source_hash = '0'.repeat(64); });
  assert.equal(one(publishingStatus(dir)).state, 'invalid_evidence');
});
test('tampered evidence and changed plan fail closed and never expose signed URLs', t => {
  const { dir } = setup(t), { base } = proof(dir);
  edit(path.join(base, 'evidence.json'), v => { v.reopened.images[0].src = 'https://example.com/image?token=do-not-leak'; });
  let status = publishingStatus(dir); assert.equal(one(status).state, 'invalid_evidence');
  assert.doesNotMatch(JSON.stringify(status), /do-not-leak|example\.com/);
  const { base: base2 } = proof(dir); edit(path.join(base2, 'plan.json'), v => { v.title += ' changed'; });
  status = publishingStatus(dir); assert.equal(one(status).state, 'invalid_evidence');
});
test('plan byte changes invalidate evidence even when parsed JSON remains identical', t => {
  const { dir } = setup(t), { base } = proof(dir);
  fs.appendFileSync(path.join(base, 'plan.json'), '\n');
  const status = one(publishingStatus(dir));
  assert.equal(status.state, 'invalid_evidence'); assert.ok(status.issue_codes.includes('EVIDENCE_PLAN_MISMATCH'));
});
test('root receipt resolves a newer Chrome evidence hash while old default evidence remains unchanged', t => {
  const { dir } = setup(t), { base, evidence, receipt } = proof(dir, 'xiaohongshu');
  const oldBytes = fs.readFileSync(path.join(base, 'evidence.json'));
  const chromeEvidence = { ...evidence, checked_at: '2026-10-25T05:00:00.000Z', browser: 'chrome' };
  write(path.join(base, 'chrome/evidence.json'), chromeEvidence);
  write(path.join(base, 'receipt.json'), { ...receipt, checked_at: chromeEvidence.checked_at, evidence_sha256: sha(json(chromeEvidence)) });
  const status = one(publishingStatus(dir), 'xiaohongshu');
  assert.equal(status.state, 'verified_current'); assert.equal(status.evidence_scope, 'chrome');
  assert.ok(status.issue_codes.includes('EVIDENCE_SCOPED_CHROME'));
  assert.deepEqual(fs.readFileSync(path.join(base, 'evidence.json')), oldBytes);
});
test('scoped Chrome evidence rejects symlink directories and does not trust an unmatched hash', t => {
  const { dir, root } = setup(t), { base, evidence, receipt } = proof(dir, 'xiaohongshu');
  const chromeEvidence = { ...evidence, checked_at: '2026-10-25T05:00:00.000Z' }, external = path.join(root, 'private-browser');
  write(path.join(external, 'evidence.json'), chromeEvidence);
  write(path.join(base, 'receipt.json'), { ...receipt, checked_at: chromeEvidence.checked_at, evidence_sha256: sha(json(chromeEvidence)) });
  fs.symlinkSync(external, path.join(base, 'chrome'));
  let status = one(publishingStatus(dir), 'xiaohongshu');
  assert.equal(status.state, 'invalid_evidence'); assert.ok(status.issue_codes.includes('UNSAFE_STATUS_PATH'));
  fs.unlinkSync(path.join(base, 'chrome'));
  write(path.join(base, 'chrome/evidence.json'), { ...chromeEvidence, checked_at: '2026-10-25T06:00:00.000Z' });
  status = one(publishingStatus(dir), 'xiaohongshu');
  assert.equal(status.state, 'invalid_evidence'); assert.ok(status.issue_codes.includes('EVIDENCE_HASH_MISMATCH'));
});
test('missing evidence, malformed JSON, transfer symlinks and escaped outputs are diagnostic', t => {
  const { dir, root } = setup(t), { base } = proof(dir);
  fs.unlinkSync(path.join(base, 'evidence.json')); assert.equal(one(publishingStatus(dir)).state, 'invalid_evidence');
  proof(dir); fs.writeFileSync(path.join(base, 'receipt.json'), '{'); assert.equal(one(publishingStatus(dir)).state, 'invalid_evidence');
  fs.rmSync(base, { recursive: true }); fs.symlinkSync(path.join(root, 'source'), base);
  assert.equal(one(publishingStatus(dir)).state, 'invalid_evidence');
  edit(path.join(dir, 'bundle.json'), v => { v.platforms.zhihu.outputs[0].ref = '../source/body.md'; });
  const status = publishingStatus(dir); assert.equal(status.local.state, 'blocked');
  assert.ok(status.local.issue_codes.includes('UNSAFE_OUTPUT_REFERENCE'));
});
test('check exceptions preserve diagnostic local state and safe receipt history', t => {
  const { dir, source } = setup(t); proof(dir); fs.appendFileSync(source, '\n![missing](missing.png)');
  const status = publishingStatus(dir);
  assert.equal(status.local.state, 'blocked'); assert.ok(status.local.issue_codes.includes('FILE_MISSING'));
  assert.equal(one(status).state, 'stale_receipt'); assert.equal(one(status).historical[0].state, 'verified_current');
});
test('missing distribution or project is reported without throwing', t => {
  const { root, dir } = setup(t);
  assert.equal(publishingStatus(path.join(root, 'missing')).local.state, 'blocked');
  fs.unlinkSync(path.join(dir, 'project.json'));
  assert.equal(publishingStatus(dir).local.state, 'blocked');
});

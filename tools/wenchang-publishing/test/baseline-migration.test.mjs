import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createRuntimeFixture } from './runtime-fixture.mjs';
import { init, collect } from '../dist/project.js';
import { build } from '../dist/build.js';
import { json, sha } from '../dist/io.js';
import { prepareZhihu, verifyZhihu } from '../dist/zhihu-sync.js';
import { prepareXhs, verifyXhs } from '../dist/xhs-sync.js';
import { publishingStatus } from '../dist/status.js';
import { readEvidenceObservation } from '../dist/remote-preflight.js';
import { migrateBaseline, readMigratedBaseline } from '../dist/baseline-migration.js';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, json(value));
function snapshot(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(e => {
    const f = path.join(dir, e.name);
    return e.isDirectory() ? snapshot(f).map(([r, ...rest]) => [e.name + '/' + r, ...rest])
      : [[e.name, sha(fs.readFileSync(f)), fs.statSync(f).mtimeMs]];
  });
}
function observation(platform, p, prefix = 'old') {
  const images = p.images.map((im, i) => ({ src: platform === 'zhihu'
    ? `https://pic-private.zhihu.com/${prefix}-${i}.png`
    : `https://sns-creator-preview.xhscdn.com/${prefix}-${i}`,
  complete: true, width: im.width, height: im.height }));
  return platform === 'zhihu'
    ? { url: p.draft_url, account: p.account, title: p.title, text: p.expected_text, saved: true, busy: false, failed: false, images }
    : { account: p.account, title: p.title, description: p.description, topics: p.tags.map((name, i) => ({ name, id: `topic-${i}` })), images };
}
function prepare(s, account = 'synthetic-account', draft = 'https://zhuanlan.zhihu.com/p/123/edit') {
  const d = collect(s.dir), assets = s.platform === 'zhihu' ? [...d.bodyImages.values()] : d.cards;
  const map = path.join(s.root, 'map.json');
  write(map, { mode: 'upload-only', dry_run: false, missing_files: [], upload_failed: [], assets: assets.map(a => ({
    local_path: path.relative(path.join(s.root, 'source'), d.assetFiles.get(a.source_ref)),
    sha256: a.sha256, bytes: a.bytes, status: 'uploaded', url: `https://example.com/${a.sha256}.png`,
  })) });
  const r = s.platform === 'zhihu' ? prepareZhihu(s.dir, { account, draft, mapFile: map }) : prepareXhs(s.dir, { account, reuseMap: map });
  return { r, plan: read(r.plan), base: path.dirname(r.plan) };
}
function verified(s, prepared, prefix, checkedAt, blob = false) {
  const o = observation(s.platform, prepared.plan, prefix);
  if (blob) o.images.forEach((im, i) => im.src = `blob:https://creator.xiaohongshu.com/${prefix}-${i}`);
  const evidence = { plan_hash: prepared.r.plan_hash, independent_reopen: true, checked_at: checkedAt, reopened: o,
    ...(s.platform === 'zhihu' ? { imported: structuredClone(o) }
      : { uploaded: observation(s.platform, prepared.plan, 'upload'), saved_in_list: true, reopened_from_list: true, visual_order_verified: true }) };
  const evidenceFile = path.join(prepared.base, s.platform === 'zhihu' ? 'evidence.json' : 'chrome/evidence.json');
  fs.mkdirSync(path.dirname(evidenceFile), { recursive: true }); write(evidenceFile, evidence);
  (s.platform === 'zhihu' ? verifyZhihu : verifyXhs)(s.dir, evidenceFile);
  return { o, evidenceFile };
}
function setup(t, platform, change = 'text', account, blob = false) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'wenchang-migration-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = createRuntimeFixture(root), dir = path.join(root, 'distribution'), s = { root, dir, platform };
  init({ workspace: root, out: dir, ...fixture, platforms: [platform] }); build(dir);
  const old = prepare(s), { o, evidenceFile } = verified(s, old, 'old', new Date(Date.now() - 30_000).toISOString(), blob);
  const oldSnapshot = snapshot(old.base);
  if (change === 'image') {
    const a = path.join(root, 'source/assets/image-01.png'), b = path.join(root, 'source/assets/image-02.png');
    const first = fs.readFileSync(a); fs.writeFileSync(a, fs.readFileSync(b)); fs.writeFileSync(b, first);
  } else if (change === 'equivalent') fs.appendFileSync(fixture.source, '\n');
  else if (platform === 'zhihu') fs.appendFileSync(fixture.source, '\n新增合成文案，只在本地测试。\n');
  else {
    const cfg = path.join(dir, 'platforms/xiaohongshu.json'), value = read(cfg);
    value.description = '新增合成文案。\n\n' + value.description; write(cfg, value);
  }
  build(dir);
  const target = prepare(s, account), observationFile = path.join(root, 'current-observation.json');
  const envelope = { checked_at: new Date().toISOString(), independent_reopen: true, observation: structuredClone(o),
    ...(platform === 'xiaohongshu' ? { browser: 'chrome', saved_in_list: true, reopened_from_list: true, visual_order_verified: true, draft_match_count: 1 } : {}) };
  write(observationFile, envelope);
  return { ...s, old, target, oldSnapshot, evidenceFile, observationFile, envelope,
    recordFile: path.join(target.base, 'baseline-migration.json') };
}
const link = s => migrateBaseline(s.dir, s.platform, s.old.plan.bundle_version, s.observationFile);
const preflight = s => readMigratedBaseline(s.dir, s.platform, s.observationFile);

for (const platform of ['zhihu', 'xiaohongshu']) {
  for (const change of ['text', 'image']) test(`${platform}: ${change} change links old evidence without promoting new success`, t => {
    const s = setup(t, platform, change), oldState = fs.readFileSync(path.join(s.target.base, 'status.json'));
    assert.notEqual(s.old.r.plan_hash, s.target.r.plan_hash);
    if (change === 'image') assert.notEqual(s.old.plan.images[0].sha256, s.target.plan.images[0].sha256);
    else assert.notEqual(platform === 'zhihu' ? s.old.plan.expected_text : s.old.plan.description,
      platform === 'zhihu' ? s.target.plan.expected_text : s.target.plan.description);
    assert.throws(() => readEvidenceObservation(s.evidenceFile, s.target.r.plan_hash), /BASELINE_EVIDENCE_PLAN_MISMATCH/);
    const result = link(s), checked = preflight(s);
    assert.equal(result.status, 'baseline_linked'); assert.equal(result.publication_performed, false);
    assert.equal(result.source_plan_hash, s.old.r.plan_hash); assert.equal(result.target_plan_hash, s.target.r.plan_hash);
    assert.deepEqual(checked.baseline, s.envelope.observation); assert.equal(checked.status, 'remote_unchanged');
    assert.equal(checked.requires_save_and_reopen, true);
    assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
    assert.deepEqual(fs.readFileSync(path.join(s.target.base, 'status.json')), oldState);
    assert.equal(fs.existsSync(path.join(s.target.base, 'receipt.json')), false);
    assert.equal(publishingStatus(s.dir).platforms[0].state, 'ready_for_browser');
    if (platform === 'zhihu') assert.equal(s.old.plan.draft_url, s.target.plan.draft_url);
    // Only separate, newly generated save/reopen evidence may verify the desired plan.
    verified(s, s.target, 'new', new Date().toISOString());
    assert.equal(publishingStatus(s.dir).platforms[0].state, 'verified_current');
    assert.throws(() => preflight(s), /MIGRATION_TARGET_NOT_READY/);
    assert.throws(() => link(s), /MIGRATION_TARGET_NOT_READY/);
    assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
  });

  test(`${platform}: remote conflict blocks both migration and reuse without file changes`, t => {
    const s = setup(t, platform), before = snapshot(s.dir);
    s.envelope.observation.title = '远端合成改动'; write(s.observationFile, s.envelope);
    assert.throws(() => link(s), e => e.code === 'REMOTE_BASELINE_CHANGED' && e.changed_fields.includes('title'));
    assert.deepEqual(snapshot(s.dir), before);
    s.envelope.observation.title = s.old.plan.title; write(s.observationFile, s.envelope); link(s);
    const linked = snapshot(s.dir);
    s.envelope.observation.images.reverse(); write(s.observationFile, s.envelope);
    assert.throws(() => preflight(s), /REMOTE_BASELINE_CHANGED/);
    assert.throws(() => link(s), /REMOTE_BASELINE_CHANGED/);
    assert.deepEqual(snapshot(s.dir), linked);
  });

  test(`${platform}: wrong plan account or fresh observer account blocks`, t => {
    const s = setup(t, platform, 'text', 'other-account'), before = snapshot(s.dir);
    assert.throws(() => link(s), /ACCOUNT_MISMATCH/); assert.deepEqual(snapshot(s.dir), before);
    // Recreate the desired plan with the original account only in a separate fixture.
    const good = setup(t, platform); good.envelope.observation.account = 'other-account'; write(good.observationFile, good.envelope);
    assert.throws(() => link(good), /ACCOUNT_MISMATCH/);
    assert.deepEqual(snapshot(good.old.base), good.oldSnapshot);
  });

  test(`${platform}: repeated runs reuse immutable link and still require fresh conflict check`, t => {
    const s = setup(t, platform), first = link(s), before = snapshot(s.dir);
    s.envelope.checked_at = new Date().toISOString(); write(s.observationFile, s.envelope);
    assert.equal(link(s).reused, true); assert.equal(link(s).migration_id, first.migration_id);
    assert.equal(preflight(s).status, 'remote_unchanged'); assert.deepEqual(snapshot(s.dir), before);
    for (const mutation of [e => e.independent_reopen = false, e => e.checked_at = 'invalid',
      e => e.checked_at = new Date(Date.now() - 6 * 60_000).toISOString(), e => e.checked_at = '2099-01-01T00:00:00Z']) {
      const e = structuredClone(s.envelope); mutation(e); write(s.observationFile, e);
      assert.throws(() => preflight(s), /FRESH_EVIDENCE_REQUIRED/);
      assert.throws(() => link(s), /FRESH_EVIDENCE_REQUIRED/);
    }
    assert.deepEqual(snapshot(s.dir), before);
  });

  test(`${platform}: modified old evidence, receipt, or link cannot authorize update`, t => {
    const s = setup(t, platform); link(s);
    for (const file of [s.evidenceFile, path.join(s.old.base, 'receipt.json'), s.recordFile]) {
      const original = fs.readFileSync(file), value = read(file);
      if (file === s.evidenceFile) value.reopened.title = 'tampered';
      else if (file === s.recordFile) value.target_plan_hash = '0'.repeat(64);
      else value.account = 'other-account';
      write(file, value); assert.throws(() => preflight(s)); fs.writeFileSync(file, original);
    }
    assert.equal(preflight(s).status, 'remote_unchanged');
    const planFile = path.join(s.target.base, 'plan.json'); fs.appendFileSync(planFile, ' ');
    assert.throws(() => preflight(s), /MIGRATION_TARGET_PLAN_MISMATCH/);
  });

  test(`${platform}: changed original content identity or blocked old attempt cannot migrate`, t => {
    const s = setup(t, platform), bundleFile = path.join(s.dir, 'builds', s.old.plan.bundle_version, 'bundle.json');
    const original = fs.readFileSync(bundleFile), bundle = read(bundleFile); bundle.content_id = 'different-article'; write(bundleFile, bundle);
    assert.throws(() => link(s), /BASELINE_CONTENT_MISMATCH/); fs.writeFileSync(bundleFile, original);
    const stateFile = path.join(s.old.base, 'status.json'), state = read(stateFile); state.status = 'blocked'; write(stateFile, state);
    assert.throws(() => link(s), /BASELINE_EVIDENCE_NOT_VERIFIED/);
    assert.equal(fs.existsSync(s.recordFile), false);
  });

  test(`${platform}: symlink evidence and migration paths fail closed`, t => {
    const s = setup(t, platform), original = fs.readFileSync(s.evidenceFile), outside = path.join(s.root, 'outside.json');
    fs.writeFileSync(outside, original); fs.unlinkSync(s.evidenceFile); fs.symlinkSync(outside, s.evidenceFile);
    assert.throws(() => link(s), /UNSAFE_STATUS_PATH/);
    fs.unlinkSync(s.evidenceFile); fs.writeFileSync(s.evidenceFile, original);
    fs.symlinkSync(path.join(s.root, 'missing.json'), s.recordFile);
    assert.throws(() => link(s), /SYMLINK|UNSAFE/); assert.equal(fs.existsSync(path.join(s.root, 'missing.json')), false);
  });

  test(`${platform}: CLI migration and preflight require explicit mode and keep same-plan guard`, t => {
    const s = setup(t, platform), cli = fileURLToPath(new URL(platform === 'zhihu' ? '../dist/zhihu-cli.js' : '../dist/xhs-cli.js', import.meta.url));
    const run = (...args) => spawnSync(process.execPath, [cli, ...args, '--dir', s.dir, '--observation', s.observationFile], { encoding: 'utf8' });
    const migrated = run('migrate-baseline', '--from-version', s.old.plan.bundle_version);
    assert.equal(migrated.status, 0, migrated.stderr); assert.equal(JSON.parse(migrated.stdout).status, 'baseline_linked');
    const ok = run('preflight', '--migrated-baseline'); assert.equal(ok.status, 0, ok.stderr);
    assert.equal(JSON.parse(ok.stdout).status, 'remote_unchanged'); assert.equal(JSON.parse(ok.stdout).baseline, undefined);
    const strict = run('preflight', '--baseline-evidence', s.evidenceFile);
    assert.equal(strict.status, 1); assert.equal(JSON.parse(strict.stderr).code, 'BASELINE_EVIDENCE_PLAN_MISMATCH');
    const ambiguous = run('preflight', '--migrated-baseline', '--baseline-evidence', s.evidenceFile);
    assert.equal(ambiguous.status, 1); assert.equal(JSON.parse(ambiguous.stderr).code, 'BASELINE_OPTIONS_CONFLICT');
    const repeat = run('migrate-baseline', '--from-version', s.old.plan.bundle_version);
    assert.equal(repeat.status, 0); assert.equal(JSON.parse(repeat.stdout).reused, true);
    assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
  });

  test(`${platform}: evidence byte changes between repeated reads cannot hide a remote image conflict`, t => {
    const s = setup(t, platform); link(s);
    const changed = read(s.evidenceFile);
    changed.reopened.images[0].src = platform === 'zhihu'
      ? 'https://pic-private.zhihu.com/remote-edit.png' : 'https://sns-creator-preview.xhscdn.com/remote-edit';
    s.envelope.observation = structuredClone(changed.reopened); write(s.observationFile, s.envelope);
    const before = snapshot(s.dir), originalRead = fs.readFileSync;
    let reads = 0;
    // Simulate another writer replacing the evidence between hash and parse reads.
    // The old implementation validates one copy, then returns an unchecked reread.
    t.mock.method(fs, 'readFileSync', function(file, ...args) {
      const bytes = originalRead.call(fs, file, ...args);
      if (String(file) === s.evidenceFile && ++reads >= 4) return typeof bytes === 'string' ? json(changed) : Buffer.from(json(changed));
      return bytes;
    });
    assert.throws(() => preflight(s), /REMOTE_BASELINE_CHANGED|EVIDENCE.*MISMATCH/);
    assert.equal(reads, 1, 'hash, validation and returned baseline must use the same byte snapshot');
    t.mock.restoreAll(); assert.deepEqual(snapshot(s.dir), before);
  });

  test(`${platform}: new prepare attempt cannot reuse an earlier migration link`, t => {
    const s = setup(t, platform); link(s); prepare(s);
    const before = snapshot(s.dir);
    assert.throws(() => preflight(s), /BASELINE_MIGRATION_MISMATCH/);
    assert.throws(() => link(s), /BASELINE_MIGRATION_MISMATCH/);
    assert.deepEqual(snapshot(s.dir), before); assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
  });

  test(`${platform}: archived target success still blocks duplicate migration after prepare`, t => {
    const s = setup(t, platform, 'equivalent'); link(s);
    verified(s, s.target, 'old', new Date().toISOString());
    prepare(s); // Existing prepare archives the target receipt and sets ready_for_browser.
    const before = snapshot(s.dir);
    assert.equal(fs.existsSync(path.join(s.target.base, 'receipt.json')), false);
    assert.throws(() => link(s), /MIGRATION_TARGET_NOT_READY/);
    assert.throws(() => preflight(s), /MIGRATION_TARGET_NOT_READY/);
    assert.deepEqual(snapshot(s.dir), before); assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
  });
}

test('Zhihu migration preserves original draft URL and rejects another target', t => {
  const s = setup(t, 'zhihu'), planFile = path.join(s.target.base, 'plan.json'), stateFile = path.join(s.target.base, 'status.json');
  const plan = read(planFile), state = read(stateFile); plan.draft_url = 'https://zhuanlan.zhihu.com/p/456/edit';
  write(planFile, plan); state.plan_hash = sha(json(plan)); write(stateFile, state);
  assert.throws(() => link(s), /DRAFT_OR_ACCOUNT_MISMATCH/); assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
});

test('XHS requires original Chrome list reopen, unique match and loaded images', t => {
  const s = setup(t, 'xiaohongshu'), before = snapshot(s.dir);
  for (const patch of [{ browser: 'iab' }, { reopened_from_list: false }, { saved_in_list: false }, { visual_order_verified: false }, { draft_match_count: 2 }, { draft_match_count: 0 }]) {
    write(s.observationFile, { ...s.envelope, ...patch }); assert.throws(() => link(s), /ORIGINAL_CHROME_DRAFT_REQUIRED/);
  }
  const e = structuredClone(s.envelope); e.observation.images[0].complete = false; write(s.observationFile, e);
  assert.throws(() => link(s), /IMAGE_NOT_LOADED/);
  write(s.observationFile, { ...s.envelope, observation: {} }); assert.throws(() => link(s), /REMOTE_OBSERVATION_INVALID/);
  assert.deepEqual(snapshot(s.dir), before);
});

test('XHS loaded fresh blobs need order confirmation and distinct image sources', t => {
  const s = setup(t, 'xiaohongshu', 'text', undefined, true);
  s.envelope.observation.images.forEach((im, i) => im.src = `blob:https://creator.xiaohongshu.com/fresh-${i}`);
  write(s.observationFile, s.envelope); link(s); assert.equal(preflight(s).status, 'remote_unchanged');
  const before = snapshot(s.dir);
  s.envelope.observation.images[1].src = s.envelope.observation.images[0].src; write(s.observationFile, s.envelope);
  assert.throws(() => preflight(s), /DUPLICATE_IMAGE_SOURCE/);
  assert.deepEqual(snapshot(s.dir), before); assert.deepEqual(snapshot(s.old.base), s.oldSnapshot);
});

test('XHS embedded-browser baseline cannot be migrated as a Chrome draft', t => {
  const s = setup(t, 'xiaohongshu');
  fs.renameSync(s.evidenceFile, path.join(s.old.base, 'evidence.json'));
  assert.throws(() => link(s), /CHROME_BASELINE_REQUIRED/);
  assert.equal(fs.existsSync(s.recordFile), false);
});

test('unmatched default evidence does not shadow the receipt-bound Chrome evidence', t => {
  const s = setup(t, 'xiaohongshu');
  fs.writeFileSync(path.join(s.old.base, 'evidence.json'), 'unrelated incomplete JSON');
  const before = snapshot(s.old.base);
  assert.equal(link(s).evidence_scope, 'chrome');
  assert.equal(preflight(s).status, 'remote_unchanged');
  assert.deepEqual(snapshot(s.old.base), before);
});

test('Zhihu readiness requires actual booleans rather than a truthy saved string', t => {
  const s = setup(t, 'zhihu'), before = snapshot(s.dir);
  for (const patch of [{ saved: 'false' }, { busy: undefined }, { failed: 0 }]) {
    write(s.observationFile, { ...s.envelope, observation: { ...s.envelope.observation, ...patch } });
    assert.throws(() => link(s), /REMOTE_OBSERVATION_INVALID/);
  }
  assert.deepEqual(snapshot(s.dir), before);
});

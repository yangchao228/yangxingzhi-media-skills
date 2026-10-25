import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { init } from '../dist/project.js';
import { build } from '../dist/build.js';
import { sha } from '../dist/io.js';
import { apiRequest, imageUrls, syncDraft } from '../dist/wechat-sync.js';
import { createRuntimeFixture } from './runtime-fixture.mjs';

const credentials = { app_id: 'wx1234567890123456', app_secret: 's'.repeat(32), account_name: '离线合成测试号' };
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function setup(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'wenchang-wechat-journal-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = createRuntimeFixture(root);
  const source = fixture.source;
  const dir = path.join(root, 'distribution');
  init({ workspace: root, out: dir, source, metadata: fixture.metadata, platforms: ['wechat'] });
  const { bundle } = build(dir);
  const config = path.join(root, 'private', 'config.json');
  fs.mkdirSync(path.dirname(config), { mode: 0o700 });
  fs.writeFileSync(config, JSON.stringify(credentials), { mode: 0o600 });

  const metadata = readJson(path.join(dir, 'platforms/wechat.json'));
  const fragmentFile = path.join(dir, bundle.platforms.wechat.fragment);
  const fragment = fs.readFileSync(fragmentFile, 'utf8');
  const files = imageUrls(fragment).map(ref => path.resolve(path.dirname(fragmentFile), ref));
  const cover = path.resolve(dir, metadata.cover);
  const fingerprint = sha(JSON.stringify([fragment, metadata, [...files, cover].map(file => sha(fs.readFileSync(file))), credentials.app_id]));
  const work = path.join(path.dirname(config), 'sync', sha(credentials.app_id).slice(0, 16), sha(bundle.content_id).slice(0, 16));
  const journalFile = path.join(work, 'journal.json');
  const assets = {};
  files.forEach((file, index) => {
    const hash = sha(fs.readFileSync(file));
    assets['body:' + hash] = { url: `https://mmbiz.qpic.cn/mmbiz/offline-${index}/0`, source_hash: hash };
  });
  const coverHash = sha(fs.readFileSync(cover));
  assets['cover:' + coverHash] = { media_id: 'offline-cover', source_hash: coverHash };
  fs.mkdirSync(work, { recursive: true, mode: 0o700 });
  fs.writeFileSync(journalFile, JSON.stringify({ fingerprint, assets, status: 'prepared' }), { mode: 0o600 });
  return { dir, source, config, work, journalFile };
}

function assertPrivateAndUnlocked(state) {
  assert.equal(fs.existsSync(path.join(state.work, 'lock')), false, 'sync lock must be released');
  assert.equal(fs.statSync(state.journalFile).mode & 0o777, 0o600, 'journal must stay private');
  const stored = fs.readFileSync(state.journalFile, 'utf8');
  assert.equal(stored.includes(credentials.app_secret), false, 'journal must not contain credentials');
  assert.equal(stored.includes('offline-token'), false, 'journal must not contain access tokens');
}

async function withApiStub(handler, run) {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url.origin, 'https://api.weixin.qq.com');
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error');
    const endpoint = url.pathname.replace('/cgi-bin/', '');
    calls.push(endpoint);
    const data = await handler(endpoint, JSON.parse(options.body));
    return new Response(JSON.stringify(data));
  };
  try {
    return await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function draftApi(options = {}) {
  let saved;
  return (endpoint, body) => {
    if (endpoint === 'stable_token') return { access_token: 'offline-token' };
    if (endpoint === 'draft/batchget') return { total_count: 0, item: [] };
    if (endpoint === 'draft/add') {
      saved = structuredClone(body.articles[0]);
      if (options.uncertainAdd) throw new Error('simulated connection lost after draft creation');
      return { media_id: 'offline-draft' };
    }
    if (endpoint === 'draft/get') {
      assert.equal(body.media_id, 'offline-draft');
      const article = structuredClone(saved);
      return { news_item: [options.readback ? options.readback(article) : article] };
    }
    assert.fail(`unexpected endpoint: ${endpoint}`);
  };
}

test('successful draft journal reuses the saved draft and only reads it on rerun', async t => {
  const state = setup(t);
  await withApiStub(draftApi(), async calls => {
    const first = await syncDraft(state.dir, state.config);
    assert.equal(first.status, 'draft_verified');
    assert.equal(first.publication_performed, false);
    assert.deepEqual(calls, ['stable_token', 'draft/batchget', 'draft/add', 'draft/get']);
    assert.equal(readJson(state.journalFile).status, 'draft_verified');
    assertPrivateAndUnlocked(state);

    calls.length = 0;
    const repeated = await syncDraft(state.dir, state.config);
    assert.equal(repeated.media_id, first.media_id);
    assert.equal(repeated.status, 'draft_verified');
    assert.deepEqual(calls, ['stable_token', 'draft/get']);
    assertPrivateAndUnlocked(state);
  });
});

test('uncertain draft add preserves add_pending and blocks a second add before any request', async t => {
  const state = setup(t);
  await withApiStub(draftApi({ uncertainAdd: true }), async calls => {
    await assert.rejects(syncDraft(state.dir, state.config), /^Error: NETWORK_UNCERTAIN:draft\/add$/);
    assert.deepEqual(calls, ['stable_token', 'draft/batchget', 'draft/add']);
    const pending = fs.readFileSync(state.journalFile, 'utf8');
    assert.equal(JSON.parse(pending).status, 'add_pending');
    assert.equal(JSON.parse(pending).media_id, undefined);
    assertPrivateAndUnlocked(state);

    calls.length = 0;
    await assert.rejects(syncDraft(state.dir, state.config), /PREVIOUS_ADD_UNCERTAIN_MANUAL_RECONCILIATION_REQUIRED/);
    assert.deepEqual(calls, []);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), pending);
    assertPrivateAndUnlocked(state);
  });
});

test('changed legacy inputs require a baseline before updating the previous draft', async t => {
  const state = setup(t);
  await withApiStub(draftApi(), async calls => {
    await syncDraft(state.dir, state.config);
    const legacy = readJson(state.journalFile);
    delete legacy.schema_version; delete legacy.local_article; delete legacy.remote_snapshot;
    fs.writeFileSync(state.journalFile, JSON.stringify(legacy));
    const previous = fs.readFileSync(state.journalFile, 'utf8');
    fs.appendFileSync(state.source, '\n新增的合成离线测试段落。\n');
    build(state.dir);

    calls.length = 0;
    await assert.rejects(syncDraft(state.dir, state.config), /LEGACY_BASELINE_REQUIRED/);
    assert.deepEqual(calls, []);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), previous);
    assertPrivateAndUnlocked(state);
  });
});

test('an existing remote title stops creation and leaves the journal prepared', async t => {
  const state = setup(t);
  const title = readJson(path.join(state.dir, 'platforms/wechat.json')).title;
  await withApiStub(endpoint => {
    if (endpoint === 'stable_token') return { access_token: 'offline-token' };
    if (endpoint === 'draft/batchget') return { total_count: 1, item: [{ media_id: 'existing-draft', content: { news_item: [{ title }] } }] };
    assert.fail(`unexpected endpoint: ${endpoint}`);
  }, async calls => {
    const previous = fs.readFileSync(state.journalFile, 'utf8');
    await assert.rejects(syncDraft(state.dir, state.config), /EXISTING_TITLE_REQUIRES_REVIEW/);
    assert.deepEqual(calls, ['stable_token', 'draft/batchget']);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), previous);
    assertPrivateAndUnlocked(state);
  });
});

test('remote manual edits fail readback and are preserved without add, update or publish', async t => {
  const state = setup(t);
  let changed = false;
  const api = draftApi({ readback: article => changed ? { ...article, content: article.content + '<p>远端人工添加。</p>' } : article });
  await withApiStub(api, async calls => {
    await syncDraft(state.dir, state.config);
    changed = true;
    calls.length = 0;
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assert.deepEqual(calls, ['stable_token', 'draft/get']);
    const journal = readJson(state.journalFile);
    assert.equal(journal.media_id, 'offline-draft');
    assert.equal(journal.status, 'remote_conflict');
    assert.ok(journal.conflict_fields.includes('content'));
    const receipt = readJson(path.join(state.dir, 'wechat-sync-receipt.json'));
    assert.equal(receipt.status, 'remote_conflict');
    assert.equal(receipt.publication_performed, false);
    await assert.rejects(apiRequest('freepublish/submit', 'offline-token', {}), /API_NOT_ALLOWED/);
    assert.deepEqual(calls, ['stable_token', 'draft/get']);
    assertPrivateAndUnlocked(state);
  });
});

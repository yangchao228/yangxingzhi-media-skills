import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { init } from '../dist/project.js';
import { build } from '../dist/build.js';
import { sha } from '../dist/io.js';
import { adoptBaseline, imageUrls, normalizeRemoteArticle, reconcileBaseline, syncDraft, textOf } from '../dist/wechat-sync.js';
import { createRuntimeFixture } from './runtime-fixture.mjs';

const credentials = { app_id: 'wx1234567890123456', app_secret: 's'.repeat(32), account_name: '原草稿更新离线合成测试号' };
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const clone = value => structuredClone(value);

function setup(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'wenchang-wechat-update-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixture = createRuntimeFixture(root);
  const source = fixture.source;
  const dir = path.join(root, 'distribution');
  init({ workspace: root, out: dir, source, metadata: fixture.metadata, platforms: ['wechat'] });
  const { bundle } = build(dir);
  const config = path.join(root, 'private', 'config.json');
  fs.mkdirSync(path.dirname(config), { mode: 0o700 });
  fs.writeFileSync(config, JSON.stringify(credentials), { mode: 0o600 });
  const metadataFile = path.join(dir, 'platforms/wechat.json');
  const metadata = readJson(metadataFile);
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
    assets['body:' + hash] = { url: `https://mmbiz.qpic.cn/mmbiz/update-offline-${index}/0`, source_hash: hash };
  });
  const coverHash = sha(fs.readFileSync(cover));
  assets['cover:' + coverHash] = { media_id: 'offline-cover', source_hash: coverHash };
  fs.mkdirSync(work, { recursive: true, mode: 0o700 });
  fs.writeFileSync(journalFile, JSON.stringify({ fingerprint, assets, status: 'prepared' }), { mode: 0o600 });
  return { dir, source, metadataFile, config, work, journalFile, receiptFile: path.join(dir, 'wechat-sync-receipt.json') };
}

function changeDigest(state, value = '仅用于离线测试的第二版摘要。') {
  const metadata = readJson(state.metadataFile);
  metadata.digest = value;
  fs.writeFileSync(state.metadataFile, JSON.stringify(metadata, null, 2));
  return build(state.dir).bundle;
}

function changeBody(state, text = '第二版正文：已修改原草稿，原始图片保持不变。') {
  fs.appendFileSync(state.source, `\n${text}\n`);
  return build(state.dir).bundle;
}

function assertPrivateAndUnlocked(state) {
  assert.equal(fs.existsSync(path.join(state.work, 'lock')), false, 'sync lock must be released');
  assert.equal(fs.statSync(state.journalFile).mode & 0o777, 0o600, 'journal must stay private');
  const stored = fs.readFileSync(state.journalFile, 'utf8');
  assert.equal(stored.includes(credentials.app_secret), false);
  assert.equal(stored.includes('offline-token'), false);
}

function assertNoSuccessReceipt(state) {
  if (fs.existsSync(state.receiptFile)) {
    assert.notEqual(readJson(state.receiptFile).status, 'draft_verified', 'a failed attempt must not leave a successful current receipt');
    assert.equal(readJson(state.receiptFile).publication_performed, false);
  }
}

function makeApi() {
  const api = {
    remote: undefined,
    calls: [],
    updateBehavior: undefined,
    getBehavior: undefined,
    addTransform: undefined,
    updateCount: 0,
    resetCalls() { this.calls.length = 0; },
    async handle(endpoint, body) {
      this.calls.push({ endpoint, body: clone(body) });
      if (endpoint === 'stable_token') return { access_token: 'offline-token' };
      if (endpoint === 'draft/batchget') return { total_count: 0, item: [] };
      if (endpoint === 'draft/add') {
        assert.equal(this.remote, undefined, 'only the initial sync may create a draft');
        assert.equal(body.articles.length, 1);
        this.remote = clone(body.articles[0]);
        if (this.addTransform) this.remote = this.addTransform(this.remote);
        return { media_id: 'offline-existing-draft' };
      }
      if (endpoint === 'draft/get') {
        assert.deepEqual(body, { media_id: 'offline-existing-draft' });
        if (this.getBehavior) return this.getBehavior(this);
        return { news_item: [clone(this.remote)] };
      }
      if (endpoint === 'draft/update') {
        this.updateCount++;
        assert.equal(body.media_id, 'offline-existing-draft', 'updates must retain the original draft id');
        assert.equal(body.index, 0, 'only the single supported article may be replaced');
        assert.equal(Array.isArray(body.articles), false);
        assert.equal(typeof body.articles.content, 'string');
        if (this.updateBehavior) return this.updateBehavior(body, this);
        this.remote = clone(body.articles);
        return { errcode: 0, errmsg: 'ok' };
      }
      assert.fail(`unexpected endpoint: ${endpoint}; cached assets should avoid uploads`);
    },
    endpoints() { return this.calls.map(call => call.endpoint); },
  };
  return api;
}

async function withApi(api, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url.origin, 'https://api.weixin.qq.com');
    assert.equal(options.method, 'POST');
    assert.equal(options.redirect, 'error');
    const endpoint = url.pathname.replace('/cgi-bin/', '');
    const data = await api.handle(endpoint, JSON.parse(options.body));
    return new Response(JSON.stringify(data));
  };
  try {
    return await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function createDraft(state, api) {
  const receipt = await syncDraft(state.dir, state.config);
  assert.equal(receipt.status, 'draft_verified');
  assert.equal(receipt.media_id, 'offline-existing-draft');
  assert.equal(receipt.publication_performed, false);
  api.resetCalls();
  return receipt;
}

function asLegacyJournal(state) {
  const current = readJson(state.journalFile);
  const legacy = { fingerprint: current.fingerprint, assets: current.assets, media_id: current.media_id, status: 'draft_verified', validation: current.validation };
  fs.writeFileSync(state.journalFile, JSON.stringify(legacy), { mode: 0o600 });
  return legacy;
}

const remoteHash = article => sha(JSON.stringify(normalizeRemoteArticle(article)));
function reviewedFormatting(article) {
  article.content = article.content.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace('style="', 'style="letter-spacing:0.03em;');
}
function assertReadOnlyRequests(api, previousUpdateCount = 0) {
  assert.equal(api.endpoints().every(endpoint => ['stable_token', 'draft/get'].includes(endpoint)), true,
    'baseline approval must never create/update drafts or upload assets');
  assert.equal(api.updateCount, previousUpdateCount);
}
function withoutRootFontAndColor(content) {
  return content.replace(/^(<section\b[^>]*?)\sstyle="([^"]*)"/i, (_match, before, style) =>
    `${before} style="${style.split(';').filter(declaration => !/^(?:font(?:-[a-z-]+)?|color)\s*:/i.test(declaration.trim())).join(';')}"`);
}
async function createPendingStyleConflict(state, api) {
  await createDraft(state, api);
  asLegacyJournal(state);
  reviewedFormatting(api.remote);
  await adoptBaseline(state.dir, state.config, remoteHash(api.remote));
  changeDigest(state);
  api.updateBehavior = (body, server) => {
    server.remote = clone(body.articles);
    server.remote.content = withoutRootFontAndColor(server.remote.content);
    assert.notEqual(server.remote.content, body.articles.content);
    return { errcode: 0, errmsg: 'ok' };
  };
  await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
  const journal = readJson(state.journalFile);
  assert.equal(journal.status, 'remote_conflict');
  assert.ok(journal.pending_update);
  assert.ok(journal.baseline_approval);
  api.resetCalls();
  return journal;
}

test('digest and body edits update the original media id and a repeated sync performs no writes', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    const original = await createDraft(state, api);
    const originalContent = api.remote.content;
    const digestBundle = changeDigest(state);
    const updatedDigest = await syncDraft(state.dir, state.config);
    assert.equal(updatedDigest.media_id, original.media_id);
    assert.equal(updatedDigest.bundle_version, digestBundle.bundle_version);
    assert.equal(api.remote.digest, readJson(state.metadataFile).digest);
    assert.equal(api.remote.content, originalContent, 'digest edits must retain the accepted remote body');
    assert.equal(api.updateCount, 1);
    assert.equal(api.endpoints().includes('draft/add'), false);
    assert.equal(api.endpoints().at(-1), 'draft/get', 'success requires independent readback');
    assertPrivateAndUnlocked(state);

    api.resetCalls();
    const bodyBundle = changeBody(state);
    const updatedBody = await syncDraft(state.dir, state.config);
    assert.equal(updatedBody.media_id, original.media_id);
    assert.equal(updatedBody.bundle_version, bodyBundle.bundle_version);
    assert.match(api.remote.content, /第二版正文：已修改原草稿/);
    assert.deepEqual(imageUrls(api.remote.content), imageUrls(originalContent));
    assert.equal(api.updateCount, 2);
    assert.equal(api.endpoints().includes('draft/add'), false);

    api.resetCalls();
    const repeated = await syncDraft(state.dir, state.config);
    assert.equal(repeated.status, 'draft_verified');
    assert.equal(api.updateCount, 2);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertPrivateAndUnlocked(state);
  });
});

test('digest-only update preserves accepted remote formatting, image aliases and extra editing fields', async t => {
  const state = setup(t), api = makeApi();
  api.addTransform = article => ({
    ...article,
    content: article.content.replace(/https:\/\/mmbiz/g, 'http://mmbiz').replace(/\/0"/g, '/640"'),
    cover_info: { crop_list: [{ ratio: '2.35', x1: '0', y1: '0', x2: '1', y2: '1' }] },
    content_source_url: '',
  });
  await withApi(api, async () => {
    await createDraft(state, api);
    const remoteBefore = clone(api.remote);
    changeDigest(state);
    await syncDraft(state.dir, state.config);
    assert.deepEqual(api.remote, { ...remoteBefore, digest: readJson(state.metadataFile).digest });
    assert.equal(api.updateCount, 1);
    assertPrivateAndUnlocked(state);
  });
});

const remoteEdits = [
  ['HTML formatting with unchanged text', article => { article.content = article.content.replace('<strong ', '<strong data-human-edit="yes" '); }],
  ['link destination with unchanged label', article => { article.content = article.content.replace('https://example.com/', 'https://edited.example/'); }],
  ['body text', article => { article.content += '<p>远端人工添加，必须保留。</p>'; }],
  ['digest', article => { article.digest = '远端人工摘要'; }],
  ['cover', article => { article.thumb_media_id = 'human-selected-cover'; }],
  ['cover crop', article => { article.thumb_crop_info = { crop_list: [{ ratio: '1', x1: '0.2', y1: '0', x2: '1', y2: '1' }] }; }],
  ['returned cover_info crop', article => { article.cover_info = { crop_list: [{ ratio: '2.35', x1: '0.2', y1: '0', x2: '1', y2: '1' }] }; }],
  ['comment visibility', article => { article.need_open_comment = 1; }],
  ['fans-only comments', article => { article.only_fans_can_comment = 1; }],
  ['source link', article => { article.content_source_url = 'https://human.example/source'; }],
];

for (const [name, edit] of remoteEdits) {
  test(`remote ${name} changes block an update and preserve the edited draft`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createDraft(state, api);
      const baseline = clone(api.remote);
      edit(api.remote);
      const editedRemote = clone(api.remote);
      assert.notDeepEqual(editedRemote, baseline, 'the synthetic manual edit must change the actual remote article');
      changeDigest(state);
      await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
      assert.deepEqual(api.remote, editedRemote);
      assert.equal(api.updateCount, 0);
      assert.equal(api.endpoints().includes('draft/add'), false);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

test('a remote edit between the first read and the last pre-update read is protected', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    let gets = 0;
    api.getBehavior = server => {
      if (++gets === 2) server.remote.content += '<p>更新前发生的远端人工编辑。</p>';
      return { news_item: [clone(server.remote)] };
    };
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assert.equal(gets, 2, 'the baseline must be checked immediately before writing');
    assert.equal(api.updateCount, 0);
    assert.match(api.remote.content, /远端人工编辑/);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('an unchanged legacy journal migrates only after a matching independent readback', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    const result = await syncDraft(state.dir, state.config);
    assert.equal(result.status, 'draft_verified');
    assert.equal(api.updateCount, 0);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assert.equal(readJson(state.journalFile).schema_version, 2);
    assert.ok(readJson(state.journalFile).remote_snapshot);
    assert.ok(readJson(state.journalFile).local_article);
    api.resetCalls();
    changeDigest(state);
    await syncDraft(state.dir, state.config);
    assert.equal(api.updateCount, 1, 'the migrated baseline must support the next update');
    assertPrivateAndUnlocked(state);
  });
});

test('a legacy journal with changed local inputs blocks without creating an unverifiable baseline', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    const remoteBefore = clone(api.remote);
    changeDigest(state);
    await assert.rejects(syncDraft(state.dir, state.config), /LEGACY_BASELINE_REQUIRED/);
    assert.deepEqual(api.endpoints(), [], 'changed legacy inputs must be rejected before requests');
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(api.updateCount, 0);
    assert.equal(readJson(state.journalFile).remote_snapshot, undefined);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('a legacy journal with a mismatching remote draft cannot silently adopt the remote edits', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    api.remote.digest = '迁移前的远端人工修改';
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED|READBACK_MISMATCH_DRAFT_PRESERVED/);
    assert.equal(api.updateCount, 0);
    assert.equal(readJson(state.journalFile).remote_snapshot, undefined);
    assert.equal(api.remote.digest, '迁移前的远端人工修改');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

for (const [name, edit] of remoteEdits.slice(0, 2)) {
  test(`legacy migration rejects remote ${name} even when text and images still match`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createDraft(state, api);
      asLegacyJournal(state);
      const baseline = clone(api.remote);
      edit(api.remote);
      const editedRemote = clone(api.remote);
      assert.notDeepEqual(editedRemote, baseline, 'the legacy manual edit must change the remote HTML');
      await assert.rejects(syncDraft(state.dir, state.config), /LEGACY_REMOTE_REVIEW_REQUIRED/);
      assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
      assert.equal(api.updateCount, 0);
      assert.deepEqual(api.remote, editedRemote);
      assert.equal(readJson(state.journalFile).remote_snapshot, undefined, 'migration must not adopt unreviewed HTML as its baseline');
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

test('legacy migration permits only the observed WeChat image scheme and size aliases', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    const originalContent = api.remote.content;
    api.remote.content = api.remote.content.replace(/https:\/\/mmbiz/g, 'http://mmbiz').replace(/\/0"/g, '/640"');
    assert.notEqual(api.remote.content, originalContent, 'the alias fixture must change returned image URLs');
    const aliasedRemote = clone(api.remote);
    const result = await syncDraft(state.dir, state.config);
    assert.equal(result.status, 'draft_verified');
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assert.equal(api.updateCount, 0);
    assert.deepEqual(api.remote, aliasedRemote, 'read-only migration must preserve the returned platform HTML');
    assert.equal(readJson(state.journalFile).schema_version, 2);
    assert.ok(readJson(state.journalFile).remote_snapshot);
    assertPrivateAndUnlocked(state);
  });
});

test('explicitly approved legacy formatting and plain-text citations become a read-only baseline for digest updates', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    const originalContent = api.remote.content;
    reviewedFormatting(api.remote);
    assert.notEqual(api.remote.content, originalContent, 'the reviewed fixture must change links or styling');
    const reviewedRemote = clone(api.remote);
    const hash = remoteHash(reviewedRemote);
    const receipt = await adoptBaseline(state.dir, state.config, hash);
    assert.equal(receipt.status, 'draft_verified');
    assert.equal(receipt.operation, 'verify');
    assert.equal(receipt.baseline_adopted, true);
    assert.equal(receipt.media_id, 'offline-existing-draft');
    assert.equal(receipt.publication_performed, false);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertReadOnlyRequests(api);
    assert.deepEqual(api.remote, reviewedRemote);
    const adopted = readJson(state.journalFile);
    assert.equal(adopted.schema_version, 2);
    assert.deepEqual(adopted.remote_snapshot, normalizeRemoteArticle(reviewedRemote));
    assert.ok(adopted.local_article);
    assertPrivateAndUnlocked(state);

    api.resetCalls();
    changeDigest(state);
    const updated = await syncDraft(state.dir, state.config);
    assert.equal(updated.status, 'draft_verified');
    assert.equal(updated.media_id, receipt.media_id);
    assert.deepEqual(api.remote, { ...reviewedRemote, digest: readJson(state.metadataFile).digest });
    assert.equal(api.updateCount, 1);
    assert.equal(api.endpoints().includes('draft/add'), false);
    assert.equal(api.endpoints().at(-1), 'draft/get');
    assertPrivateAndUnlocked(state);
  });
});

for (const name of ['incorrect', 'stale']) {
  test(`a ${name} reviewed hash cannot adopt a legacy remote snapshot`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createDraft(state, api);
      asLegacyJournal(state);
      const hash = name === 'incorrect' ? '0'.repeat(64) : remoteHash(api.remote);
      reviewedFormatting(api.remote);
      const remoteBefore = clone(api.remote);
      await assert.rejects(adoptBaseline(state.dir, state.config, hash), /REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED/);
      assertReadOnlyRequests(api);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(readJson(state.journalFile).remote_snapshot, undefined, 'a rejected review must not establish a baseline');
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

test('omitting the approved hash cannot fall through to an ordinary draft sync', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    reviewedFormatting(api.remote);
    const remoteBefore = clone(api.remote), journalBefore = fs.readFileSync(state.journalFile, 'utf8');
    await assert.rejects(adoptBaseline(state.dir, state.config), /INVALID_EXPECTED_REMOTE_HASH/);
    assert.deepEqual(api.endpoints(), []);
    assertReadOnlyRequests(api);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

for (const [name, prepare, code] of [
  ['changed local inputs', state => changeDigest(state), /BASELINE_LOCAL_INPUT_CHANGED/],
  ['no existing draft id', state => {
    const journal = readJson(state.journalFile);
    delete journal.media_id;
    fs.writeFileSync(state.journalFile, JSON.stringify(journal), { mode: 0o600 });
  }, /BASELINE_EXISTING_DRAFT_REQUIRED/],
  ['a pending operation', state => {
    const journal = readJson(state.journalFile);
    journal.pending_update = { target_fingerprint: journal.fingerprint };
    fs.writeFileSync(state.journalFile, JSON.stringify(journal), { mode: 0o600 });
  }, /BASELINE_PENDING_OPERATION_REQUIRES_RECONCILIATION/],
  ['missing cached asset identities', state => {
    const journal = readJson(state.journalFile);
    journal.assets = {};
    fs.writeFileSync(state.journalFile, JSON.stringify(journal), { mode: 0o600 });
  }, /BASELINE_ASSET_CACHE_REQUIRED/],
]) {
  test(`baseline adoption rejects ${name} without writes`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createDraft(state, api);
      asLegacyJournal(state);
      reviewedFormatting(api.remote);
      const hash = remoteHash(api.remote), remoteBefore = clone(api.remote);
      prepare(state);
      const journalBefore = fs.readFileSync(state.journalFile, 'utf8');
      await assert.rejects(adoptBaseline(state.dir, state.config, hash), code);
      assertReadOnlyRequests(api);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore, 'rejected preconditions must preserve recovery information');
      assert.equal(readJson(state.journalFile).remote_snapshot, undefined);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

for (const [name, edit] of [
  ['body text', article => { article.content += '<p>摘要验收前未经核对的新正文。</p>'; }],
  ['image identity', article => { article.content = article.content.replace('update-offline-0', 'unapproved-offline-image'); }],
]) {
  test(`an approved hash cannot adopt mismatching core ${name}`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createDraft(state, api);
      asLegacyJournal(state);
      const originalRemote = clone(api.remote);
      edit(api.remote);
      assert.notDeepEqual(api.remote, originalRemote);
      const remoteBefore = clone(api.remote);
      await assert.rejects(adoptBaseline(state.dir, state.config, remoteHash(api.remote)), /BASELINE_CORE_MISMATCH_REVIEW_REQUIRED/);
      assertReadOnlyRequests(api);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(readJson(state.journalFile).remote_snapshot, undefined);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

test('baseline adoption cannot force a later remote edit even with its newly reviewed hash', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    reviewedFormatting(api.remote);
    await adoptBaseline(state.dir, state.config, remoteHash(api.remote));
    const baseline = clone(readJson(state.journalFile).remote_snapshot);
    api.remote.content = api.remote.content.replace('letter-spacing:0.03em;', 'letter-spacing:0.05em;');
    const editedRemote = clone(api.remote);
    assert.notDeepEqual(normalizeRemoteArticle(editedRemote), baseline);
    api.resetCalls();
    await assert.rejects(adoptBaseline(state.dir, state.config, remoteHash(editedRemote)), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assertReadOnlyRequests(api);
    assert.deepEqual(api.remote, editedRemote);
    assert.deepEqual(readJson(state.journalFile).remote_snapshot, baseline, 'existing baseline approval must not become a general force option');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('repeating the same approved baseline adoption is read-only and leaves the journal unchanged', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    asLegacyJournal(state);
    reviewedFormatting(api.remote);
    const hash = remoteHash(api.remote);
    await adoptBaseline(state.dir, state.config, hash);
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
    api.resetCalls();
    const repeated = await adoptBaseline(state.dir, state.config, hash);
    assert.equal(repeated.status, 'draft_verified');
    assert.equal(repeated.baseline_adopted, true);
    assert.equal(repeated.idempotent, true);
    assert.equal(repeated.publication_performed, false);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertReadOnlyRequests(api);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertPrivateAndUnlocked(state);
  });
});

test('an update timeout after the write reconciles by get and never repeats the write', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    api.updateBehavior = (body, server) => {
      server.remote = clone(body.articles);
      throw new Error('simulated timeout after remote update');
    };
    const result = await syncDraft(state.dir, state.config);
    assert.equal(result.status, 'draft_verified');
    assert.equal(result.media_id, 'offline-existing-draft');
    assert.equal(api.updateCount, 1);
    assert.equal(api.remote.digest, readJson(state.metadataFile).digest);
    assert.equal(api.endpoints().at(-1), 'draft/get');
    assert.equal(readJson(state.journalFile).pending_update, undefined);
    api.resetCalls();
    await syncDraft(state.dir, state.config);
    assert.equal(api.updateCount, 1);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertPrivateAndUnlocked(state);
  });
});

test('an update timeout before the write preserves pending state and allows one later resend after get', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const originalRemote = clone(api.remote);
    changeDigest(state);
    api.updateBehavior = () => { throw new Error('simulated timeout before remote update'); };
    await assert.rejects(syncDraft(state.dir, state.config), /UPDATE_PENDING_RECONCILIATION_REQUIRED/);
    assert.equal(api.updateCount, 1, 'an uncertain command must not retry its own update');
    assert.deepEqual(api.remote, originalRemote);
    assert.equal(api.endpoints().at(-1), 'draft/get');
    assert.equal(readJson(state.journalFile).status, 'update_pending');
    assert.ok(readJson(state.journalFile).pending_update);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);

    api.updateBehavior = undefined;
    api.resetCalls();
    const result = await syncDraft(state.dir, state.config);
    assert.equal(result.status, 'draft_verified');
    assert.equal(api.updateCount, 2);
    assert.equal(api.endpoints()[1], 'draft/get', 'reconciliation precedes a resend');
    assert.equal(api.endpoints().filter(endpoint => endpoint === 'draft/update').length, 1);
    assert.equal(api.remote.digest, readJson(state.metadataFile).digest);
    assert.equal(readJson(state.journalFile).pending_update, undefined);
    assertPrivateAndUnlocked(state);
  });
});

test('an uncertain update followed by a third remote state stops as a conflict', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    api.updateBehavior = (_body, server) => {
      server.remote.content += '<p>连接断开时发生了第三种远端状态。</p>';
      throw new Error('simulated uncertain update');
    };
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assert.equal(api.updateCount, 1);
    assert.match(api.remote.content, /第三种远端状态/);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('platform removal of root font and color after an acknowledged update remains a content conflict without automatic resend', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const originalRemote = clone(api.remote);
    const baseline = clone(readJson(state.journalFile).remote_snapshot);
    changeDigest(state);
    api.updateBehavior = (body, server) => {
      server.remote = clone(body.articles);
      server.remote.content = withoutRootFontAndColor(server.remote.content);
      assert.notEqual(server.remote.content, body.articles.content, 'the platform fixture must remove root font and color styles');
      assert.deepEqual(imageUrls(server.remote.content), imageUrls(body.articles.content));
      return { errcode: 0, errmsg: 'ok' };
    };
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assert.equal(api.updateCount, 1);
    assert.equal(api.remote.digest, readJson(state.metadataFile).digest, 'an applied digest does not excuse an unexpected HTML change');
    assert.equal(textOf(api.remote.content), textOf(originalRemote.content));
    assert.deepEqual(imageUrls(api.remote.content), imageUrls(originalRemote.content));
    assert.equal(api.endpoints().includes('draft/add'), false);
    assert.equal(api.endpoints().at(-1), 'draft/get');
    const journal = readJson(state.journalFile), receipt = readJson(state.receiptFile);
    assert.equal(journal.status, 'remote_conflict');
    assert.equal(journal.conflict_fields.includes('content'), true, 'unexpected formatting must be identified even when the intended digest was applied');
    assert.deepEqual(journal.remote_snapshot, baseline);
    assert.ok(journal.pending_update, 'the acknowledged write still needs reconciliation of the unexpected HTML');
    assert.equal(journal.pending_update.expected_target.content, originalRemote.content);
    assert.equal(journal.pending_update.expected_target.digest, api.remote.digest);
    assert.equal(receipt.status, 'remote_conflict');
    assert.equal(receipt.conflict_fields.includes('content'), true);
    assert.doesNotMatch(receipt.recovery_action, /远端草稿存在人工修改/, 'platform processing must not be asserted to be a human edit');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);

    const pending = clone(journal.pending_update), remoteBefore = clone(api.remote);
    api.resetCalls();
    await assert.rejects(syncDraft(state.dir, state.config), /REMOTE_CONFLICT_DRAFT_PRESERVED/);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assert.equal(api.updateCount, 1, 'a third remote state must not trigger an automatic resend');
    assert.deepEqual(api.remote, remoteBefore);
    assert.deepEqual(readJson(state.journalFile).pending_update, pending);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('an exact approved pending style result reconciles read-only, archives recovery state and keeps later syncs and approval idempotent', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    const before = await createPendingStyleConflict(state, api);
    const hash = remoteHash(api.remote), reviewedRemote = clone(api.remote);
    const receipt = await reconcileBaseline(state.dir, state.config, hash);
    assert.equal(receipt.status, 'draft_verified');
    assert.equal(receipt.operation, 'reconciled');
    assert.equal(receipt.baseline_reconciled, true);
    assert.equal(receipt.media_id, before.media_id);
    assert.equal(receipt.publication_performed, false);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertReadOnlyRequests(api, 1);
    assert.deepEqual(api.remote, reviewedRemote);
    const reconciled = readJson(state.journalFile);
    assert.equal(reconciled.status, 'draft_verified');
    assert.equal(reconciled.pending_update, undefined);
    assert.equal(reconciled.conflict_fields, undefined);
    assert.equal(reconciled.fingerprint, before.pending_update.target_fingerprint);
    assert.deepEqual(reconciled.local_article, before.pending_update.target_local_article);
    assert.notEqual(reconciled.local_article.content, api.remote.content, 'the original local target must not be replaced by reviewed remote HTML');
    assert.deepEqual(reconciled.remote_snapshot, normalizeRemoteArticle(reviewedRemote));
    assert.equal(reconciled.baseline_approval.snapshot_hash, hash);
    assert.equal(reconciled.baseline_approval.approved_scope, 'accept_reviewed_remote_html_after_update');
    assert.equal(reconciled.baseline_reconciliations.length, 1);
    const archived = reconciled.baseline_reconciliations[0];
    assert.deepEqual(archived.remote_snapshot, before.remote_snapshot);
    assert.deepEqual(archived.baseline_approval, before.baseline_approval);
    assert.deepEqual(archived.resolved_pending_update, before.pending_update);
    assert.equal(Number.isNaN(Date.parse(archived.recorded_at)), false);
    assertPrivateAndUnlocked(state);

    for (let attempt = 0; attempt < 2; attempt++) {
      api.resetCalls();
      const unchanged = await syncDraft(state.dir, state.config);
      assert.equal(unchanged.status, 'draft_verified');
      assert.equal(unchanged.media_id, before.media_id);
      assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
      assertReadOnlyRequests(api, 1);
      assert.deepEqual(api.remote, reviewedRemote);
      assert.equal(readJson(state.journalFile).baseline_reconciliations.length, 1);
      assertPrivateAndUnlocked(state);
    }

    const journalBeforeRepeat = fs.readFileSync(state.journalFile, 'utf8');
    api.resetCalls();
    const repeated = await reconcileBaseline(state.dir, state.config, hash);
    assert.equal(repeated.status, 'draft_verified');
    assert.equal(repeated.operation, 'reconciled');
    assert.equal(repeated.baseline_reconciled, true);
    assert.equal(repeated.idempotent, true);
    assert.equal(repeated.media_id, before.media_id);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assertReadOnlyRequests(api, 1);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBeforeRepeat, 'repeated approval must not append another recovery history entry');
    assertPrivateAndUnlocked(state);
  });
});

test('a changed remote hash rejects reconciliation even when core text and images still match', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createPendingStyleConflict(state, api);
    const hash = remoteHash(api.remote), previousRemote = clone(api.remote);
    api.remote.content = api.remote.content.replace('<section ', '<section data-after-review="changed" ');
    assert.notEqual(remoteHash(api.remote), hash);
    assert.equal(textOf(api.remote.content), textOf(previousRemote.content));
    assert.deepEqual(imageUrls(api.remote.content), imageUrls(previousRemote.content));
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
    await assert.rejects(reconcileBaseline(state.dir, state.config, hash), /REMOTE_SNAPSHOT_CHANGED_REVIEW_REQUIRED/);
    assertReadOnlyRequests(api, 1);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('changing local input after a pending update prevents reviewed reconciliation', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createPendingStyleConflict(state, api);
    changeDigest(state, '待确认期间又修改的第三版摘要。');
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
    await assert.rejects(reconcileBaseline(state.dir, state.config, remoteHash(api.remote)), /RECONCILIATION_LOCAL_INPUT_CHANGED/);
    assertReadOnlyRequests(api, 1);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('reconciliation without a pending update cannot force a changed existing baseline', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    reviewedFormatting(api.remote);
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
    await assert.rejects(reconcileBaseline(state.dir, state.config, remoteHash(api.remote)), /RECONCILIATION_PENDING_REQUIRED/);
    assertReadOnlyRequests(api);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('reconciliation cannot accept a pending operation that has not reached a reviewed conflict status', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    const journal = await createPendingStyleConflict(state, api);
    journal.status = 'update_pending';
    fs.writeFileSync(state.journalFile, JSON.stringify(journal), { mode: 0o600 });
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
    await assert.rejects(reconcileBaseline(state.dir, state.config, remoteHash(api.remote)), /RECONCILIATION_STATUS_REQUIRED/);
    assertReadOnlyRequests(api, 1);
    assert.deepEqual(api.remote, remoteBefore);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

for (const [name, edit] of [
  ['digest', article => { article.digest = '未授权的新远端摘要。'; }],
  ['comment setting', article => { article.need_open_comment = 1; }],
  ['unknown editor field', article => { article.unknown_editor_setting = { enabled: true }; }],
  ['cover identity', article => { article.thumb_media_id = 'unapproved-cover'; }],
]) {
  test(`a newly approved hash cannot reconcile a non-content ${name} difference`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createPendingStyleConflict(state, api);
      edit(api.remote);
      const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
      await assert.rejects(reconcileBaseline(state.dir, state.config, remoteHash(api.remote)), /RECONCILIATION_SCOPE_MISMATCH_REVIEW_REQUIRED/);
      assertReadOnlyRequests(api, 1);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

for (const [name, edit] of [
  ['body text', article => { article.content += '<p>未授权的新远端正文。</p>'; }],
  ['image identity', article => { article.content = article.content.replace('update-offline-0', 'unapproved-reconciliation-image'); }],
]) {
  test(`a newly approved hash cannot reconcile a core ${name} difference`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createPendingStyleConflict(state, api);
      edit(api.remote);
      const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
      await assert.rejects(reconcileBaseline(state.dir, state.config, remoteHash(api.remote)), /RECONCILIATION_CORE_MISMATCH_REVIEW_REQUIRED/);
      assertReadOnlyRequests(api, 1);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

for (const [name, hash] of [['invalid', 'not-a-reviewed-sha256'], ['missing', undefined]]) {
  test(`a ${name} reconciliation hash cannot fall through to draft synchronization`, async t => {
    const state = setup(t), api = makeApi();
    await withApi(api, async () => {
      await createPendingStyleConflict(state, api);
      const journalBefore = fs.readFileSync(state.journalFile, 'utf8'), remoteBefore = clone(api.remote);
      await assert.rejects(reconcileBaseline(state.dir, state.config, hash), /INVALID_EXPECTED_REMOTE_HASH/);
      assert.deepEqual(api.endpoints(), []);
      assertReadOnlyRequests(api, 1);
      assert.deepEqual(api.remote, remoteBefore);
      assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
      assertNoSuccessReceipt(state);
      assertPrivateAndUnlocked(state);
    });
  });
}

test('changing local inputs while an update is pending blocks before requests', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    api.updateBehavior = () => { throw new Error('simulated uncertain update'); };
    await assert.rejects(syncDraft(state.dir, state.config), /UPDATE_PENDING_RECONCILIATION_REQUIRED/);
    const pending = clone(readJson(state.journalFile).pending_update);
    api.resetCalls();
    changeBody(state, '未完成对账前又修改了本地正文。');
    await assert.rejects(syncDraft(state.dir, state.config), /PENDING_UPDATE_INPUT_CHANGED/);
    assert.deepEqual(api.endpoints(), []);
    assert.equal(api.updateCount, 1);
    assert.deepEqual(readJson(state.journalFile).pending_update, pending);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('failed reconciliation get preserves pending information and does not resend', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    api.updateBehavior = (_body, server) => {
      server.getBehavior = () => { throw new Error('simulated readback transport failure'); };
      throw new Error('simulated uncertain update');
    };
    await assert.rejects(syncDraft(state.dir, state.config), /NETWORK_UNCERTAIN:draft\/get|UPDATE_PENDING_RECONCILIATION_REQUIRED/);
    assert.equal(api.updateCount, 1);
    const pending = clone(readJson(state.journalFile).pending_update);
    assert.ok(pending);
    assert.equal(readJson(state.journalFile).status, 'update_pending');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);

    api.resetCalls();
    await assert.rejects(syncDraft(state.dir, state.config), /NETWORK_UNCERTAIN:draft\/get|UPDATE_PENDING_RECONCILIATION_REQUIRED/);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assert.equal(api.updateCount, 1);
    assert.deepEqual(readJson(state.journalFile).pending_update, pending);
    assertPrivateAndUnlocked(state);
  });
});

test('a later get can confirm an applied pending update without resending it', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    changeDigest(state);
    api.updateBehavior = (body, server) => {
      server.remote = clone(body.articles);
      server.getBehavior = () => { throw new Error('simulated readback outage after applied update'); };
      throw new Error('simulated lost update response');
    };
    await assert.rejects(syncDraft(state.dir, state.config), /UPDATE_PENDING_RECONCILIATION_REQUIRED/);
    assert.equal(api.updateCount, 1);
    assert.equal(readJson(state.journalFile).status, 'update_pending');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);

    api.getBehavior = undefined;
    api.resetCalls();
    const result = await syncDraft(state.dir, state.config);
    assert.equal(result.status, 'draft_verified');
    assert.equal(result.media_id, 'offline-existing-draft');
    assert.equal(api.updateCount, 1);
    assert.deepEqual(api.endpoints(), ['stable_token', 'draft/get']);
    assert.equal(api.remote.digest, readJson(state.metadataFile).digest);
    assert.equal(readJson(state.journalFile).pending_update, undefined);
    assertPrivateAndUnlocked(state);
  });
});

test('unbuilt local changes invalidate a previous successful receipt before network or locking', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8');
    fs.appendFileSync(state.source, '\n尚未重新构建的本地编辑。\n');
    await assert.rejects(syncDraft(state.dir, state.config), /BUNDLE_STALE_REBUILD_FIRST/);
    assert.deepEqual(api.endpoints(), []);
    assert.equal(api.updateCount, 0);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('an existing sync lock blocks requests without replacing another invocation receipt', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const journalBefore = fs.readFileSync(state.journalFile, 'utf8');
    const receiptBefore = fs.readFileSync(state.receiptFile, 'utf8');
    const lockFile = path.join(state.work, 'lock');
    fs.writeFileSync(lockFile, 'synthetic-active-invocation', { mode: 0o600 });
    try {
      await assert.rejects(syncDraft(state.dir, state.config), /SYNC_ALREADY_RUNNING/);
      assert.deepEqual(api.endpoints(), []);
      assert.equal(api.updateCount, 0);
      assert.equal(fs.readFileSync(lockFile, 'utf8'), 'synthetic-active-invocation');
      assert.equal(fs.readFileSync(state.journalFile, 'utf8'), journalBefore);
      assert.equal(fs.readFileSync(state.receiptFile, 'utf8'), receiptBefore, 'a rejected concurrent call must not race the active invocation receipt');
    } finally {
      fs.unlinkSync(lockFile);
    }
    assertPrivateAndUnlocked(state);
  });
});

test('a corrupt journal releases the acquired lock and invalidates an old successful receipt', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    fs.writeFileSync(state.journalFile, '{invalid synthetic JSON', { mode: 0o600 });
    await assert.rejects(syncDraft(state.dir, state.config));
    assert.deepEqual(api.endpoints(), []);
    assert.equal(api.updateCount, 0);
    assert.equal(fs.readFileSync(state.journalFile, 'utf8'), '{invalid synthetic JSON', 'diagnostic input must be retained');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('WeChat update business errors are surfaced without recording draft success', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const originalRemote = clone(api.remote);
    changeDigest(state);
    api.updateBehavior = () => ({ errcode: 40007, errmsg: 'synthetic private platform message' });
    await assert.rejects(syncDraft(state.dir, state.config), /WECHAT_40007:draft\/update/);
    assert.equal(api.updateCount, 1);
    assert.deepEqual(api.remote, originalRemote);
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

test('a missing update acknowledgement cannot count as success while the remote is unchanged', async t => {
  const state = setup(t), api = makeApi();
  await withApi(api, async () => {
    await createDraft(state, api);
    const originalRemote = clone(api.remote);
    changeDigest(state);
    api.updateBehavior = () => ({});
    await assert.rejects(syncDraft(state.dir, state.config), /UPDATE_PENDING_RECONCILIATION_REQUIRED|INVALID_RESPONSE:draft\/update/);
    assert.equal(api.updateCount, 1);
    assert.deepEqual(api.remote, originalRemote);
    assert.equal(readJson(state.journalFile).status, 'update_pending');
    assert.equal(api.endpoints().at(-1), 'draft/get');
    assertNoSuccessReceipt(state);
    assertPrivateAndUnlocked(state);
  });
});

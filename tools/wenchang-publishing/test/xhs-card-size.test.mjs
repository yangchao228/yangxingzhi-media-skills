import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { init, collect } from '../dist/project.js';
import { build } from '../dist/build.js';
import { prepareXhs, validateXhs } from '../dist/xhs-sync.js';

const fixture = fileURLToPath(new URL('../../../content/publishing/p0/fixture/', import.meta.url));

// Valid synthetic PNGs keep this regression independent of personal artwork.
function png(width, height) {
  function chunk(name, data) {
    const payload = Buffer.concat([Buffer.from(name), data]);
    let crc = 0xffffffff;
    for (const byte of payload) {
      crc ^= byte;
      for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const size = Buffer.alloc(4), sum = Buffer.alloc(4);
    size.writeUInt32BE(data.length);
    sum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([size, payload, sum]);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.alloc((width * 3 + 1) * height))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function setup(t, width, height) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'xhs-size-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.cpSync(fixture, path.join(root, 'source'), { recursive: true });
  const dir = path.join(root, 'distribution');
  const bytes = png(width, height);
  fs.writeFileSync(path.join(root, 'source/assets/image-01.png'), bytes);
  init({ workspace: root, out: dir, source: path.join(root, 'source/body.md'),
    metadata: path.join(root, 'source/metadata.json'), platforms: ['xiaohongshu'] });
  return { root, dir, bytes };
}

for (const [width, height, allowed] of [
  [1080, 1440, true], [1086, 1448, true], [1200, 1600, true],
  [1080, 1080, false], [720, 960, false], [1086, 1449, false],
]) {
  test(`XHS native ${width}x${height}: ${allowed ? 'preserves original' : 'rejects size'}`, t => {
    const { dir, bytes } = setup(t, width, height);
    if (!allowed) {
      assert.throws(() => build(dir), e => e.issues?.some(i => i.code === 'XHS_CARD_SIZE'));
      return;
    }
    const { bundle } = build(dir), platform = bundle.platforms.xiaohongshu;
    assert.deepEqual(fs.readFileSync(path.join(dir, platform.images[0])), bytes);
    assert.ok(fs.readFileSync(path.join(dir, platform.preview), 'utf8')
      .includes(`width="${width}" height="${height}"`));
  });
}

test('native dimensions survive R2 map reuse, upload plan and offline readback validation', t => {
  const { root, dir, bytes } = setup(t, 1086, 1448);
  build(dir);
  const map = path.join(root, 'synthetic-map.json');
  fs.writeFileSync(map, JSON.stringify({
    mode: 'upload-only', dry_run: false, missing_files: [], upload_failed: [],
    assets: collect(dir).cards.map(a => ({ sha256: a.sha256, bytes: a.bytes,
      status: 'uploaded', url: `https://example.com/${a.sha256}.png` })),
  }));
  const result = prepareXhs(dir, { account: 'synthetic', reuseMap: map });
  const plan = JSON.parse(fs.readFileSync(result.plan, 'utf8'));
  assert.equal(result.reused_from_r2_map, 2);
  assert.deepEqual([plan.images[0].width, plan.images[0].height], [1086, 1448]);
  assert.deepEqual(fs.readFileSync(path.resolve(path.dirname(result.plan), plan.images[0].upload_file)), bytes);
  const observation = { account: plan.account, title: plan.title, description: plan.description,
    images: plan.images.map((a, i) => ({ src: `blob:https://creator.xiaohongshu.com/reopened-${i}`,
      complete: true, width: a.width, height: a.height })) };
  validateXhs(plan, observation, true);
  observation.images[0].width = 1080;
  observation.images[0].height = 1440;
  assert.throws(() => validateXhs(plan, observation, true), /IMAGE_NOT_LOADED/);
});

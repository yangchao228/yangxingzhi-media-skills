import fs from 'node:fs';
import path from 'node:path';
import { deflateSync } from 'node:zlib';

function png(width, height, color) {
  function chunk(name, data) {
    const payload = Buffer.concat([Buffer.from(name), data]);
    let crc = 0xffffffff;
    for (const byte of payload) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    const size = Buffer.alloc(4), checksum = Buffer.alloc(4);
    size.writeUInt32BE(data.length);
    checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([size, payload, checksum]);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const row = Buffer.alloc(width * 3 + 1);
  row[0] = 0;
  for (let x = 0; x < width; x++) color.copy(row, 1 + x * 3);
  const pixels = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Create only synthetic inputs needed by an offline platform test.
 * Nothing is copied from content/outputs or content/publishing, and no
 * screenshots, receipts, credentials, or platform responses are created.
 * The generated PNGs satisfy the local XHS 3:4 card contract so suites that
 * exercise all three platforms do not need checked-in binary fixtures.
 */
export function createRuntimeFixture(root) {
  const sourceDir = path.join(root, 'source');
  const assetsDir = path.join(sourceDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.writeFileSync(path.join(sourceDir, 'body.md'), [
    '# 文昌公众号更新合成测试',
    '',
    '这是一份只用于离线草稿更新测试的合成正文。',
    '',
    '## 第一段',
    '',
    '测试正文、摘要、封面和两张图片的保存与回读。',
    '',
    '这是**合成加粗内容**，链接指向 [Example Domain](https://example.com/)。',
    '',
    '![合成图片01](assets/image-01.png)',
    '',
    '## 第二段',
    '',
    '不包含真实业务数据，也不代表发布授权。',
    '',
    '![合成图片02](assets/image-02.png)',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(sourceDir, 'metadata.json'), JSON.stringify({
    fixture_id: 'runtime-wechat-draft-update',
    title: '文昌公众号更新合成测试',
    source: 'runtime_generated_synthetic_fixture',
    task_scope: 'offline draft update test; no publication',
    wechat: {
      author: '离线合成测试号',
      digest: '只用于验证公众号原草稿更新与回读。',
      cover: 'assets/image-01.png',
    },
    xiaohongshu: {
      cover_title: '三平台状态核验',
      post_title: '本地三平台只读状态测试',
      description: '这是一份只用于本地分发流程验收的合成说明。它覆盖正文来源、平台配置、图片顺序、草稿保存状态和重开后的回读结果，帮助检查本地证据是否仍与当前版本一致。内容不包含真实业务数据，也不代表任何平台的发布授权；测试完成后由用户决定是否继续人工审核。测试过程只在临时目录运行，结束后自动清理，不读取正式稿、截图、凭证或线上平台数据。',
      tags: ['工作流', '草稿核验'],
      images: ['assets/image-01.png', 'assets/image-02.png'],
    },
  }, null, 2) + '\n');
  fs.writeFileSync(path.join(assetsDir, 'image-01.png'), png(1080, 1440, Buffer.from([0x35, 0x61, 0x49])));
  fs.writeFileSync(path.join(assetsDir, 'image-02.png'), png(1080, 1440, Buffer.from([0x8a, 0x5c, 0x3e])));
  return {
    source: path.join(sourceDir, 'body.md'),
    metadata: path.join(sourceDir, 'metadata.json'),
  };
}

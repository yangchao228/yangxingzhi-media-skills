import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { init } from '../dist/project.js';
import { validateXhs, normalizeXhsDescription } from '../dist/xhs-sync.js';

const plan = {
  account: 'synthetic', title: '合成排版验证', description: '第一段。\n① 第一点\n② 第二点\n结尾提问？',
  tags: ['AI工作流', '效率工具'], images: [{ width: 1086, height: 1448 }],
};
function observation() {
  return { account: plan.account, title: plan.title, description: plan.description,
    topics: [{ name: 'AI工作流', id: 'synthetic-1' }, { name: '效率工具', id: 'synthetic-2' }],
    images: [{ src: 'blob:https://creator.xiaohongshu.com/reopened-1', complete: true, width: 1086, height: 1448 }] };
}

test('preserves paragraph boundaries while tolerating DOM blank lines and CRLF', () => {
  const o = observation();
  o.description = '\u00a0第一段。\r\n\r\n① 第一点\n\n② 第二点\n\n结尾提问？\u00a0';
  validateXhs(plan, o, true);
  assert.equal(normalizeXhsDescription(o.description), plan.description);
});
test('flattened or moved paragraph boundaries fail even when text is unchanged', () => {
  for (const description of [plan.description.replaceAll('\n', ' '), plan.description.replace('第一段。\n①', '第一\n段。①')]) {
    assert.throws(() => validateXhs(plan, { ...observation(), description }, true), /DESCRIPTION_LAYOUT_MISMATCH/);
  }
});
test('missing, extra, duplicate and wrong topics fail', () => {
  const correct = observation().topics;
  for (const topics of [undefined, [], correct.slice(0, 1), [correct[0], correct[0]],
    [correct[0], { name: '无关话题', id: 'synthetic-3' }], [...correct, { name: '多余话题', id: 'synthetic-3' }]]) {
    assert.throws(() => validateXhs(plan, { ...observation(), topics }, true), /TOPICS_MISMATCH/);
  }
});
test('topic text alone cannot substitute for selected platform topic nodes', () => {
  const o = observation();
  o.topics[0].id = '';
  assert.throws(() => validateXhs(plan, o, false), /TOPIC_NOT_SELECTED/);
  o.topics = [];
  o.description += '\n#AI工作流 #效率工具';
  assert.throws(() => validateXhs(plan, o, true), /TITLE_OR_DESCRIPTION_MISMATCH/);
});
test('hash-prefixed config tags match selected topics; legacy empty tags remain valid', () => {
  validateXhs({ ...plan, tags: ['#AI工作流', '#效率工具'] }, observation(), true);
  validateXhs({ ...plan, tags: [] }, { ...observation(), topics: undefined }, true);
});

test('init carries Wenchang hot_topic_tags into platform config, respecting explicit tags', t => {
  const root=fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'xhs-caption-')));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const fixture=fileURLToPath(new URL('../../../content/publishing/p0/fixture/',import.meta.url));
  fs.cpSync(fixture,path.join(root,'source'),{recursive:true});
  const metadata=path.join(root,'source/metadata.json');
  const data=JSON.parse(fs.readFileSync(metadata));
  data.xiaohongshu.hot_topic_tags=['AI工作流','效率工具'];
  for(const explicit of [false,true]) {
    if(explicit)data.xiaohongshu.tags=[];
    fs.writeFileSync(metadata,JSON.stringify(data));
    const out=path.join(root,explicit?'explicit':'inherited');
    init({workspace:root,out,source:path.join(root,'source/body.md'),metadata,platforms:['xiaohongshu']});
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out,'platforms/xiaohongshu.json'))).tags,
      explicit?[]:data.xiaohongshu.hot_topic_tags);
  }
});

#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { syncDraft } from './wechat-sync.js';
import { preflight, readCredentials } from './wechat-preflight.js';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { config: { type: 'string' }, dir: { type: 'string' }, help: { type: 'boolean' } } });
  if (values.help) console.log('wechat-cli preflight --config /absolute/path/credentials.json\n只核验凭证和读取权限。\nwechat-cli sync --config /absolute/path/credentials.json --dir distribution\n上传素材并保存草稿，重复执行回读已有草稿；不发布。');
  else {
    if (positionals.length !== 1 || !['preflight','sync'].includes(positionals[0]) || !values.config) throw new Error('用法：wechat-cli preflight --config 本地凭证文件');
    const credentials = readCredentials(values.config);
    if (positionals[0] === 'sync' && !values.dir) throw new Error('DIR_REQUIRED');
    const result = positionals[0] === 'sync' ? await syncDraft(values.dir!, values.config) : await preflight(credentials);
    console.log(JSON.stringify(result, null, 2));
    if (!['read_permissions_verified','draft_verified'].includes(result.status)) process.exitCode = 1;
  }
} catch (error) {
  console.error(JSON.stringify({ status: 'blocked', code: error instanceof Error && /^[A-Z0-9_]+(?::[a-z/_]+)?$/.test(error.message) ? error.message : 'LOCAL_CONFIG_OR_IO_ERROR', action: '按 code 检查原因；写入结果不确定时先核对本地 journal 与远端草稿，不要删除记录后重试。凭证仅在本地配置，权限应为 600。', publication_performed: false }));
  process.exitCode = 1;
}

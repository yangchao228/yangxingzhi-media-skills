#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { adoptBaseline, reconcileBaseline, syncDraft } from './wechat-sync.js';
import { preflight, readCredentials } from './wechat-preflight.js';

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { config: { type: 'string' }, dir: { type: 'string' }, 'expected-remote-hash': { type: 'string' }, help: { type: 'boolean' } } });
  if (values.help) console.log('wechat-cli preflight --config /absolute/path/credentials.json\n只核验凭证和读取权限。\nwechat-cli sync --config /absolute/path/credentials.json --dir distribution\n首次保存草稿；改稿后先读后更新同一草稿；重复执行只回读。远端快照变化会阻塞，超时后先读对账。旧 journal 需以原本地版本完成一次只读基线迁移。不发布，不提供强制覆盖选项。\nwechat-cli adopt-baseline --config /absolute/path/credentials.json --dir distribution --expected-remote-hash 已审快照SHA256\n仅在用户明确确认保留当前远端版式和纯文字引用后使用；重新读取并匹配已审哈希、原本地输入和核心内容，再记录本地基线。不会上传或修改远端草稿。\nwechat-cli reconcile-baseline --config /absolute/path/credentials.json --dir distribution --expected-remote-hash 已审快照SHA256\n仅在用户明确接受更新后的远端 HTML 差异后，对已保存但回读冲突的更新只读对账；核心内容和其他字段必须匹配。保留旧基线与待确认记录，不上传或修改草稿。');
  else {
    if (positionals.length !== 1 || !['preflight','sync','adopt-baseline','reconcile-baseline'].includes(positionals[0]) || !values.config) throw new Error('用法：wechat-cli preflight --config 本地凭证文件');
    const credentials = readCredentials(values.config);
    if (positionals[0] !== 'preflight' && !values.dir) throw new Error('DIR_REQUIRED');
    const baselineCommand=['adopt-baseline','reconcile-baseline'].includes(positionals[0]);
    if (baselineCommand && !values['expected-remote-hash']) throw new Error('INVALID_EXPECTED_REMOTE_HASH');
    if (!baselineCommand && values['expected-remote-hash']) throw new Error('EXPECTED_REMOTE_HASH_ONLY_FOR_ADOPTION');
    const result = positionals[0] === 'sync' ? await syncDraft(values.dir!, values.config)
      : positionals[0] === 'adopt-baseline' ? await adoptBaseline(values.dir!,values.config,values['expected-remote-hash']!)
      : positionals[0] === 'reconcile-baseline' ? await reconcileBaseline(values.dir!,values.config,values['expected-remote-hash']!)
      : await preflight(credentials);
    console.log(JSON.stringify(result, null, 2));
    if (!['read_permissions_verified','draft_verified'].includes(result.status)) process.exitCode = 1;
  }
} catch (error) {
  const details=error as Error&{sync_status?:string;conflict_fields?:string[];recovery_action?:string};
  console.error(JSON.stringify({ status: ['blocked','remote_conflict','update_pending','readback_mismatch'].includes(details?.sync_status||'')?details.sync_status:'blocked', code: error instanceof Error && /^[A-Z0-9_]+(?::[a-z/_]+)?$/.test(error.message) ? error.message : 'LOCAL_CONFIG_OR_IO_ERROR', conflict_fields: details?.conflict_fields||[], action: details?.recovery_action||'按 code 检查原因；写入结果不确定时先核对本地 journal 与远端草稿，不要删除记录后重试。凭证仅在本地配置，权限应为 600。', publication_performed: false }));
  process.exitCode = 1;
}

#!/usr/bin/env node
import path from 'node:path';
import { parseArgs } from 'node:util';
import { build, check, exportBundle } from './build.js';
import { attachState, init } from './project.js';
import { PublishingError, problem, type Platform } from './model.js';
import { serve } from './server.js';
import { publishingStatus } from './status.js';

const HELP = `文昌本地分发包（构建、预览与只读状态；不连接账号）

init --source article.md --workspace project --out project/distribution [--metadata file.json] [--state content-state.json] [--platforms wechat,zhihu]
init --state content-state.json --workspace project --out project/distribution
build --dir project/distribution
check --dir project/distribution
status --dir project/distribution
export --dir project/distribution --out project/exports/review-01
attach-state --dir project/distribution --state project/content-state.json
serve --dir project/distribution [--port 8923]

相对 CLI 参数按当前目录解释；平台配置和卡片清单中的路径按 distribution 解释。
退出码：0 就绪；1 阻塞/失败；2 输入已变化（stale）。`;
try {
  const { values: v, positionals } = parseArgs({ allowPositionals: true, options: {
    platforms: { type: 'string' }, source: { type: 'string' }, workspace: { type: 'string' }, out: { type: 'string' }, dir: { type: 'string' },
    state: { type: 'string' }, metadata: { type: 'string' }, 'content-id': { type: 'string' }, port: { type: 'string' }, help: { type: 'boolean' }
  } });
  const command = positionals[0];
  if (v.help || !command) console.log(HELP);
  else if (positionals.length > 1) problem('ARGUMENTS', '多余的位置参数。', '运行 --help 查看用法。');
  else {
    const dir = v.dir ? path.resolve(v.dir) : '';
    let result: unknown;
    if (command === 'init') {
      if (!v.workspace || !v.out) problem('ARGUMENTS', 'init 需要 --workspace 和 --out。', '运行 --help 查看用法。');
      result = init({ workspace: v.workspace, out: v.out, source: v.source, state: v.state, metadata: v.metadata, contentId: v['content-id'], platforms: v.platforms?.split(',') as Platform[] | undefined });
    } else {
      if (!dir) problem('ARGUMENTS', '需要 --dir 指向已有分发目录。', '运行 --help 查看用法。');
      if (command === 'build') {
        const r = build(dir); result = { status: r.bundle.status, bundle_version: r.bundle.bundle_version, preview: path.join(dir, r.bundle.preview), reused_platforms: r.reused, publication_performed: false };
      } else if (command === 'check') { const r = check(dir); result = r; if (r.status === 'stale') process.exitCode = 2; }
      else if (command === 'status') {
        const r = publishingStatus(dir); result = r;
        if (r.local.state === 'blocked') process.exitCode = 1;
        else if (r.local.state === 'stale') process.exitCode = 2;
      }
      else if (command === 'export') { if (!v.out) problem('ARGUMENTS', 'export 需要 --out。', '选择项目内的新空目录。'); result = exportBundle(dir, v.out); }
      else if (command === 'attach-state') { if (!v.state) problem('ARGUMENTS', 'attach-state 需要 --state。', '指定已有 JSON/YAML 接力对象。'); result = attachState(dir, v.state); }
      else if (command === 'serve') await serve(dir, Number(v.port || '8923'));
      else problem('COMMAND_UNKNOWN', `未知命令：${command}`, '运行 --help 查看用法；没有发布或上传命令。');
    }
    if (result) console.log(JSON.stringify(result, null, 2));
  }
} catch (e) {
  const issues = e instanceof PublishingError ? e.issues : [{ code: 'LOCAL_IO_ERROR', message: e instanceof Error ? e.message : String(e), action: '检查路径、文件权限与本地依赖，再运行 check。', severity: 'error' }];
  console.error(JSON.stringify({ status: 'blocked', issues }, null, 2));
  process.exitCode = 1;
}

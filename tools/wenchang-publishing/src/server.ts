import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { check } from './build.js';
import { input, readJson, url } from './io.js';
import { loadProject } from './project.js';
import { problem, PLATFORMS, type Bundle } from './model.js';
import { esc, page } from './render.js';
import { publishingStatus } from './status.js';

type LocalEntryState = 'present' | 'missing' | 'unsafe';
function localEntryState(dir: string, relative: string, kind: 'file' | 'directory'): LocalEntryState {
  let current = dir;
  const parts = relative.split('/');
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) return 'unsafe';
      const directory = index < parts.length - 1 || kind === 'directory';
      if (directory ? !stat.isDirectory() : !stat.isFile()) return 'unsafe';
    } catch (e) {
      return (e as NodeJS.ErrnoException).code === 'ENOENT' ? 'missing' : 'unsafe';
    }
  }
  return 'present';
}
function transferCard(dir: string, platform: string, version: string | null) {
  const base = version ? `transfers/${platform}/${version}` : '';
  const state = base ? localEntryState(dir, base, 'directory') : 'missing';
  const files = state === 'present'
    ? ['plan.json', 'status.json', 'receipt.json', 'evidence.json', 'chrome/evidence.json'].map(name => ({
      name, ref: `${base}/${name}`, state: localEntryState(dir, `${base}/${name}`, 'file'),
    })) : [];
  return { base, state, files, evidence: files.some(file => file.name.endsWith('evidence.json') && file.state === 'present') };
}

export function previewServer(directory: string) {
  const { dir, root } = loadProject(directory);
  return http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Frame-Options', 'DENY');
    if (!/^127\.0\.0\.1:\d+$/.test(req.headers.host || '')) { res.writeHead(403); res.end('Local host only'); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    try {
      const requested = decodeURIComponent(new URL(req.url!, 'http://127.0.0.1').pathname).slice(1);
      if (requested === 'publishing-status') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (req.method === 'HEAD') res.end(); else res.end(JSON.stringify(publishingStatus(dir)));
        return;
      }
      if (requested === 'workbench') {
        const status = publishingStatus(dir);
        let bundle: Bundle | undefined;
        try { bundle = readJson<Bundle>(path.join(dir, 'bundle.json')); } catch { /* status page remains useful when no bundle exists */ }
        const rows = status.platforms.map(item => {
          const preview = status.local.state === 'local_ready' && bundle?.platforms[item.platform]?.preview
            ? `/${url(bundle.platforms[item.platform].preview)}` : '';
          const link = preview ? `<a href="${esc(preview)}">打开本地预览</a>` : '<span class="badge">无当前预览</span>';
          const recovery = item.recovery_action ? `<p class="meta">恢复：${esc(item.recovery_action)}</p>` : '';
          const transfer = transferCard(dir, item.platform, status.bundle_version);
          const baseline = item.platform === 'wechat' ? '公众号使用 API journal 基线' : item.state === 'ready_for_browser' || item.state === 'not_started'
            ? '需提供上一份独立回读 evidence' : transfer.evidence ? '本地 evidence 文件待预检' : '需重新采集独立回读 evidence';
          const command = item.platform === 'zhihu'
            ? `zhihu-cli preflight --dir <distribution> --observation <current.json> --baseline-evidence <旧transfer>/evidence.json`
            : item.platform === 'xiaohongshu'
              ? `xhs-cli preflight --dir <distribution> --observation <current.json> --baseline-evidence <旧transfer>/evidence.json`
              : '';
          const files = item.platform === 'wechat' ? '<p class="meta">公众号使用本地 API journal 和回执。</p>'
            : transfer.state === 'missing' ? '<p class="meta">当前版本还没有 transfer 目录</p>'
              : transfer.state === 'unsafe' ? '<p class="meta">transfer 目录不可用（符号链接或路径异常）</p>'
                : `<p class="meta">目录：${esc(transfer.base)}/</p>${transfer.files.map(file => `<p class="meta">${file.state === 'present'
                  ? `${esc(file.ref)}（存在）` : `${esc(file.name)}（${file.state === 'missing' ? '缺失' : '不可用：符号链接或路径异常'}）`}</p>`).join('')}`;
          return `<tr><th>${esc(item.platform)}</th><td><span class="badge">${esc(item.state)}</span><p class="meta">基线：${esc(baseline)}</p></td><td>${esc(item.next_action)}${recovery}${files}${command ? `<code>${esc(command)}</code>` : ''}</td><td>${link}</td></tr>`;
        }).join('');
        const localAction = status.local.next_action || '检查本地构建。';
        const content = `<main class="shell"><div class="bar"><div><div class="eyebrow">WENCHANG LOCAL WORKBENCH</div><h1>本地分发工作台</h1><p class="sub">只读查看当前 bundle、平台草稿状态、基线任务卡、预览入口和恢复动作。</p></div><span class="badge">${esc(status.local.state)}</span></div><section class="paper"><h2>当前版本</h2><p class="meta">bundle_version：${esc(status.bundle_version || 'UNKNOWN')}</p><p>${esc(localAction)}</p></section><section class="paper"><h2>平台任务卡</h2><table class="facts"><thead><tr><th>平台</th><th>状态与基线</th><th>下一步与本地证据</th><th>入口</th></tr></thead><tbody>${rows || '<tr><td colspan="4">没有选择平台。</td></tr>'}</tbody></table></section><footer>此页面只读，不登录、不上传、不保存、不发布。</footer></main>`;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(page('文昌本地工作台', content));
        return;
      }
      if (requested === '' || requested === 'index.html' || requested === 'status' || requested.endsWith('.html')) {
        const state = check(dir);
        if (requested === 'status') { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(state)); return; }
        if (state.status !== 'local_ready') {
          res.writeHead(409, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(page('预览已过期', '<main class="shell"><h1>源文件已变化</h1><p>请重新构建并校验，再打开最新预览。旧版本仍保留在项目中。</p></main>')); return;
        }
      }
      const bundle = readJson<Bundle>(path.join(dir, 'bundle.json'));
      if (requested === '' || requested === 'index.html') { res.writeHead(302, { Location: '/' + url(bundle.preview) }); res.end(); return; }
      const target = requested;
      const allowed = new Set([bundle.preview, 'bundle.json', ...bundle.outputs.map(f => f.ref), ...Object.values(bundle.platforms).flatMap(p => p.outputs.map(f => f.ref))]);
      if (!allowed.has(target)) { res.writeHead(404); res.end('Not found'); return; }
      const file = input(root, dir, target);
      const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
      res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
      if (req.method === 'HEAD') res.end(); else res.end(fs.readFileSync(file));
    } catch (e) {
      res.writeHead(422, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(page('预览不可用', `<main class="shell"><h1>预览暂不可用</h1><p>${esc(e instanceof Error ? e.message : String(e))}</p><p>请先运行 check 或 build，按校验提示修复本地文件。</p></main>`));
    }
  });
}
export async function serve(directory: string, port = 8923) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) problem('PORT_INVALID', '端口不合法。', '使用 0–65535 范围内的端口。');
  const status = check(directory);
  if (status.status !== 'local_ready') problem('BUNDLE_STALE', '预览已过期，未启动服务。', '先重新 build。');
  const server = previewServer(directory);
  await new Promise<void>((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => resolve()); });
  const bound = server.address();
  const actualPort = typeof bound === 'object' && bound ? bound.port : port;
  console.log(JSON.stringify({ preview_url: `http://127.0.0.1:${actualPort}/`, publishing_status_url: `http://127.0.0.1:${actualPort}/publishing-status`, mode: 'read_only_loopback', exit: 'Ctrl+C 关闭预览服务；HTML 可直接离线打开。' }));
  return server;
}

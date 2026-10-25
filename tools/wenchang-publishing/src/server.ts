import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { check } from './build.js';
import { input, readJson, url } from './io.js';
import { loadProject } from './project.js';
import { problem, PLATFORMS, type Bundle } from './model.js';
import { esc, page } from './render.js';
import { publishingStatus } from './status.js';

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

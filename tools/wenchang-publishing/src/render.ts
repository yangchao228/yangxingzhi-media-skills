import MarkdownIt from 'markdown-it';
import { problem, type Issue, type Platform } from './model.js';

// markdown-it 15 ships its own ESM declarations. Keep this small structural
// type so a separate @types/markdown-it release cannot drift from the parser.
type Token = {
  type: string; tag: string; nesting: number; content: string; info: string;
  children?: Token[] | null; attrs?: unknown;
  attrGet(name: string): string | number | null; attrSet(name: string, value: string): void;
};

export const esc = (v: string) => v.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
export const CSS = `
:root{color-scheme:light;--ink:#243d34;--muted:#66776d;--line:#dce3da;--paper:#fffef9;--ground:#f0f2e9}
*{box-sizing:border-box}body{margin:0;background:var(--ground);color:var(--ink);font:16px/1.8 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}
a{color:#315f4b;text-underline-offset:4px}a:focus-visible{outline:3px solid #ca8c46;outline-offset:4px}h1,h2,h3{line-height:1.35;overflow-wrap:anywhere}h1{font-size:32px;font-weight:650;letter-spacing:-.03em;margin:20px 0}h2{font-size:23px}p{overflow-wrap:anywhere}
.shell{max-width:1160px;margin:auto;padding:38px 24px 70px}.eyebrow{font-size:12px;letter-spacing:.16em;color:var(--muted)}.sub{color:var(--muted);max-width:750px}.bar{display:flex;gap:16px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--line);padding-bottom:18px;margin-bottom:28px}.bar a{text-decoration:none;font-size:14px}.badge{display:inline-block;border:1px solid var(--line);border-radius:4px;padding:2px 10px;font-size:12px;color:var(--muted)}
.paper{max-width:760px;margin:26px auto;background:var(--paper);border:1px solid var(--line);padding:42px}.paper img{max-width:100%;height:auto}.meta{font-size:14px;color:var(--muted);white-space:pre-wrap}.digest{padding:16px 20px;border-left:3px solid #91aa94;background:#f1f5ed}.cover{max-width:100%;max-height:260px;object-fit:contain;display:block;margin:20px auto}.notice{border-left:3px solid #b78743;background:#fff5df;padding:12px 18px;font-size:14px;margin:18px 0}.notice p{margin:4px 0}.choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin:32px 0}.choice{border-top:3px solid #51705b;padding:24px;background:var(--paper)}.choice h2{margin-top:0}.choice a{display:inline-block;margin-top:10px;font-weight:600}.copy{white-space:pre-wrap}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}.card{margin:0;background:white;border:1px solid var(--line);padding:10px}.card img{display:block;width:100%;height:auto;aspect-ratio:3/4;object-fit:contain;background:#f6f5ee}.card figcaption{font-size:13px;color:var(--muted);padding:8px 2px}.facts{border-collapse:collapse;width:100%}.facts td,.facts th{padding:12px;border-bottom:1px solid var(--line);text-align:left}code{overflow-wrap:anywhere}footer{margin-top:42px;padding-top:18px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
@media(max-width:720px){.shell{padding:24px 16px}.paper{padding:24px 20px;margin:18px 0}.choices{grid-template-columns:1fr}h1{font-size:27px}}
`;
export function page(title: string, content: string) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; font-src 'self'; base-uri 'none'; form-action 'none'"><title>${esc(title)}</title><style>${CSS}</style></head><body>${content}</body></html>`;
}
export function markdown() { return new MarkdownIt({ html: false, linkify: false, typographer: false, breaks: false }); }
export function walk(tokens: Token[], fn: (token: Token) => void) {
  for (const token of tokens) { fn(token); if (token.children) walk(token.children, fn); }
}
export function imageRef(raw: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(raw) || raw.startsWith('//')) problem('REMOTE_IMAGE', `图片未本地化：${raw.slice(0, 120)}`, '先下载图片到 assets，保留 Markdown 相对路径；构建器不会自动请求外网。');
  try { return decodeURIComponent(raw.split(/[?#]/)[0]); }
  catch { return problem('IMAGE_PATH_INVALID', `无法解析图片路径：${raw}`, '使用合法的相对文件路径。'); }
}
export function scan(source: string) {
  const tokens = markdown().parse(source, {});
  const images: string[] = [];
  const warnings: Issue[] = [];
  const warn = (code: string, message: string, action: string) => warnings.push({ code, message, action, severity: 'warning' });
  walk(tokens, token => {
    if (token.type === 'image') images.push(imageRef(String(token.attrGet('src') || '')));
    if (token.type === 'link_open') {
      const href = String(token.attrGet('href') || '');
      if (!/^(?:https?:|mailto:|#)/i.test(href)) problem('LOCAL_LINK_UNSUPPORTED', `本地文字链接尚未打包：${href}`, '正文可保留外部网址或页内锚点；此版请先将本地附件转为正文内容。');
    }
    if (token.type === 'fence' && /^(mermaid|math|latex)(\s|$)/i.test(token.info)) warn('CODE_FALLBACK', `${token.info.trim()} 保留为源码，没有渲染为图形或公式。`, '预览中核对源码；需要图形时先导出为本地 PNG，再引用。');
    if (token.type === 'text' && /<\/?[a-z][^>]*>/i.test(token.content)) warn('HTML_AS_TEXT', '原始 HTML 按文字保留，不执行其中的样式或脚本。', '使用 Markdown 结构或本地 PNG 替换需要保留的视觉内容。');
    if (token.type === 'text' && /\$[^$\n]+\$/.test(token.content)) warn('MATH_AS_TEXT', '检测到公式标记，当前以原始文字显示。', '检查预览，必要时换成本地公式图片。');
  });
  return { tokens, images, warnings };
}
const STYLES: Record<string, string> = {
  p: 'margin:18px 0;line-height:1.9;overflow-wrap:anywhere;',
  h1: 'font-size:28px;line-height:1.4;margin:30px 0 18px;color:#243d34;',
  h2: 'font-size:23px;line-height:1.45;margin:32px 0 18px;color:#243d34;border-bottom:1px solid #dce3da;padding-bottom:10px;',
  h3: 'font-size:20px;line-height:1.5;margin:26px 0 14px;color:#315f4b;',
  blockquote: 'margin:24px 0;padding:8px 20px;border-left:3px solid #7e9b80;background:#f1f5ed;color:#455e50;',
  table: 'border-collapse:collapse;width:100%;font-size:15px;margin:22px 0;table-layout:fixed;overflow-wrap:anywhere;',
  td: 'border:1px solid #cfd8ce;padding:10px;text-align:left;',
  th: 'border:1px solid #cfd8ce;padding:10px;text-align:left;background:#edf2e8;',
  ol: 'padding-left:28px;margin:20px 0;', ul: 'padding-left:26px;margin:20px 0;',
  li: 'margin:8px 0;line-height:1.8;', a: 'color:#315f4b;text-decoration:underline;',
  strong: 'font-weight:700;color:#243d34;', img: 'max-width:100%;height:auto;display:block;margin:24px auto;',
  hr: 'border:0;border-top:1px solid #dce3da;margin:30px 0;'
};
export function article(source: string, platform: Platform, imageUrls: Map<string, string>) {
  const md = markdown();
  const tokens = md.parse(source, {});
  // Only the leading title is metadata; headings later in the article remain untouched.
  if (tokens[0]?.type === 'heading_open' && tokens[0].tag === 'h1') tokens.splice(0, 3);
  const ids = new Map<string, number>();
  walk(tokens, token => {
    if (token.nesting === 1 && STYLES[token.tag]) token.attrSet('style', STYLES[token.tag]);
    if (token.type === 'image') {
      const key = imageRef(String(token.attrGet('src') || ''));
      const target = imageUrls.get(key);
      if (!target) problem('IMAGE_MAPPING_MISSING', `没有图片映射：${key}`, '重新构建并检查素材。', platform);
      token.attrSet('src', target);
      token.attrSet('style', STYLES.img);
    }
    if (token.type === 'link_open') token.attrSet('rel', 'noreferrer noopener');
  });
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === 'heading_open') {
      const base = (tokens[i + 1]?.content || 'section').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, '-');
      const count = (ids.get(base) || 0) + 1; ids.set(base, count);
      tokens[i].attrSet('id', base + (count > 1 ? '-' + count : ''));
    }
  }
  md.renderer.rules.fence = (ts, idx) => `<pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#edf0e8;padding:18px;border-radius:4px;font:14px/1.7 ui-monospace,monospace;"><code>${esc(ts[idx].content)}</code></pre>\n`;
  md.renderer.rules.code_inline = (ts, idx) => `<code style="padding:2px 5px;background:#edf0e8;font-size:0.9em;">${esc(ts[idx].content)}</code>`;
  return `<section style="font:17px/1.9 -apple-system,'PingFang SC','Microsoft YaHei',sans-serif;color:#243d34;">${md.renderer.render(tokens, md.options, {})}</section>`;
}
export function notices(issues: Issue[]) {
  if (!issues.length) return '';
  return `<aside class="notice"><strong>预览说明</strong>${issues.map(i => `<p>${esc(i.message)} ${esc(i.action)}</p>`).join('')}</aside>`;
}

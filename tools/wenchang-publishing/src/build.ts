import fs from 'node:fs';
import path from 'node:path';
import { atomic, input, json, output, readJson, ref, sha, url, validate, within } from './io.js';
import { collect, loadProject } from './project.js';
import { PLATFORMS, PublishingError, problem, type ArticleConfig, type Bundle, type OutputFile, type Platform, type PlatformBuild, type XhsConfig } from './model.js';
import { article, esc, notices, page } from './render.js';

const names = { zhihu: '知乎', wechat: '公众号', xiaohongshu: '小红书' };
function fileRecord(base: string, file: string): OutputFile {
  const bytes = fs.readFileSync(file); return { ref: ref(base, file), sha256: sha(bytes), bytes: bytes.length };
}
function verifyFiles(root: string, dir: string, files: OutputFile[]) {
  for (const f of files) {
    const file = input(root, dir, f.ref);
    if (!within(dir, file)) problem('OUTPUT_PATH_INVALID', '产物引用超出 distribution。', '重新生成分发包，勿手动改 manifest。');
    if (sha(fs.readFileSync(file)) !== f.sha256 || fs.statSync(file).size !== f.bytes) problem('OUTPUT_CHANGED', `已生成产物被修改：${f.ref}`, '保留取证后移走损坏的 renders/builds 目录，再重新构建；不要手工维护渲染缓存。');
  }
}
function nav(home: string, platform?: Platform) {
  return `<nav class="bar"><a href="${esc(home)}">← 平台预览</a><span class="badge">${platform ? names[platform] + ' · ' : ''}本地预览</span></nav>`;
}
export function build(directory: string) {
  const { dir, root } = loadProject(directory);
  const lockFile = output(root, path.join(dir, '.build.lock'));
  let lock: number;
  try { lock = fs.openSync(lockFile, 'wx'); } catch { return problem('BUILD_BUSY', '此目录已有构建进行中。', '等待现有命令结束；若进程已退出，再手动移走 .build.lock。'); }
  try {
    const data = collect(dir);
    const manifestPath = path.join(dir, 'bundle.json');
    if (fs.existsSync(manifestPath)) {
      const prior = readJson<Bundle>(manifestPath); validate('bundle', prior);
      if (prior.bundle_version === data.bundleVersion) { verifyBundle(data.root, dir, prior); return { bundle: prior, reused: [...data.targets] }; }
    }
    const platforms = {} as Record<Platform, PlatformBuild>;
    const reused: Platform[] = [];
    for (const platform of data.targets) {
      const platformDir = output(root, path.join(dir, 'renders', platform, data.versions[platform]));
      const receipt = path.join(platformDir, 'render.json');
      if (fs.existsSync(receipt)) {
        const saved = readJson<PlatformBuild>(receipt); validate('render', saved);
        if (saved.version !== data.versions[platform]) problem('CACHE_INVALID', '渲染缓存版本不匹配。', '移走对应缓存目录后重新构建。');
        verifyFiles(root, dir, saved.outputs); platforms[platform] = saved; reused.push(platform); continue;
      }
      if (fs.existsSync(platformDir)) problem('CACHE_INCOMPLETE', `发现未完成的缓存：${ref(dir, platformDir)}`, '保留诊断后移走该目录，再重试构建。');
      const staging = output(root, platformDir + '.building');
      if (fs.existsSync(staging)) problem('CACHE_INCOMPLETE', '发现上次中断的临时缓存。', '移走对应 .building 目录后重试。');
      fs.mkdirSync(staging, { recursive: true });
      const generated: string[] = [];
      const emit = (relative: string, bytes: string | Uint8Array) => {
        const file = path.join(staging, relative); atomic(output(root, file), bytes); generated.push(relative); return relative;
      };
      const store = (asset: typeof data.assets[number], filename?: string) => {
        const name = filename || `assets/${asset.sha256}.${asset.type === 'jpg' ? 'jpg' : asset.type}`;
        if (!generated.includes(name)) emit(name, fs.readFileSync(data.assetFiles.get(asset.source_ref)!));
        return url(name);
      };
      const cfg = data.configs[platform];
      let preview: string;
      let fragment: string | undefined;
      let ordered: string[] | undefined;
      const home = '../../../index.html';
      if (platform === 'xiaohongshu') {
        const c = cfg as XhsConfig;
        ordered = data.cards.map((asset, i) => store(asset, `images/${String(i + 1).padStart(2, '0')}.${asset.type}`));
        emit('post.json', json({ cover_title: c.cover_title, post_title: c.post_title, description: c.description, tags: c.tags, images: ordered }));
        const cards = ordered.map((file, i) => `<figure class="card"><img src="${esc(file)}" alt="第 ${i + 1} 张${i === 0 ? '，封面' : '，内容图'}" width="1080" height="1440"><figcaption>${String(i + 1).padStart(2, '0')} / ${ordered!.length} · <a download href="${esc(file)}">保存原图</a></figcaption></figure>`).join('');
        preview = emit('preview.html', page(c.post_title, `<main class="shell">${nav(home, platform)}<div class="eyebrow">WENCHANG / ${data.versions[platform].slice(0, 8)}</div><h1>${esc(c.post_title)}</h1><p class="sub">封面主标题：${esc(c.cover_title)} · ${ordered.length} 张，按下方编号排列</p><section class="paper" style="max-width:none;margin:28px 0"><h2>发布说明</h2><p class="copy">${esc(c.description)}</p><p class="meta">${c.tags.map(t => '#' + esc(t.replace(/^#/, ''))).join(' ')} · ${Array.from(c.description).length} 字</p><a href="post.json" download>保存文案与图片清单</a></section><div class="cards">${cards}</div><aside class="notice">当前仅验收本地素材包。平台网页草稿存于当前浏览器；线上图片回读问题单独排查。</aside><footer>原图无裁切导出 · 1080 × 1440 · 尚未保存到平台</footer></main>`));
      } else {
        const c = cfg as ArticleConfig;
        const imageUrls = new Map([...data.bodyImages].map(([key, value]) => [key, store(value)]));
        const html = article(data.source, platform, imageUrls);
        fragment = emit('article.fragment.html', html);
        const cover = platform === 'wechat' ? store(data.cover) : '';
        emit('metadata.json', json({ ...c, ...(platform === 'wechat' ? { cover } : {}) }));
        preview = emit('article.html', page(c.title, `<main class="shell">${nav(home, platform)}${notices(data.warnings[platform])}<article class="paper"><div class="eyebrow">${platform === 'wechat' ? 'WECHAT' : 'ZHIHU'} / LOCAL PREVIEW</div><h1>${esc(c.title)}</h1>${platform === 'wechat' ? `<p class="meta">${esc(c.author || '未填写署名')}</p><p class="digest">${esc(c.digest || '')}</p><details><summary>查看独立封面</summary><img class="cover" src="${esc(cover)}" alt="公众号独立封面"></details>` : ''}${html}</article><footer>本地排版预览。平台编辑器可能调整样式，最终草稿显示在同步阶段核验。</footer></main>`));
      }
      fs.renameSync(staging, platformDir);
      platforms[platform] = {
        version: data.versions[platform], preview: ref(dir, path.join(platformDir, preview)),
        ...(fragment ? { fragment: ref(dir, path.join(platformDir, fragment)) } : {}),
        ...(ordered ? { images: ordered.map(p => ref(dir, path.join(platformDir, decodeURIComponent(p)))) } : {}),
        status: 'local_ready', transfer_status: 'not_started',
        inputs: data.inputs.filter(f => data.platformInputs[platform].some(i => i.ref === f.ref)),
        outputs: generated.map(f => fileRecord(dir, path.join(platformDir, f))), warnings: data.warnings[platform]
      };
      atomic(output(root, receipt), json(platforms[platform]));
    }
    // Check again before advancing the latest pointer, so edits during rendering cannot approve mixed inputs.
    if (collect(dir).bundleVersion !== data.bundleVersion) problem('INPUT_CHANGED_DURING_BUILD', '构建过程中输入文件发生了变化。', '本次未替换成功结果；保存编辑后重新构建。');
    const snapshot = output(root, path.join(dir, 'builds', data.bundleVersion));
    fs.mkdirSync(snapshot, { recursive: true });
    const index = path.join(snapshot, 'index.html');
    const checks = path.join(snapshot, 'checks.json');
    const choices = data.targets.map(p => `<section class="choice"><div class="eyebrow">${p.toUpperCase()}</div><h2>${names[p]}</h2><p>${p === 'xiaohongshu' ? `${data.cards.length} 张有序图片、独立文案与双标题` : p === 'wechat' ? '固定主题、独立封面、署名与摘要' : '原文结构、正文图片与基础排版'}</p><span class="badge">本地校验通过</span><br><a href="${esc(url(ref(snapshot, path.join(dir, platforms[p].preview))))}">打开${names[p]}预览 →</a></section>`).join('');
    atomic(index, page('文昌 · 本地分发包', `<main class="shell"><div class="eyebrow">WENCHANG / LOCAL PUBLISHING</div><h1>一篇正文，多平台预览</h1><p class="sub">${esc(((data.configs[data.targets[0]] as ArticleConfig).title || (data.configs[data.targets[0]] as XhsConfig).post_title))}</p><span class="badge">版本 ${data.bundleVersion.slice(0, 12)} · 本地预览就绪</span><div class="choices">${choices}</div><section class="paper" style="max-width:none;margin:28px 0"><h2>本次检查</h2><table class="facts"><tbody><tr><th>正文与资源</th><td>唯一 Markdown 源 · ${data.assets.length} 个本地图片文件 · 相对路径</td></tr><tr><th>小红书</th><td>${data.targets.includes('xiaohongshu') ? '双标题、150–300 字说明、1080 × 1440 图片和页序已检查' : '本次未启用'}</td></tr><tr><th>草稿同步</th><td>此页面只展示本地构建；线上草稿状态以独立同步回读记录为准</td></tr></tbody></table><p><a href="checks.json">查看校验记录</a></p></section><footer>断网可阅读 · 修改源文件后请重新构建和检查 · 本地校验不等于内容审核或平台验收</footer></main>`));
    atomic(checks, json({ schema_version: 1, bundle_version: data.bundleVersion, status: 'local_ready', checks: ['schema', 'workspace_paths', 'local_images', 'image_dimensions', ...(data.targets.includes('xiaohongshu') ? ['xiaohongshu_titles_description', 'image_order'] : []), 'relative_resources', 'input_fingerprints'], platform_warnings: data.warnings, online_verification: 'not_run', image_text_overflow: 'raster inputs; requires visual review', publication_performed: false }));
    const bundle: Bundle = {
      schema_version: 1, content_id: data.project.content_id, source_ref: data.project.source_ref, source_hash: data.sourceHash,
      bundle_version: data.bundleVersion, built_at: new Date().toISOString(), renderer_version: data.rendererVersion,
      theme: data.project.theme, status: 'local_ready', publication_performed: false, approval: 'not_requested',
      inputs: data.inputs, assets: data.assets, platforms,
      preview: ref(dir, index), checks: ref(dir, checks), outputs: [fileRecord(dir, index), fileRecord(dir, checks)]
    };
    validate('bundle', bundle);
    atomic(output(root, path.join(snapshot, 'bundle.json')), json(bundle));
    // The immutable snapshot is the review target. This redirect is only a convenient local entry point.
    atomic(output(root, path.join(dir, 'index.html')), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${url(bundle.preview)}"><title>文昌本地预览</title><a href="${url(bundle.preview)}">打开最新本地预览</a>`);
    atomic(output(root, manifestPath), json(bundle));
    return { bundle, reused };
  } catch (e) {
    if (e instanceof PublishingError) atomic(output(root, path.join(dir, 'reports/last-failure.json')), json({ status: 'blocked', failed_at: new Date().toISOString(), issues: e.issues, previous_success_preserved: fs.existsSync(path.join(dir, 'bundle.json')) }));
    throw e;
  } finally { fs.closeSync(lock); fs.unlinkSync(lockFile); }
}
function verifyBundle(root: string, dir: string, bundle: Bundle) {
  verifyFiles(root, dir, bundle.outputs);
  for (const p of Object.values(bundle.platforms)) verifyFiles(root, dir, p.outputs);
}
export function check(directory: string) {
  const data = collect(directory);
  const bundle = readJson<Bundle>(input(data.root, data.dir, 'bundle.json')); validate('bundle', bundle);
  const old = new Map(bundle.inputs.map(i => [i.ref, i.sha256]));
  const changed = [...new Set([...bundle.inputs.map(i => i.ref), ...data.inputs.map(i => i.ref)])].filter(r => old.get(r) !== data.inputs.find(i => i.ref === r)?.sha256);
  const stalePlatforms = PLATFORMS.filter(p => bundle.platforms[p]?.version !== data.versions[p]);
  verifyBundle(data.root, data.dir, bundle);
  return { status: bundle.bundle_version === data.bundleVersion ? 'local_ready' : 'stale', changed_inputs: changed, stale_platforms: stalePlatforms, renderer_changed: bundle.renderer_version !== data.rendererVersion, bundle_version: bundle.bundle_version, current_version: data.bundleVersion, publication_performed: false };
}
export function exportBundle(directory: string, destination: string) {
  const status = check(directory);
  if (status.status !== 'local_ready') problem('BUNDLE_STALE', '当前预览已过期，未导出。', '先 build，再导出已校验版本。');
  const { dir, root } = loadProject(directory);
  const dest = output(root, path.resolve(destination));
  if (within(dir, dest) || within(dest, dir)) problem('EXPORT_LOCATION', '导出目录不能包含 distribution，也不能位于 distribution 内。', '选择项目内独立的空目录，例如 exports/review-01。');
  if (fs.existsSync(dest) && fs.readdirSync(dest).length) problem('EXPORT_EXISTS', '导出目录非空，未覆盖。', '使用新的空目录。');
  const bundle = readJson<Bundle>(path.join(dir, 'bundle.json'));
  const files = new Set([...bundle.inputs.map(i => i.ref), ...bundle.outputs.map(i => i.ref), ...Object.values(bundle.platforms).flatMap(p => p.outputs.map(i => i.ref)), ...Object.entries(bundle.platforms).map(([p, b]) => `renders/${p}/${b.version}/render.json`), 'bundle.json', 'index.html']);
  const copied: string[] = [];
  for (const f of files) {
    const from = input(root, dir, f); const relative = ref(root, from); const target = output(root, path.join(dest, relative));
    atomic(target, fs.readFileSync(from)); copied.push(relative);
  }
  atomic(path.join(dest, 'EXPORT-README.txt'), '文昌本地分发包快照。请整体移动此目录，保持相对路径。\n正文在导出快照中仅用于追溯；继续编辑原项目，再重新构建。\n本包没有平台登录信息，也未执行草稿同步或发布。\n');
  return { destination: dest, project_dir: ref(dest, path.join(dest, ref(root, dir))), preview: path.join(dest, ref(root, path.join(dir, bundle.preview))), files: copied.length, bundle_version: bundle.bundle_version };
}

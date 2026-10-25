import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { imageSize } from 'image-size';
import { atomic, engineVersion, input, json, localRef, output, readJson, ref, sha, stable, validate, within } from './io.js';
import { PLATFORMS, problem, type Asset, type InputFile, type Issue, type Platform, type PlatformConfig, type Project, type XhsConfig } from './model.js';
import { scan } from './render.js';

export function readState(file: string): any {
  try {
    const value = YAML.parse(fs.readFileSync(file, 'utf8'));
    if (!value?.content_state || typeof value.content_state !== 'object' || Array.isArray(value.content_state)) throw new Error();
    return value;
  } catch { return problem('CONTENT_STATE_INVALID', 'content_state 必须是包含 content_state 对象的 JSON 或 YAML 文件。', '检查现有状态文件；无需补齐无关的历史字段。'); }
}
function resolveExisting(root: string, candidate: string) {
  return input(root, root, ref(root, path.resolve(candidate)));
}
export interface InitOptions { out: string; workspace: string; source?: string; state?: string; metadata?: string; contentId?: string; platforms?: Platform[] }
export function init(options: InitOptions) {
  const lexicalRoot = path.resolve(options.workspace);
  const root = fs.realpathSync(lexicalRoot);
  if (!within(lexicalRoot, path.resolve(options.out))) problem('OUTPUT_OUTSIDE_WORKSPACE', '分发目录必须在指定项目内。', '扩大 --workspace 到正文和 distribution 的共同项目目录。');
  const dir = output(root, path.resolve(root, path.relative(lexicalRoot, path.resolve(options.out))));
  if (fs.existsSync(dir) && fs.readdirSync(dir).length) problem('PROJECT_EXISTS', '输出目录已有文件，未覆盖。', '使用新的空目录，或直接 build 已有 project.json。');
  const stateFile = options.state ? resolveExisting(root, options.state) : undefined;
  const state = stateFile ? readState(stateFile).content_state : {};
  let source = options.source;
  if (!source && state.draft?.file && stateFile) {
    const candidates = [...new Set([path.resolve(path.dirname(stateFile), state.draft.file), path.resolve(root, state.draft.file)])].filter(p => fs.existsSync(p));
    if (candidates.length !== 1) problem('SOURCE_AMBIGUOUS', '无法唯一确定 content_state 中的正文路径。', '显式传入 --source，原状态文件不变。');
    source = candidates[0];
  }
  if (!source) problem('SOURCE_REQUIRED', '尚未指定唯一正文源。', '传入 --source article.md，或提供含 draft.file 的 --state。');
  const sourceFile = resolveExisting(root, source);
  if (!/\.md$/i.test(sourceFile)) problem('SOURCE_FORMAT', '正文源必须是 .md 文件。', '先保存为 Markdown，再初始化。');
  const metadataFile = options.metadata ? resolveExisting(root, options.metadata) : undefined;
  const meta = metadataFile ? readJson(metadataFile) : {};
  const metaBase = metadataFile ? path.dirname(metadataFile) : stateFile ? path.dirname(stateFile) : path.dirname(sourceFile);
  const sourceText = fs.readFileSync(sourceFile, 'utf8');
  const parsed = scan(sourceText);
  const title = meta.title || state.publish_assets?.title || sourceText.match(/^#\s+(.+)$/m)?.[1] || path.basename(sourceFile, '.md');
  const assetRef = (value: string, base = metaBase) => ref(dir, input(root, base, value));
  const sourceImages = parsed.images.map(p => assetRef(p, path.dirname(sourceFile)));
  const xhs = meta.xiaohongshu || state.publish_assets?.xiaohongshu || {};
  const configs: Record<Platform, PlatformConfig> = {
    zhihu: { platform: 'zhihu', title },
    wechat: { platform: 'wechat', title, author: meta.wechat?.author || state.project?.account || '', digest: meta.wechat?.digest || state.publish_assets?.summary || '', cover: meta.wechat?.cover ? assetRef(meta.wechat.cover) : sourceImages[0] || '' },
    xiaohongshu: { platform: 'xiaohongshu', cover_title: xhs.cover_title || state.publish_assets?.cover_text || '', post_title: xhs.post_title || title, description: xhs.description || xhs.body_description || '', tags: xhs.tags || [], cards_ref: 'derived/xiaohongshu-cards.json' }
  };
  const cards = Array.isArray(xhs.images) ? xhs.images.map((v: string) => assetRef(v)) : sourceImages;
  const project: Project = { schema_version: 1, content_id: options.contentId || 'article-' + sha(ref(root, sourceFile)).slice(0, 12), workspace_ref: ref(dir, root), source_ref: ref(dir, sourceFile), theme: 'paper-v1', ...(options.platforms ? { target_platforms: options.platforms } : {}), ...(stateFile ? { content_state_ref: ref(dir, stateFile) } : {}) };
  validate('project', project);
  for (const platform of project.target_platforms || PLATFORMS) atomic(output(root, path.join(dir, 'platforms', platform + '.json')), json(configs[platform]));
  if ((project.target_platforms || PLATFORMS).includes('xiaohongshu')) atomic(output(root, path.join(dir, 'derived/xiaohongshu-cards.json')), json({ images: cards }));
  atomic(path.join(dir, 'project.json'), json(project));
  return { dir, source_ref: project.source_ref, config_files: (project.target_platforms || PLATFORMS).map(p => `platforms/${p}.json`), next: '编辑所选平台字段；启用小红书时补卡片清单，然后 build。初始化不会更改正文或 content_state。' };
}
export function loadProject(directory: string) {
  if (fs.lstatSync(directory).isSymbolicLink()) problem('OUTPUT_SYMLINK', '分发目录不能是符号链接。', '选择真实项目目录。');
  const dir = fs.realpathSync(directory);
  const project = readJson<Project>(path.join(dir, 'project.json'));
  validate('project', project);
  localRef(project.workspace_ref);
  const root = fs.realpathSync(path.resolve(dir, project.workspace_ref));
  output(root, dir);
  return { dir, root, project };
}
export function collect(directory: string) {
  const { dir, root, project } = loadProject(directory);
  const targets = project.target_platforms || [...PLATFORMS];
  const inputs = new Map<string, InputFile>();
  const record = (file: string) => {
    const item = { ref: ref(dir, file), sha256: sha(fs.readFileSync(file)) };
    inputs.set(item.ref, item); return item;
  };
  record(input(root, dir, 'project.json'));
  const sourceFile = input(root, dir, project.source_ref);
  if (fs.statSync(sourceFile).size > 5 * 1024 * 1024) problem('SOURCE_TOO_LARGE', '正文超过本地 5 MiB 限制。', '将附件拆到本地素材目录。');
  const source = fs.readFileSync(sourceFile, 'utf8');
  const sourceInput = record(sourceFile);
  if (project.content_state_ref) { readState(input(root, dir, project.content_state_ref)); record(input(root, dir, project.content_state_ref)); }
  const parsed = scan(source);
  const assets = new Map<string, Asset>();
  const assetFiles = new Map<string, string>();
  const addAsset = (file: string) => {
    const key = ref(dir, file);
    if (!assets.has(key)) {
      const size = fs.statSync(file).size;
      if (size > 64 * 1024 * 1024) problem('ASSET_TOO_LARGE', `素材超过本地 64 MiB 限制：${key}`, '压缩素材后重试。');
      const data = fs.readFileSync(file);
      let dims: ReturnType<typeof imageSize>;
      try { dims = imageSize(data); } catch { return problem('IMAGE_INVALID', `图片格式或头部无效：${key}`, '用图片工具重新导出原图，不要只修改扩展名。'); }
      if (!['png', 'jpg', 'gif', 'webp'].includes(dims.type || '')) problem('IMAGE_UNSUPPORTED', `不支持的图片类型：${dims.type || 'unknown'}`, '离线文章支持 PNG/JPEG/GIF/WebP；SVG 等先显式转为 PNG。');
      if (!dims.width || !dims.height || dims.width > 20000 || dims.height > 20000) problem('IMAGE_DIMENSIONS', `图片尺寸不在本地支持范围：${key}`, '使用宽高均不超过 20000 像素的有效图片。');
      assets.set(key, { source_ref: key, sha256: record(file).sha256, bytes: size, type: dims.type!, width: dims.width, height: dims.height });
      assetFiles.set(key, file);
    }
    return assets.get(key)!;
  };
  const bodyImages = new Map<string, Asset>();
  for (const p of parsed.images) bodyImages.set(p, addAsset(input(root, path.dirname(sourceFile), p)));
  const configs = {} as Record<Platform, PlatformConfig>;
  const platformInputs = {} as Record<Platform, InputFile[]>;
  const warnings = {} as Record<Platform, Issue[]>;
  let cards: Asset[] = [];
  let cover: Asset | undefined;
  for (const platform of targets) {
    const cfgFile = input(root, dir, `platforms/${platform}.json`);
    const cfg = readJson<PlatformConfig>(cfgFile); validate(platform, cfg); configs[platform] = cfg;
    const own = [record(cfgFile)];
    warnings[platform] = platform === 'xiaohongshu' ? [] : [...parsed.warnings];
    if (platform === 'wechat') {
      if (!('cover' in cfg) || !cfg.cover) problem('WECHAT_COVER_REQUIRED', '公众号缺少独立封面。', '在 platforms/wechat.json 的 cover 填写相对分发目录的图片路径。', platform);
      cover = addAsset(input(root, dir, cfg.cover));
      own.push(inputs.get(cover.source_ref)!);
      if (!('digest' in cfg) || !cfg.digest?.trim()) problem('WECHAT_DIGEST_REQUIRED', '公众号缺少摘要。', '在 platforms/wechat.json 填写 digest。', platform);
      if (!('author' in cfg) || !cfg.author?.trim()) warnings[platform].push({ code: 'AUTHOR_EMPTY', message: '署名为空。', action: '如需署名，在公众号配置中填写。', platform, severity: 'warning' });
      if ([...bodyImages.values()].some(a => a.type === 'gif')) warnings[platform].push({ code: 'GIF_UPLOAD_UNVERIFIED', message: 'GIF 在本地预览保留动画；平台上传兼容性尚未验收。', action: '进入草稿同步阶段时单独核验，不自动转成静态图。', platform, severity: 'warning' });
    }
    if (platform === 'xiaohongshu') {
      const c = cfg as XhsConfig;
      if (c.cover_title.trim().normalize('NFC') === c.post_title.trim().normalize('NFC')) problem('XHS_DUPLICATE_TITLES', '小红书封面标题与发布标题完全相同。', '保留同一主题，分别填写封面主标题和发布标题。', platform);
      const cardFile = input(root, dir, c.cards_ref); const cardData = readJson<{ images: string[] }>(cardFile); validate('cards', cardData); own.push(record(cardFile));
      cards = cardData.images.map(p => addAsset(input(root, dir, p)));
      for (const card of cards) {
        if (!['png', 'jpg', 'webp'].includes(card.type)) problem('XHS_IMAGE_FORMAT', '小红书图文导出不接受 GIF。', '显式准备 PNG/JPEG/WebP 卡片，不会自动抽帧。', platform);
        if (card.width < 1080 || card.width * 4 !== card.height * 3) problem('XHS_CARD_SIZE', `卡片 ${card.source_ref} 为 ${card.width}×${card.height}，本项目要求3:4且不低于1080×1440。`, '准备3:4竖图，宽度至少1080像素；保留符合条件的原图。', platform);
        if (card.bytes > 32 * 1024 * 1024) problem('XHS_IMAGE_TOO_LARGE', '小红书单图超过 32 MiB。', '压缩该图片。', platform);
        own.push(inputs.get(card.source_ref)!);
      }
      if (new Set(cards.map(a => a.sha256)).size !== cards.length) problem('XHS_DUPLICATE_IMAGE', '小红书卡片中存在相同图片。', '检查图片清单，删除无意的重复项。', platform);
      if (Array.from(c.description.trim()).length < 150) problem('XHS_DESCRIPTION', '小红书独立说明少于 150 字。', '按已有编辑约定补齐人群、看点和一个引导。', platform);
    } else for (const a of bodyImages.values()) own.push(inputs.get(a.source_ref)!);
    platformInputs[platform] = [sourceInput, ...own].sort((a, b) => a.ref.localeCompare(b.ref, 'en'));
  }
  const rendererVersion = engineVersion();
  const versions = Object.fromEntries(targets.map(p => [p, sha(stable({ inputs: platformInputs[p], rendererVersion, theme: project.theme }))])) as Record<Platform, string>;
  const inputList = [...inputs.values()].sort((a, b) => a.ref.localeCompare(b.ref, 'en'));
  const bundleVersion = sha(stable({ inputs: inputList, rendererVersion, theme: project.theme }));
  return { dir, root, project, targets, source, sourceHash: sourceInput.sha256, inputs: inputList, platformInputs, assets: [...assets.values()], assetFiles, bodyImages, cover: cover!, cards, configs, warnings, versions, bundleVersion, rendererVersion };
}
export function attachState(directory: string, statePath: string) {
  const { dir, root } = loadProject(directory);
  const file = resolveExisting(root, statePath);
  const text = fs.readFileSync(file, 'utf8');
  readState(file);
  const doc = YAML.parseDocument(text);
  const packageRef = ref(path.dirname(file), path.join(dir, 'bundle.json'));
  const old = doc.getIn(['content_state', 'distribution', 'package_ref']);
  if (old && old !== packageRef) problem('PACKAGE_REF_EXISTS', '状态文件已指向另一个分发包。', '由用户选择保留哪个引用；本次未覆盖。');
  const distribution = doc.getIn(['content_state', 'distribution']);
  if (distribution == null) doc.setIn(['content_state', 'distribution'], doc.createNode({}));
  doc.setIn(['content_state', 'distribution', 'package_ref'], packageRef);
  if (/\.json$/i.test(file)) atomic(file, json(doc.toJSON())); else atomic(file, doc.toString());
  return { state: ref(root, file), package_ref: packageRef, next: '重新 build；接力对象仅新增 distribution.package_ref。' };
}

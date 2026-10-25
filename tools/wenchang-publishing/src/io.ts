import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { problem } from './model.js';

export const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const sha = (data: string | Uint8Array) => createHash('sha256').update(data).digest('hex');
export const posix = (p: string) => p.split(path.sep).join('/');
export const ref = (from: string, to: string) => posix(path.relative(from, to)) || '.';
export const url = (p: string) => p.split('/').map(encodeURIComponent).join('/');
export const json = (v: unknown) => JSON.stringify(v, null, 2) + '\n';
export function stable(v: unknown): string {
  if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.entries(v).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([k, x]) => JSON.stringify(k) + ':' + stable(x)).join(',') + '}';
  return JSON.stringify(v);
}
export function within(root: string, target: string) {
  const r = path.relative(root, target);
  return !path.isAbsolute(r) && r !== '..' && !r.startsWith('..' + path.sep);
}
export function localRef(value: string) {
  if (!value || path.isAbsolute(value) || path.win32.isAbsolute(value) || /^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//') || value.includes('\\') || value.includes('\0')) {
    problem('LOCAL_PATH_REQUIRED', `不是可迁移的本地相对路径：${value}`, '下载素材到项目目录，并使用相对路径；不要填写 URL、绝对路径或反斜杠。');
  }
}
export function input(root: string, base: string, value: string): string {
  localRef(value);
  const target = path.resolve(base, value);
  if (!within(root, target)) problem('PATH_OUTSIDE_WORKSPACE', `路径超出项目范围：${value}`, '将文件放入 init 时指定的 workspace。');
  if (!fs.existsSync(target)) problem('FILE_MISSING', `找不到文件：${value}`, '补齐文件或修正相对路径，再重新构建。');
  const actual = fs.realpathSync(target);
  if (!within(root, actual) || !fs.statSync(actual).isFile()) problem('UNSAFE_FILE', `不能读取该文件：${value}`, '不要使用指向项目外的符号链接或目录。');
  return actual;
}
export function output(root: string, target: string) {
  if (!within(root, target)) problem('OUTPUT_OUTSIDE_WORKSPACE', '输出超出项目范围。', '将 distribution 放在同一 workspace 内。');
  let current = target;
  while (within(root, current)) {
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) problem('OUTPUT_SYMLINK', `输出路径包含符号链接：${ref(root, current)}`, '使用真实项目目录。');
    if (current === root) break;
    current = path.dirname(current);
  }
  return target;
}
export function atomic(file: string, data: string | Uint8Array) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp-' + randomUUID();
  try { fs.writeFileSync(tmp, data, { flag: 'wx' }); fs.renameSync(tmp, file); }
  finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
export function readJson<T = any>(file: string): T {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return problem('JSON_INVALID', `JSON 无法读取：${path.basename(file)}`, '检查文件存在且为合法 JSON。'); }
}
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validators = new Map<string, ReturnType<typeof ajv.compile>>();
export function validate(schemaName: string, value: unknown) {
  let validate = validators.get(schemaName);
  if (!validate) {
    validate = ajv.compile(readJson(path.join(TOOL_ROOT, 'schemas', schemaName + '.schema.json')));
    validators.set(schemaName, validate);
  }
  if (!validate(value)) problem('SCHEMA_INVALID', `${schemaName} 字段不符合合同：${ajv.errorsText(validate.errors, { separator: '; ' })}`, '按 schemas 或使用说明修正字段；原有成功构建仍保留。');
}
export function engineVersion() {
  const files = fs.readdirSync(path.join(TOOL_ROOT, 'dist')).filter(x => x.endsWith('.js')).sort().map(x => path.join(TOOL_ROOT, 'dist', x));
  files.push(path.join(TOOL_ROOT, 'package-lock.json'));
  files.push(...fs.readdirSync(path.join(TOOL_ROOT, 'schemas')).sort().map(x => path.join(TOOL_ROOT, 'schemas', x)));
  return 'wenchang-0.1.0-' + sha(Buffer.concat(files.map(f => fs.readFileSync(f))));
}

import fs from 'node:fs';
import { isIP } from 'node:net';

export interface WechatCredentials { app_id: string; app_secret: string; account_name: string }
export function readCredentials(file: string): WechatCredentials {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || (stat.mode & 0o077)) throw new Error('配置必须为普通文件且权限为 600；请执行 chmod 600 配置文件。');
  let v: WechatCredentials;
  try { v = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { throw new Error('凭证配置不是有效 JSON；请检查格式。'); }
  if (!v || typeof v.app_id !== 'string' || !/^wx[a-zA-Z0-9]{16}$/.test(v.app_id) ||
      typeof v.app_secret !== 'string' || !/^[a-zA-Z0-9]{32}$/.test(v.app_secret) ||
      typeof v.account_name !== 'string' || !v.account_name.trim()) {
    throw new Error('请在本地配置中填写有效的 app_id、app_secret 和 account_name；不要发送到聊天。');
  }
  return v;
}

type Transport = typeof fetch;
function action(code: number): string {
  if (code === 40164) return '请将调用端实际公网出口 IP 加入公众号 IP 白名单，再重试。';
  if (code === 48001) return '当前接口未授权；请检查该公众号接口权限。';
  if ([40013, 40125, 41002, 41004].includes(code)) return '请在本地核对 AppID/AppSecret 与目标公众号是否一致。';
  if ([40001, 40014, 42001].includes(code)) return '调用凭证无效或过期；请重新核验。';
  if ([45009, 45011].includes(code)) return '调用频率或配额受限；稍后再试。';
  return '请按微信错误码检查开发配置；本次没有上传或发布。';
}

// 固定官方 API 主机，不跟随重定向，不持久化 token，不输出原始错误或请求 URL。
export async function preflight(credentials: WechatCredentials, transport: Transport = fetch) {
  const checks: { capability: string; status: string; code?: number; action?: string }[] = [];
  async function request(endpoint: string, body?: object, token?: string): Promise<Record<string, unknown> | null> {
    const url = new URL(`https://api.weixin.qq.com/cgi-bin/${endpoint}`);
    if (token) url.searchParams.set('access_token', token);
    try {
      const response = await transport(url, {
        method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(20000),
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) { checks.push({ capability: endpoint, status: 'failed', action: `HTTP ${response.status}；检查网络后重试。` }); return null; }
      const data = await response.json() as Record<string, unknown>;
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('invalid response');
      if (data.errcode !== undefined && data.errcode !== 0) {
        const code = Number(data.errcode);
        const candidate = code === 40164 && typeof data.errmsg === 'string'
          ? data.errmsg.match(/invalid ip\s+([0-9a-fA-F:.]+)/i)?.[1] : undefined;
        const ipHint = candidate && isIP(candidate) ? ` 微信检测到的出口 IP：${candidate}。` : '';
        checks.push({ capability: endpoint, status: 'failed', code: Number.isFinite(code) ? code : undefined, action: action(code) + ipHint }); return null;
      }
      return data;
    } catch {
      checks.push({ capability: endpoint, status: 'failed', action: '网络、超时或响应格式异常；未自动重试，未输出凭证。' }); return null;
    }
  }
  const token = await request('stable_token', { grant_type: 'client_credential', appid: credentials.app_id, secret: credentials.app_secret, force_refresh: false });
  if (token && typeof token.access_token === 'string' && token.access_token) {
    checks.push({ capability: 'stable_token', status: 'passed' });
    for (const [endpoint, field] of [['draft/count', 'total_count'], ['material/get_materialcount', 'image_count']]) {
      const response = await request(endpoint, undefined, token.access_token);
      if (response) checks.push({ capability: endpoint, status: typeof response[field] === 'number' ? 'passed' : 'failed', ...(typeof response[field] === 'number' ? {} : { action: '返回结构不符合预期，不能判定权限通过。' }) });
    }
  } else if (token) checks.push({ capability: 'stable_token', status: 'failed', action: '未返回有效 access_token。' });
  return {
    status: checks.length === 3 && checks.every(c => c.status === 'passed') ? 'read_permissions_verified' : 'blocked',
    checked_at: new Date().toISOString(), account_name_supplied: credentials.account_name,
    account_identity_verified: false, checks, write_permissions_verified: false,
    draft_saved: false, publication_performed: false,
  };
}

export const PLATFORMS = ['zhihu', 'wechat', 'xiaohongshu'] as const;
export type Platform = typeof PLATFORMS[number];
export type Issue = { code: string; message: string; action: string; platform?: Platform; severity: 'error' | 'warning' };
export class PublishingError extends Error {
  constructor(public issues: Issue[]) { super(issues.map(i => i.message).join('\n')); }
}
export function problem(code: string, message: string, action: string, platform?: Platform): never {
  throw new PublishingError([{ code, message, action, platform, severity: 'error' }]);
}
export interface Project {
  schema_version: 1; content_id: string; workspace_ref: string; source_ref: string;
  target_platforms?: Platform[]; content_state_ref?: string; theme: 'paper-v1';
}
export interface ArticleConfig { platform: 'zhihu' | 'wechat'; title: string; author?: string; digest?: string; cover?: string }
export interface XhsConfig {
  platform: 'xiaohongshu'; cover_title: string; post_title: string; description: string;
  tags: string[]; cards_ref: string;
}
export type PlatformConfig = ArticleConfig | XhsConfig;
export interface Asset {
  source_ref: string; sha256: string; bytes: number; type: string; width: number; height: number;
}
export interface InputFile { ref: string; sha256: string }
export interface OutputFile { ref: string; sha256: string; bytes: number }
export interface PlatformBuild {
  version: string; preview: string; fragment?: string; images?: string[];
  status: 'local_ready'; transfer_status: 'not_started';
  inputs: InputFile[]; outputs: OutputFile[]; warnings: Issue[];
}
export interface Bundle {
  schema_version: 1; content_id: string; source_ref: string; source_hash: string;
  bundle_version: string; built_at: string; renderer_version: string; theme: 'paper-v1';
  status: 'local_ready'; publication_performed: false; approval: 'not_requested';
  inputs: InputFile[]; assets: Asset[]; platforms: Record<Platform, PlatformBuild>;
  preview: string; checks: string; outputs: OutputFile[];
}

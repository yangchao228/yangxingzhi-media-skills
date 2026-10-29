import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { atomic, json, readJson } from './io.js';

export interface TransferState {
  status: string;
  attempt_id: string;
  started_at: string;
  updated_at: string;
  plan_hash?: string;
  last_error_code?: string;
  recovery_action?: string;
  publication_performed: false;
  checked_at?: string;
  [key: string]: unknown;
}

export const RECOVERY_ACTIONS: Record<string, string> = {
  BASELINE_REQUIRED: '当前草稿没有已审远端基线；先从列表独立回读并由用户确认，再提供 baseline 后重试。不要清空、重传或新建草稿。',
  BASELINE_EVIDENCE_NOT_VERIFIED: '提供上一次独立回读且 draft_verified 的 evidence；旧或失败证据不能作为远端基线。',
  BASELINE_EVIDENCE_PLAN_MISMATCH: '基线 evidence 与其 plan 字节不匹配；保留现有草稿，重新从对应 transfer 目录取得完整旧证据。',
  BASELINE_MIGRATION_MISMATCH: '迁移记录与旧证据、当前 plan 或 prepare 批次不一致；保留记录和原草稿，检查变化来源，不手改 hash 或覆盖记录。',
  MIGRATION_TARGET_NOT_READY: '当前版本已有回执、历史记录或待处理保存状态；先检查最新及归档回执并重新回读，不重复导入或新建草稿。',
  BASELINE_CONTENT_MISMATCH: '旧基线属于其他内容身份；核对分发目录与历史版本，不能借用其他文章的证据。',
  ORIGINAL_CHROME_DRAFT_REQUIRED: '请在用户的 Chrome 从列表唯一匹配并重开原草稿，再采集只读观察；有同名候选时停止，不新建草稿。',
  CHROME_BASELINE_REQUIRED: '小红书迁移只接受原 Chrome 范围内已核验的基线；不能迁移内嵌浏览器的本地草稿。',
  REMOTE_BASELINE_CHANGED: '远端草稿在编辑前已变化；保留当前草稿和旧基线，先查看差异并由用户决定合并方式。',
  REMOTE_DRAFT_NOT_READY: '远端草稿仍在加载、保存或上传；等待状态稳定后重新独立回读，不要清空或重传。',
  REMOTE_OBSERVATION_INVALID: '当前远端回读证据不完整；保留现有草稿，重新采集账号、正文/描述、话题和图片状态。',
  WAIT_TIMEOUT: '浏览器等待超时；不要重传或新建草稿，重新打开现有草稿并提供新的回读证据后再核验。',
  SAVE_PENDING_READBACK: '保存结果不确定；保留现有草稿，重新从草稿列表打开并提供新的回读证据后再核验。',
  FRESH_EVIDENCE_REQUIRED: '当前证据早于上次失败状态；重新执行独立回读并提供更新后的 evidence，再核验。',
  DRAFT_NOT_SAVED: '草稿未确认保存；保留现有草稿，确认保存后重新回读，不要新建草稿。',
  SAVE_AND_REOPEN_NOT_CONFIRMED: '尚未确认草稿已保存并从列表独立重开；重新完成保存与回读后再核验。',
};

export function recoveryAction(code: string): string {
  return RECOVERY_ACTIONS[code] || '检查最新证据和草稿状态；保留 plan 与 evidence，不自动重传、不新建草稿，确认后再核验。';
}

export function newAttempt(): Pick<TransferState, 'attempt_id' | 'started_at' | 'updated_at'> {
  const now = new Date().toISOString();
  return { attempt_id: crypto.randomUUID(), started_at: now, updated_at: now };
}

export function readTransferState(file: string): TransferState | undefined {
  if (!fs.existsSync(file)) return undefined;
  try { return readJson<TransferState>(file); } catch { return undefined; }
}

export function writeTransferState(file: string, patch: Partial<TransferState> & Pick<TransferState, 'status'>, base?: Partial<TransferState>): TransferState {
  const old = readTransferState(file);
  const attempt = old || base || newAttempt();
  const updated = new Date().toISOString();
  const state: TransferState = {
    ...attempt,
    ...patch,
    status: patch.status,
    attempt_id: patch.attempt_id || attempt.attempt_id || crypto.randomUUID(),
    started_at: patch.started_at || attempt.started_at || updated,
    updated_at: updated,
    publication_performed: false,
  };
  atomic(file, json(state));
  return state;
}

export function archiveReceipt(dir: string, receiptFile: string): void {
  if (!fs.existsSync(receiptFile)) return;
  const previous = readTransferState(path.join(dir, 'status.json'));
  const attempt = previous?.attempt_id || `legacy-${Date.now()}`;
  const archiveDir = path.join(dir, 'history', attempt);
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.copyFileSync(receiptFile, path.join(archiveDir, 'receipt.json'));
  const statusFile = path.join(dir, 'status.json');
  if (fs.existsSync(statusFile)) fs.copyFileSync(statusFile, path.join(archiveDir, 'status.json'));
  fs.unlinkSync(receiptFile);
}

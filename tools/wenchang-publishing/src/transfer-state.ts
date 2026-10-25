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

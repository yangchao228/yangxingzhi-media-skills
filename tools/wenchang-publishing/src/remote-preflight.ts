import fs from 'node:fs';
import { readJson } from './io.js';

export class RemotePreflightError extends Error {
  readonly code: string;
  readonly changed_fields: string[];
  constructor(code: string, changedFields: string[] = []) {
    super(code);
    this.name = 'RemotePreflightError';
    this.code = code;
    this.changed_fields = changedFields;
  }
}

/** Read an observation or a previously accepted evidence file without trusting its filename. */
export function readObservation(file: string): any {
  const value = readJson<any>(file);
  if (value && typeof value === 'object' && value.reopened && typeof value.reopened === 'object') return value.reopened;
  if (value && typeof value === 'object' && value.observation && typeof value.observation === 'object') return value.observation;
  return value;
}

export function requireObservation(value: any, fields: string[]): void {
  if (!value || typeof value !== 'object' || Array.isArray(value) || fields.some(field => typeof value[field] !== 'string')) {
    throw new RemotePreflightError('REMOTE_OBSERVATION_INVALID');
  }
}

export function requireEvidenceEnvelope(value: any, expectedPlanHash?: string): void {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.independent_reopen !== true
    || value.status && value.status !== 'draft_verified' || value.code
    || typeof value.checked_at !== 'string' || !Number.isFinite(Date.parse(value.checked_at))
    || expectedPlanHash && value.plan_hash !== expectedPlanHash) {
    if (expectedPlanHash && value?.plan_hash !== expectedPlanHash) throw new RemotePreflightError('BASELINE_EVIDENCE_PLAN_MISMATCH');
    throw new RemotePreflightError('BASELINE_EVIDENCE_NOT_VERIFIED');
  }
}

export function readEvidenceObservation(file: string, expectedPlanHash?: string): any {
  const value = readJson<any>(file);
  requireEvidenceEnvelope(value, expectedPlanHash);
  return readObservation(file);
}

export function isBlobUrl(value: string): boolean {
  return value.startsWith('blob:');
}

export function stableRemoteImageSource(value: string): string {
  if (!value || isBlobUrl(value)) return '';
  try {
    const u = new URL(value);
    u.search = '';
    u.hash = '';
    return u.href;
  } catch {
    return value;
  }
}

export function assertFreshObservation(value: any): void {
  if (value.saved !== undefined && (!value.saved || value.busy || value.failed)) {
    throw new RemotePreflightError('REMOTE_DRAFT_NOT_READY');
  }
}

export function ensureFile(file: string): void {
  if (!fs.statSync(file).isFile()) throw new RemotePreflightError('REMOTE_OBSERVATION_INVALID');
}

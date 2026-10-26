import fs from 'node:fs';
import path from 'node:path';
import { readJson, sha } from './io.js';

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

export function requireEvidenceEnvelope(value: any, expectedPlanHash: string): void {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.independent_reopen !== true
    || value.status && value.status !== 'draft_verified' || value.code
    || typeof value.plan_hash !== 'string' || !/^[a-f0-9]{64}$/.test(value.plan_hash)
    || typeof value.checked_at !== 'string' || !Number.isFinite(Date.parse(value.checked_at))
    || value.plan_hash !== expectedPlanHash) {
    if (value?.plan_hash !== expectedPlanHash) throw new RemotePreflightError('BASELINE_EVIDENCE_PLAN_MISMATCH');
    throw new RemotePreflightError('BASELINE_EVIDENCE_NOT_VERIFIED');
  }
}

export function readEvidenceObservation(file: string, expectedPlanHash: string): any {
  const adjacent = adjacentPlanHash(file);
  if (adjacent && adjacent !== expectedPlanHash) throw new RemotePreflightError('BASELINE_EVIDENCE_PLAN_MISMATCH');
  const value = readJson<any>(file);
  requireEvidenceEnvelope(value, expectedPlanHash);
  return readObservation(file);
}

/** Check an evidence file against adjacent immutable plan bytes when available. */
export function adjacentPlanHash(file: string): string | undefined {
  const candidates = [
    path.join(path.dirname(file), 'plan.json'),
    path.join(path.dirname(file), '..', 'plan.json'),
  ];
  for (const candidate of candidates) {
    try {
      const stat = fs.statSync(candidate);
      if (stat.isFile()) return sha(fs.readFileSync(candidate));
    } catch { /* a caller may keep evidence in a separately exported directory */ }
  }
  return undefined;
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

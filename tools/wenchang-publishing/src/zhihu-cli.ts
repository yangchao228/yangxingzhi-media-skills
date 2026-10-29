#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { prepareZhihu, verifyZhihu } from './zhihu-sync.js';
import { recoveryAction } from './transfer-state.js';
import { collect } from './project.js';
import { json, readJson, sha } from './io.js';
import { preflightZhihuBaseline } from './zhihu-sync.js';
import { readEvidenceObservation, readObservation } from './remote-preflight.js';
import path from 'node:path';
import { migrateBaseline, readMigratedBaseline } from './baseline-migration.js';
try {
  const { values: v, positionals: p } = parseArgs({ allowPositionals: true, options: {
    dir: { type: 'string' }, draft: { type: 'string' }, account: { type: 'string' },
    'env-file': { type: 'string' }, map: { type: 'string' }, evidence: { type: 'string' },
    observation: { type: 'string' }, 'baseline-evidence': { type: 'string' }, 'from-version': { type: 'string' },
    'migrated-baseline': { type: 'boolean' as const },
  } });
  if (!v.dir || p.length !== 1) throw new Error('DIR_AND_COMMAND_REQUIRED');
  if (v['migrated-baseline'] && v['baseline-evidence']) throw new Error('BASELINE_OPTIONS_CONFLICT');
  let result;
  if (p[0] === 'prepare' && v.draft && v.account) result = prepareZhihu(v.dir, { draft: v.draft, account: v.account, envFile: v['env-file'], mapFile: v.map });
  else if (p[0] === 'verify' && v.evidence) result = verifyZhihu(v.dir, v.evidence);
  else if (p[0] === 'migrate-baseline' && v.observation && v['from-version']) result = migrateBaseline(v.dir, 'zhihu', v['from-version'], v.observation);
  else if (p[0] === 'preflight' && v.observation && v['migrated-baseline']) {
    const { baseline, ...summary } = readMigratedBaseline(v.dir, 'zhihu', v.observation); result = summary;
  }
  else if (p[0] === 'preflight' && v.observation && v['baseline-evidence']) {
    const data = collect(v.dir);
    const plan = readJson(path.join(data.dir, 'transfers', 'zhihu', data.bundleVersion, 'plan.json'));
    const baselineFile = v['baseline-evidence'];
    result = preflightZhihuBaseline(plan, readEvidenceObservation(baselineFile, sha(json(plan))), readObservation(v.observation));
  }
  else throw new Error('USE_PREPARE_OR_VERIFY_OR_PREFLIGHT_OR_MIGRATE_BASELINE');
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  const details = e as Error & { code?: string; changed_fields?: string[] };
  const code = details.code || (e instanceof Error && /^[A-Z0-9_]+$/.test(e.message) ? e.message : 'LOCAL_VALIDATION_OR_IO_ERROR');
  console.error(JSON.stringify({status:'blocked',code,changed_fields:details.changed_fields||[],recovery_action:recoveryAction(code),publication_performed:false})); process.exitCode = 1;
}

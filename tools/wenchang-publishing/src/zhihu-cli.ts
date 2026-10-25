#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { prepareZhihu, verifyZhihu } from './zhihu-sync.js';
import { recoveryAction } from './transfer-state.js';
try {
  const { values: v, positionals: p } = parseArgs({ allowPositionals: true, options: Object.fromEntries(['dir','draft','account','env-file','map','evidence'].map(k => [k, { type: 'string' as const }])) });
  if (!v.dir || p.length !== 1) throw new Error('DIR_AND_COMMAND_REQUIRED');
  let result;
  if (p[0] === 'prepare' && v.draft && v.account) result = prepareZhihu(v.dir, { draft: v.draft, account: v.account, envFile: v['env-file'], mapFile: v.map });
  else if (p[0] === 'verify' && v.evidence) result = verifyZhihu(v.dir, v.evidence);
  else throw new Error('USE_PREPARE_OR_VERIFY');
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  const code = e instanceof Error && /^[A-Z0-9_]+$/.test(e.message) ? e.message : 'LOCAL_VALIDATION_OR_IO_ERROR';
  console.error(JSON.stringify({status:'blocked',code,recovery_action:recoveryAction(code),publication_performed:false})); process.exitCode = 1;
}

#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { prepareXhs, verifyXhs } from './xhs-sync.js';
import { recoveryAction } from './transfer-state.js';
import { collect } from './project.js';
import { json, readJson, sha } from './io.js';
import { preflightXhsBaseline } from './xhs-sync.js';
import { readEvidenceObservation, readObservation } from './remote-preflight.js';
import path from 'node:path';
try {
 const {values:v,positionals:p}=parseArgs({allowPositionals:true,options:Object.fromEntries(['dir','account','reuse-map','env-file','evidence','observation','baseline-evidence'].map(k=>[k,{type:'string' as const}]))});
 if(!v.dir||p.length!==1)throw new Error('DIR_AND_COMMAND_REQUIRED');
 let r;
 if(p[0]==='prepare'&&v.account)r=prepareXhs(v.dir,{account:v.account,reuseMap:v['reuse-map'],envFile:v['env-file']});
 else if(p[0]==='verify'&&v.evidence)r=verifyXhs(v.dir,v.evidence);
 else if(p[0]==='preflight'&&v.observation&&v['baseline-evidence']) {
  const data=collect(v.dir),plan=readJson(path.join(data.dir,'transfers','xiaohongshu',data.bundleVersion,'plan.json'));
  const baselineFile=v['baseline-evidence'];
  r=preflightXhsBaseline(plan,readEvidenceObservation(baselineFile,sha(json(plan))),readObservation(v.observation));
 }
 else throw new Error('USE_PREPARE_OR_VERIFY_OR_PREFLIGHT');
 console.log(JSON.stringify(r,null,2));
} catch(e) {const details=e as Error&{code?:string;changed_fields?:string[]};const code=details.code||(e instanceof Error&&/^[A-Z][A-Z0-9_]{0,80}$/.test(e.message)?e.message:'LOCAL_VALIDATION_OR_IO_ERROR');console.error(JSON.stringify({status:'blocked',code,changed_fields:details.changed_fields||[],recovery_action:recoveryAction(code),publication_performed:false}));process.exitCode=1;}

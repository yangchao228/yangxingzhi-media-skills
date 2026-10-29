#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { prepareXhs, verifyXhs } from './xhs-sync.js';
import { recoveryAction } from './transfer-state.js';
import { collect } from './project.js';
import { json, readJson, sha } from './io.js';
import { preflightXhsBaseline } from './xhs-sync.js';
import { readEvidenceObservation, readObservation } from './remote-preflight.js';
import path from 'node:path';
import { migrateBaseline, readMigratedBaseline } from './baseline-migration.js';
try {
 const {values:v,positionals:p}=parseArgs({allowPositionals:true,options:{
  dir:{type:'string'},account:{type:'string'},'reuse-map':{type:'string'},'env-file':{type:'string'},
  evidence:{type:'string'},observation:{type:'string'},'baseline-evidence':{type:'string'},'from-version':{type:'string'},
  'migrated-baseline':{type:'boolean' as const},
 }});
 if(!v.dir||p.length!==1)throw new Error('DIR_AND_COMMAND_REQUIRED');
 if(v['migrated-baseline']&&v['baseline-evidence'])throw new Error('BASELINE_OPTIONS_CONFLICT');
 let r;
 if(p[0]==='prepare'&&v.account)r=prepareXhs(v.dir,{account:v.account,reuseMap:v['reuse-map'],envFile:v['env-file']});
 else if(p[0]==='verify'&&v.evidence)r=verifyXhs(v.dir,v.evidence);
 else if(p[0]==='migrate-baseline'&&v.observation&&v['from-version'])r=migrateBaseline(v.dir,'xiaohongshu',v['from-version'],v.observation);
 else if(p[0]==='preflight'&&v.observation&&v['migrated-baseline']) {
  const {baseline,...summary}=readMigratedBaseline(v.dir,'xiaohongshu',v.observation);r=summary;
 }
 else if(p[0]==='preflight'&&v.observation&&v['baseline-evidence']) {
  const data=collect(v.dir),plan=readJson(path.join(data.dir,'transfers','xiaohongshu',data.bundleVersion,'plan.json'));
  const baselineFile=v['baseline-evidence'];
  r=preflightXhsBaseline(plan,readEvidenceObservation(baselineFile,sha(json(plan))),readObservation(v.observation));
 }
 else throw new Error('USE_PREPARE_OR_VERIFY_OR_PREFLIGHT_OR_MIGRATE_BASELINE');
 console.log(JSON.stringify(r,null,2));
} catch(e) {const details=e as Error&{code?:string;changed_fields?:string[]};const code=details.code||(e instanceof Error&&/^[A-Z][A-Z0-9_]{0,80}$/.test(e.message)?e.message:'LOCAL_VALIDATION_OR_IO_ERROR');console.error(JSON.stringify({status:'blocked',code,changed_fields:details.changed_fields||[],recovery_action:recoveryAction(code),publication_performed:false}));process.exitCode=1;}

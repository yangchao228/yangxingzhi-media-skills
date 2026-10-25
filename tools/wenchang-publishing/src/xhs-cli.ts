#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { prepareXhs, verifyXhs } from './xhs-sync.js';
try {
 const {values:v,positionals:p}=parseArgs({allowPositionals:true,options:Object.fromEntries(['dir','account','reuse-map','env-file','evidence'].map(k=>[k,{type:'string' as const}]))});
 if(!v.dir||p.length!==1)throw new Error('DIR_AND_COMMAND_REQUIRED');
 let r;
 if(p[0]==='prepare'&&v.account)r=prepareXhs(v.dir,{account:v.account,reuseMap:v['reuse-map'],envFile:v['env-file']});
 else if(p[0]==='verify'&&v.evidence)r=verifyXhs(v.dir,v.evidence);
 else throw new Error('USE_PREPARE_OR_VERIFY');
 console.log(JSON.stringify(r,null,2));
} catch(e) {console.error(JSON.stringify({status:'blocked',code:e instanceof Error&&/^[A-Z_]+$/.test(e.message)?e.message:'LOCAL_VALIDATION_OR_IO_ERROR',publication_performed:false}));process.exitCode=1;}

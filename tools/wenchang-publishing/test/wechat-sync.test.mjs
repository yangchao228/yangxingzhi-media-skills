import {test} from 'node:test';
import assert from 'node:assert/strict';
import {apiRequest,verifyArticle,wechatUrl} from '../dist/wechat-sync.js';
const article={title:'正式稿',digest:'摘要',author:'作者',thumb_media_id:'cover',content:'<p>正文 &amp; 内容</p><img src="https://mmbiz.qpic.cn/mmbiz/one/0">'};
test('readback verifies title, digest, author, text, cover and images',()=>{
 assert.equal(Object.values(verifyArticle(article,{...article})).every(Boolean),true);
 const result=verifyArticle(article,{...article,content:'<p>正文 &amp; 内容</p>'});
 assert.equal(result.text,true);assert.equal(result.images,false);assert.equal(result.body_image_count,0);
 assert.equal(verifyArticle(article,{...article,thumb_media_id:'other'}).cover,false);
});
test('API allowlist forbids publish, deletion and arbitrary endpoints before network',async()=>{
 for(const endpoint of ['freepublish/submit','message/mass/sendall','draft/delete','../token'])
   await assert.rejects(apiRequest(endpoint,'secret',{},async()=>{throw new Error('must not run');}),/API_NOT_ALLOWED/);
});
test('API errors redact messages and uncertain writes are not retried',async()=>{
 let calls=0;
 await assert.rejects(apiRequest('draft/add','secret',{},async()=>{calls++;throw new Error('secret');}),/^Error: NETWORK_UNCERTAIN:draft\/add$/);
 assert.equal(calls,1);
 await assert.rejects(apiRequest('draft/get','secret',{},async()=>new Response(JSON.stringify({errcode:48001,errmsg:'private'}))),/^Error: WECHAT_48001:draft\/get$/);
});
test('image destinations must be WeChat media URLs',()=>{
 assert.equal(wechatUrl('https://mmbiz.qpic.cn/path'),true);
 for(const value of ['https://mmbiz.qpic.cn.evil.test/path','file:///tmp/foo','https://user@mmbiz.qpic.cn/path'])assert.equal(wechatUrl(value),false);
});

test('observed WeChat size and scheme rewrite preserves identity; wrong asset still fails',()=>{
 const expected={...article,content:'<p>正文</p><img src="http://mmbiz.qpic.cn/mmbiz/one/0?from=appmsg">'};
 assert.equal(verifyArticle(expected,{...expected,content:expected.content.replace('http:','https:').replace('/0?','/640?')}).images,true);
 assert.equal(verifyArticle(expected,{...expected,content:expected.content.replace('/one/','/wrong/')}).images,false);
});

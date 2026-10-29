import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const source=fs.readFileSync('worker/index.js','utf8');const mod=await import('data:text/javascript;base64,'+Buffer.from('const OWNER="owner@test.com";const SEED=[];const ASSETS={};'+source).toString('base64'));const worker=mod.default;
const origin='https://test.local';let saved=null,etag=0;
const env={BUCKET:{async get(){return saved?{etag:String(etag),json:async()=>structuredClone(saved)}:null},async put(key,value,options){if(saved&&options.onlyIf.etagMatches!==String(etag))return null;saved=JSON.parse(value);etag++;return {etag:String(etag)}}}};
function req(input,owner=true){return new Request(origin+'/api/content',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...(owner?{'oai-authenticated-user-id':'test-owner','oai-authenticated-user-email':'owner@test.com'}:{})},body:JSON.stringify(input)})}
const draft={kind:'upcoming',title:'測試活動',date:'2099-01-01',body:'說明'};
test('anonymous cannot write or inspect drafts',async()=>{assert.equal((await worker.fetch(req({action:'save',revision:0,draft},false),env)).status,403);assert.equal((await worker.fetch(new Request(origin+'/api/content/admin'),env)).status,403)});
test('draft approval, editing isolation, conflict and unpublish',async()=>{
 let r=await worker.fetch(req({action:'save',revision:0,draft}),env);let s=await r.json();assert.equal(s.items.length,1);const id=s.items[0].id;
 let pub=await (await worker.fetch(new Request(origin+'/api/content'),env)).json();assert.equal(pub.items.length,0);
 s=await (await worker.fetch(req({action:'approve',revision:1,id}),env)).json();
 pub=await (await worker.fetch(new Request(origin+'/api/content'),env)).json();assert.equal(pub.items[0].title,'測試活動');
 await worker.fetch(req({action:'save',revision:2,id,draft:{...draft,title:'修改草稿'}}),env);
 pub=await (await worker.fetch(new Request(origin+'/api/content'),env)).json();assert.equal(pub.items[0].title,'測試活動');
 assert.equal((await worker.fetch(req({action:'approve',revision:1,id}),env)).status,409);
 await worker.fetch(req({action:'unpublish',revision:3,id}),env);pub=await (await worker.fetch(new Request(origin+'/api/content'),env)).json();assert.equal(pub.items.length,0);
});
test('dates and category boundaries',()=>{assert.throws(()=>mod.validate({...draft,date:'2026-02-30'}));assert.throws(()=>mod.validate({...draft,date:'2000-01-01'},true));assert.throws(()=>mod.validate({...draft,kind:'record'},true));assert.doesNotThrow(()=>mod.validate({...draft,kind:'plan',date:'2000-01-01'},true));});
test('cross origin writes rejected',async()=>{const r=req({});r.headers.set('Origin','https://evil.test');assert.equal((await worker.fetch(r,env)).status,403)});

test('admin requires ChatGPT identity and uses supported return path',async()=>{
 const anonymous=await worker.fetch(new Request(origin+'/admin'),env);assert.equal(anonymous.status,302);assert.equal(anonymous.headers.get('Location'),origin+'/signin-with-chatgpt?return_to=%2Fadmin');
 const emailOnly=await worker.fetch(new Request(origin+'/api/content/admin',{headers:{'oai-authenticated-user-email':'owner@test.com'}}),env);assert.equal(emailOnly.status,403);
 const other=await worker.fetch(new Request(origin+'/admin',{headers:{'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@test.com'}}),env);assert.equal(other.status,403);
});
test('invalid field types rejected',()=>{assert.throws(()=>mod.validate({...draft,title:123}));assert.throws(()=>mod.validate({...draft,body:{}}));});

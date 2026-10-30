import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {buildNoticeArchive} from '../scripts/notice-archive.mjs';
const data=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(fs.readFileSync('src/data/site.ts','utf8'),{compilerOptions:{module:99,target:9}}).outputText).toString('base64'));
const archive=buildNoticeArchive(data.notices,data.noticeArchive);
const source=fs.readFileSync('worker/index.js','utf8');
const moduleFor=(seed=[])=>import('data:text/javascript;base64,'+Buffer.from('const OWNER="owner@test.com";const GROUP_IDS='+JSON.stringify(data.groups.map(x=>x.slug))+';const CATEGORY_IDS='+JSON.stringify(data.activityCategories.map(x=>x.id))+';const SEED='+JSON.stringify(seed)+';const ARCHIVE_SEED='+JSON.stringify(archive)+';const ASSETS={};'+source).toString('base64'));
const mod=await moduleFor();
const origin='https://test.local';
const owner={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@test.com'};
const request=(input)=>new Request(origin+'/api/content',{method:'POST',headers:{...owner,'Content-Type':'application/json',Origin:origin},body:JSON.stringify(input)});
function storage(initial=null){let state=structuredClone(initial),etag=initial?1:0,writes=0;return {get state(){return state},get writes(){return writes},BUCKET:{async get(){return state?{etag:String(etag),json:async()=>structuredClone(state)}:null},async put(key,value,opts){if(state?opts.onlyIf.etagMatches!==String(etag):opts.onlyIf.etagDoesNotMatch!=='*')return null;state=JSON.parse(value);etag++;writes++;return {etag:String(etag)}}}}}

test('all 45 sources have stable IDs, real date precision, units and topics',()=>{
 assert.equal(archive.length,45);assert.equal(new Set(archive.map(x=>x.id)).size,45);
 assert.equal(archive.filter(x=>x.draft.kind==='record').length,37);
 assert.equal(archive.filter(x=>x.draft.kind==='notice').length,7);
 assert.equal(archive.filter(x=>x.draft.kind==='upcoming').length,1);
 for(const item of archive){assert.doesNotThrow(()=>mod.validate(item.draft));assert.ok(item.draft.body.length);assert.ok(item.draft.sourceUrl);assert.equal(item.draft.legacySlugs.length,1);assert.ok(data.notices.some(x=>x.slug===item.draft.legacySlugs[0]&&x.date===item.draft.publishedDate));}
 const september=archive.find(x=>x.id==='archive-notice-70786').draft;
 assert.equal(september.date,'2026-09');assert.equal(september.datePrecision,'month');assert.equal(september.publishedDate,'2026-10-12');
 const camp=archive.find(x=>x.id==='archive-notice-10230').draft;
 assert.equal(camp.date,'2025-10');
 const sponsorship=archive.find(x=>x.id==='archive-notice-70769').draft;
 assert.equal(sponsorship.date,'');assert.equal(sponsorship.kind,'notice');assert.equal(sponsorship.links.length,2);
 assert.deepEqual(archive.find(x=>x.id==='archive-notice-70682').draft.groupIds,['kaohsiung','taichung']);
 assert.throws(()=>buildNoticeArchive(data.notices,{}));
});

test('migration persists once and preserves every saved draft, approval and hidden import',async()=>{
 const hidden={...structuredClone(archive[0]),version:8};delete hidden.published;delete hidden.approvedVersion;hidden.draft.body='使用者下架後保留的草稿';
 const initial={revision:12,items:[{id:'custom',draft:{kind:'plan',title:'自己的未核定資料',date:'2026-11-02'},version:5},hidden]};
 const env=storage(initial);
 let r=await mod.default.fetch(new Request(origin+'/api/content'),env);let pub=await r.json();
 assert.equal(env.writes,1);assert.equal(env.state.revision,13);assert.equal(env.state.items.length,46);
 assert.equal(pub.items.length,44);assert.ok(!pub.items.some(x=>x.id===hidden.id));
 assert.deepEqual(env.state.items[0],{...initial.items[0],draft:{...initial.items[0].draft,groupIds:[]}});
 assert.equal(env.state.items[1].draft.body,'使用者下架後保留的草稿');assert.equal(env.state.items[1].version,8);
 await mod.default.fetch(new Request(origin+'/api/content'),env);assert.equal(env.writes,1);
 // A stale editor must reload after the migration changes the shared revision.
 assert.equal((await mod.default.fetch(request({action:'save',revision:12,draft:archive[1].draft}),env)).status,409);
});

test('import edits remain drafts until approved, retain old URLs and links, and stay unpublished',async()=>{
 const env=storage();
 await mod.default.fetch(new Request(origin+'/api/content'),env);
 const id='archive-notice-70769',original=env.state.items.find(x=>x.id===id);
 let state=await (await mod.default.fetch(request({action:'save',revision:1,id,draft:{...original.draft,title:'修改甄選公告',category:'service',body:'本站更新內容'}}),env)).json();
 let pub=await (await mod.default.fetch(new Request(origin+'/api/content'),env)).json();
 assert.equal(pub.items.find(x=>x.id===id).title,original.published.title);
 state=await (await mod.default.fetch(request({action:'approve',revision:state.revision,id}),env)).json();
 pub=await (await mod.default.fetch(new Request(origin+'/api/content'),env)).json();
 const updated=pub.items.find(x=>x.id===id);assert.equal(updated.body,'本站更新內容');assert.equal(updated.category,'service');assert.deepEqual(updated.legacySlugs,['wyd-2027-sponsorship']);assert.equal(updated.links.length,2);
 await mod.default.fetch(request({action:'unpublish',revision:state.revision,id}),env);
 pub=await (await mod.default.fetch(new Request(origin+'/api/content'),env)).json();assert.ok(!pub.items.some(x=>x.id===id));assert.equal(env.state.items.length,45);
});

test('migration retries compare-and-swap conflicts and keeps the concurrent edit',async()=>{
 let state={revision:3,items:[]},etag=1,puts=0;
 const env={BUCKET:{async get(){return {etag:String(etag),json:async()=>structuredClone(state)}},async put(key,value,opts){puts++;if(puts===1){state={revision:4,items:[{id:'concurrent',version:9,draft:{title:'另一位管理者剛儲存',groupIds:['taipei']}}]};etag++;return null;}if(opts.onlyIf.etagMatches!==String(etag))return null;state=JSON.parse(value);etag++;return {etag:String(etag)}}}};
 const r=await mod.default.fetch(new Request(origin+'/api/content/admin',{headers:owner}),env);assert.equal(r.status,200);
 const result=await r.json();assert.equal(result.items.length,46);assert.equal(result.revision,5);assert.equal(result.items[0].draft.title,'另一位管理者剛儲存');assert.equal(result.items[0].version,9);assert.equal(puts,2);
});

test('partial dates never invent a day; event previews require full dates and unsafe links fail',()=>{
 const item=archive[0].draft;
 assert.equal(mod.validate(item,true).date,'2026-09');
 assert.throws(()=>mod.validate({...item,kind:'upcoming'}));
 assert.throws(()=>mod.validate({...item,date:'2026-13'}));
 assert.throws(()=>mod.validate({...item,date:'2026-09',endDate:'2026-09-30'}));
 assert.throws(()=>mod.validate({...item,sourceUrl:'javascript:alert(1)'}));
 assert.throws(()=>mod.validate({...item,links:[{label:'無效',url:'data:text/html,hi'}]}));
 assert.throws(()=>mod.validate({...item,category:'unknown-topic'}));
 assert.equal(mod.validate({...archive[1].draft,date:'',datePrecision:'unknown'},true).date,'');
});

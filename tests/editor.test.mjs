import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const source=fs.readFileSync('worker/index.js','utf8');const mod=await import('data:text/javascript;base64,'+Buffer.from('const OWNER="owner@test.com";const GROUP_IDS=["headquarters","taipei","taichung","kaohsiung","north-america","contemplation"];const SEED=[];const ARCHIVE_SEED=[];const CATEGORY_IDS=["other","formation","retreat","celebration","service","culture","affairs"];const ASSETS={};'+source).toString('base64'));const worker=mod.default;
const origin='https://test.local';let saved=null,etag=0;
const env={BUCKET:{async get(){return saved?{etag:String(etag),json:async()=>structuredClone(saved)}:null},async put(key,value,options){if(saved&&options.onlyIf.etagMatches!==String(etag))return null;saved=JSON.parse(value);etag++;return {etag:String(etag)}}}};
function req(input,owner=true){return new Request(origin+'/api/content',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...(owner?{'oai-authenticated-user-id':'test-owner','oai-authenticated-user-email':'owner@test.com'}:{})},body:JSON.stringify(input)})}
const draft={kind:'upcoming',groupIds:['taipei'],title:'測試活動',date:'2099-01-01',body:'說明'};
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

test('attachments follow draft approval and can be removed without losing existing links', async () => {
 const pdf = { label: ' 活動簡章 ', url: 'https://drive.google.com/file/d/sample-id/view?resourcekey=0-demo', kind: 'pdf' };
 const file = { label: '報名表', url: 'https://example.com/form.docx', kind: 'file' };
 const links = [{ label: '原始來源', url: 'https://example.com/source' }];
 const pdfPreview = 'https://drive.google.com/file/d/sample-id/preview?resourcekey=0-demo';
 let value = null;
 const env = { BUCKET: {
  async get() { return value ? { etag: 'current', json: async () => structuredClone(value) } : null; },
  async put(key, data) { value = JSON.parse(data); return { etag: 'current' }; },
 } };
 const write = async input => {
  const response = await worker.fetch(req(input), env);
  assert.equal(response.status, 200);
  return response.json();
 };
 const publicItems = async () => (await (await worker.fetch(new Request(origin + '/api/content'), env)).json()).items;

 const state = await write({ action: 'save', revision: 0, draft: { ...draft, links, attachments: [pdf, file] } });
 const id = state.items[0].id;
 assert.deepEqual(await publicItems(), []);
 await write({ action: 'approve', revision: 1, id });
 assert.deepEqual((await publicItems())[0].attachments, [{ ...pdf, label: '活動簡章', previewUrl: pdfPreview }, file]);
 await write({ action: 'save', revision: 2, id, draft: { ...draft, links, attachments: [] } });
 assert.equal((await publicItems())[0].attachments.length, 2);
 await write({ action: 'approve', revision: 3, id });
 const [published] = await publicItems();
 assert.equal(published.attachments, undefined);
 assert.deepEqual(published.links, links);
});

test('attachment validation accepts only HTTPS links and constructs trusted PDF previews', () => {
 const pdf = { label: '活動簡章', url: 'https://drive.google.com/open?id=sample-id', kind: 'pdf' };
 const result = mod.validate({ ...draft, attachments: [{ ...pdf, previewUrl: 'https://example.com/' }] });
 assert.equal(result.attachments[0].previewUrl, 'https://drive.google.com/file/d/sample-id/preview');
 for (const attachment of [
  { ...pdf, kind: 'file', url: 'javascript:alert(1)' },
  { ...pdf, url: 'https://drive.google.com.evil.test/file/d/sample-id/view' },
  { ...pdf, url: 'https://drive.google.com/drive/folders/sample-id' },
  { ...pdf, url: 'https://name:password@drive.google.com/file/d/sample-id/view' },
  { ...pdf, label: ' ' },
 ]) assert.throws(() => mod.validate({ ...draft, attachments: [attachment] }));
 assert.throws(() => mod.validate({ ...draft, attachments: Array(11).fill(pdf) }));
});

test('unit validation rejects unknown, empty and duplicate units',()=>{
 for(const groupIds of [[],['unknown'],['taipei','taipei'],'taipei',[123]])assert.throws(()=>mod.validate({...draft,groupIds}));
 assert.deepEqual(mod.validate({...draft,groupIds:['headquarters','taipei','taichung']}).groupIds,['headquarters','taipei','taichung']);
});

test('unit changes remain drafts until approval, including joint activities',async()=>{
 let value=null;
 const bucket={async get(){return value?{etag:'current',json:async()=>structuredClone(value)}:null},async put(key,data){value=JSON.parse(data);return {etag:'current'}}};
 const isolated={BUCKET:bucket};
 let state=await (await worker.fetch(req({action:'save',revision:0,draft:{...draft,groupIds:['taipei','taichung']}}),isolated)).json();
 const id=state.items[0].id;
 await worker.fetch(req({action:'approve',revision:1,id}),isolated);
 await worker.fetch(req({action:'save',revision:2,id,draft:{...draft,groupIds:['north-america']}}),isolated);
 let publicItems=await (await worker.fetch(new Request(origin+'/api/content'),isolated)).json();
 assert.deepEqual(publicItems.items[0].groupIds,['taipei','taichung']);
 await worker.fetch(req({action:'approve',revision:3,id}),isolated);
 publicItems=await (await worker.fetch(new Request(origin+'/api/content'),isolated)).json();
 assert.deepEqual(publicItems.items[0].groupIds,['north-america']);
});

test('old stored plans recover source units without replacing saved content or state',async()=>{
 const seed=[{id:'plan-known',draft:{groupIds:['headquarters','taipei','taichung']},published:{groupIds:['headquarters','taipei','taichung']}}];
 const legacyMod=await import('data:text/javascript;base64,'+Buffer.from('const OWNER="owner@test.com";const GROUP_IDS=["headquarters","taipei","taichung"];const SEED='+JSON.stringify(seed)+';const ARCHIVE_SEED=[];const CATEGORY_IDS=["other"];const ASSETS={};'+source).toString('base64'));
 const legacy={revision:42,items:[
  {id:'plan-known',version:8,approvedVersion:7,draft:{kind:'plan',title:'已修改的草稿'},published:{kind:'plan',title:'保留公開內容'}},
  {id:'custom-unknown',version:3,draft:{kind:'record',title:'未發佈舊草稿'}},
  {id:'plan-explicit',version:2,draft:{kind:'plan',title:'手動分類',groupIds:['taipei']}}
 ]};
 const before=structuredClone(legacy);
 const env={BUCKET:{async get(){return {etag:'unchanged',json:async()=>structuredClone(legacy)}},async put(){assert.fail('GET must not write stored content')}}};
 const response=await legacyMod.default.fetch(new Request(origin+'/api/content/admin',{headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@test.com'}}),env);
 const result=await response.json();
 assert.equal(result.revision,42);assert.equal(result.items.length,3);
 assert.equal(result.items[0].draft.title,'已修改的草稿');assert.equal(result.items[0].published.title,'保留公開內容');
 assert.equal(result.items[0].version,8);assert.equal(result.items[0].approvedVersion,7);
 assert.deepEqual(result.items[0].draft.groupIds,['headquarters','taipei','taichung']);
 assert.deepEqual(result.items[0].published.groupIds,['headquarters','taipei','taichung']);
 assert.deepEqual(result.items[1].draft.groupIds,[]);assert.equal(result.items[1].published,undefined);
 assert.deepEqual(result.items[2].draft.groupIds,['taipei']);assert.deepEqual(legacy,before);
});

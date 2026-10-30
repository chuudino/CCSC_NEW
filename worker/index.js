const KEY='ccsc-editor-v1.json';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date());
export function validate(d,approve=false){
 if(!d||typeof d!=='object')throw Error('請填寫活動內容');
 for(const key of ['title','date','endDate','location','body','category','datePrecision','dateNote','publishedDate','sourceUrl'])if(d[key]!==undefined&&typeof d[key]!=='string')throw Error('內容欄位格式不正確');
 if(!['upcoming','record','plan','notice'].includes(d.kind))throw Error('請選擇內容類別');
 if(!Array.isArray(d.groupIds)||!d.groupIds.length||d.groupIds.length>GROUP_IDS.length||d.groupIds.some(id=>typeof id!=='string'||!GROUP_IDS.includes(id))||new Set(d.groupIds).size!==d.groupIds.length)throw Error('請選擇有效的所屬單位（可複選）');
 if(typeof d.title!=='string'||!d.title.trim()||d.title.length>180)throw Error('標題必填，最多180字');
 const precision=d.datePrecision||'day',category=d.category||'other';
 const day=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 if(!CATEGORY_IDS.includes(category))throw Error('請選擇有效的活動主題');
 if(!['day','month','year','unknown'].includes(precision))throw Error('日期精確度不正確');
 if(['upcoming','plan'].includes(d.kind)&&precision!=='day')throw Error('活動預告與年度計劃須有完整日期');
 if(!(precision==='day'?day(d.date):precision==='month'?/^\d{4}-(0[1-9]|1[0-2])$/.test(d.date):precision==='year'?/^[1-9]\d{3}$/.test(d.date):d.date===''))throw Error('請依日期精確度填寫有效日期');
 if(d.endDate&&(precision!=='day'||!day(d.endDate)||d.endDate<d.date))throw Error('結束日期不能早於開始日期，且須使用完整日期');
 if(d.publishedDate&&!day(d.publishedDate))throw Error('請填寫有效原始發文日期');
 if((d.dateNote||'').length>500)throw Error('日期說明過長');
 const safeUrl=value=>{try{return ['https:','http:'].includes(new URL(value).protocol)}catch{return false}};
 if(d.sourceUrl&&!safeUrl(d.sourceUrl))throw Error('來源網址格式不正確');
 if(d.links!==undefined&&(!Array.isArray(d.links)||d.links.length>20||d.links.some(x=>!x||typeof x.label!=='string'||x.label.length>200||!safeUrl(x.url))))throw Error('參考連結格式不正確');
 for(const key of ['legacySlugs','sourceKeys'])if(d[key]!==undefined&&(!Array.isArray(d[key])||d[key].length>20||d[key].some(x=>typeof x!=='string'||x.length>200||!x)))throw Error('來源識別格式不正確');
 if((d.body||'').length>20000||(d.location||'').length>300)throw Error('內容過長');
 if(approve&&d.kind==='upcoming'&&(d.endDate||d.date)<today())throw Error('活動已結束，請另建立活動記錄');
 if(approve&&d.kind==='record'&&d.date>today().slice(0,d.date.length))throw Error('尚未發生的活動不可核定為活動記錄');
 return {kind:d.kind,groupIds:[...d.groupIds],title:d.title.trim(),date:d.date,endDate:d.endDate||'',location:d.location||'',body:d.body||'',category,datePrecision:precision,dateNote:d.dateNote||'',publishedDate:d.publishedDate||'',...(d.sourceUrl?{sourceUrl:d.sourceUrl}:{}),...(d.links?{links:d.links}:{}),...(d.legacySlugs?{legacySlugs:d.legacySlugs}:{}),...(d.sourceKeys?{sourceKeys:d.sourceKeys}:{})};
}
// Older saved items retain their content and workflow state; only known plan IDs recover source units.
export function withGroups(state){
 const seedById=new Map(SEED.map(item=>[item.id,item]));
 const normalize=(value,seed)=>value?{...value,groupIds:value.groupIds??seed?.groupIds??[]}:value;
 return {...state,items:state.items.map(item=>{const seed=seedById.get(item.id);return {...item,draft:normalize(item.draft,seed?.draft),...(item.published?{published:normalize(item.published,seed?.published)}:{})};})};
}
// Append only missing, already-public source records. Never replace user drafts or approvals.
export function withArchive(state){
 const ids=new Set(state.items.map(x=>x.id));
 const sources=new Set(state.items.flatMap(x=>[...(x.draft?.sourceKeys||[]),...(x.published?.sourceKeys||[])]));
 const slugs=new Set(state.items.flatMap(x=>[...(x.draft?.legacySlugs||[]),...(x.published?.legacySlugs||[])]));
 const missing=ARCHIVE_SEED.filter(x=>!ids.has(x.id)&&!x.draft.sourceKeys.some(key=>sources.has(key))&&!x.draft.legacySlugs.some(slug=>slugs.has(slug)));
 return missing.length?{...state,revision:state.revision+1,items:[...state.items,...structuredClone(missing)]}:state;
}
async function readState(bucket){
 for(let attempt=0;attempt<3;attempt++){
  const obj=await bucket.get(KEY);
  const current=withGroups(obj?await obj.json():{revision:0,items:structuredClone(SEED)});
  const state=withArchive(current);
  if(state===current)return {state,obj};
  // A deployment migration uses the same compare-and-swap as editor writes.
  const result=await bucket.put(KEY,JSON.stringify(state),{onlyIf:obj?{etagMatches:obj.etag}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
  if(result)return {state,obj:result};
 }
 throw Error('內容同時更新中，請重新載入');
}
export default {async fetch(req,env){
 const url=new URL(req.url), path=url.pathname;
 const owner=Boolean(req.headers.get('oai-authenticated-user-id'))&&req.headers.get('oai-authenticated-user-email')?.toLowerCase()===OWNER.toLowerCase();
 if(path.startsWith('/api/content')){
  try{
   const admin=path==='/api/content/admin';
   if(admin&&!owner)return json({error:'請使用網站管理者帳號登入'},403);
   if(req.method!=='GET'&&!owner)return json({error:'無權編輯或核定'},403);
   if(!env.BUCKET)return json({error:'內容儲存服務尚未就緒'},503);
   const {state,obj}=await readState(env.BUCKET);
   if(req.method==='GET')return json(admin?state:{items:state.items.filter(x=>x.published).map(x=>({id:x.id,...x.published}))});
   if(req.method!=='POST')return json({error:'不支援此操作'},405);
   if(req.headers.get('Origin')!==url.origin)return json({error:'請從本站操作'},403);
   const input=await req.json();
   if(input.revision!==state.revision)return json({error:'內容已由其他操作更新，請重新載入再編輯'},409);
   let item=state.items.find(x=>x.id===input.id);
   if(input.action==='save'){
    const draft=validate(input.draft);
    if(!item){item={id:crypto.randomUUID(),draft,version:0};state.items.push(item);}
    item.draft=draft;item.version++;item.updatedAt=new Date().toISOString();item.updatedBy=OWNER;
   }else if(input.action==='approve'){
    if(!item)return json({error:'找不到草稿'},404);
    item.published=validate(item.draft,true);item.publishedAt=new Date().toISOString();item.approvedVersion=item.version;
   }else if(input.action==='unpublish'){
    if(!item)return json({error:'找不到內容'},404);
    delete item.published;delete item.approvedVersion;
   }else return json({error:'不支援此操作'},400);
   state.revision++;
   const result=await env.BUCKET.put(KEY,JSON.stringify(state),{onlyIf:obj?{etagMatches:obj.etag}:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/json'}});
   if(!result)return json({error:'同時有人更新，請重新載入'},409);
   return json(state);
  }catch(e){return json({error:e.message||'儲存失敗'},400);}
 }
 if((path==='/admin'||path==='/admin/')&&!owner){
  if(!req.headers.get('oai-authenticated-user-id'))return Response.redirect(url.origin+'/signin-with-chatgpt?return_to=%2Fadmin',302);
  return new Response('此頁僅供網站管理者使用',{status:403,headers:{'content-type':'text/plain;charset=utf-8'}});
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const asset=ASSETS[path]||(!path.startsWith('/assets/')?ASSETS['/index.html']:null);
 if(!asset)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(req.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':path.startsWith('/assets/')?'public,max-age=31536000,immutable':'no-store'}});
}};

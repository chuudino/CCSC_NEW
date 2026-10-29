const KEY='ccsc-editor-v1.json';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei'}).format(new Date());
export function validate(d,approve=false){
 if(!d||typeof d!=='object')throw Error('請填寫活動內容');
 for(const key of ['title','date','endDate','location','body'])if(d[key]!==undefined&&typeof d[key]!=='string')throw Error('內容欄位格式不正確');
 if(!['upcoming','record','plan'].includes(d.kind))throw Error('請選擇內容類別');
 if(!Array.isArray(d.groupIds)||!d.groupIds.length||d.groupIds.length>GROUP_IDS.length||d.groupIds.some(id=>typeof id!=='string'||!GROUP_IDS.includes(id))||new Set(d.groupIds).size!==d.groupIds.length)throw Error('請選擇有效的所屬單位（可複選）');
 if(typeof d.title!=='string'||!d.title.trim()||d.title.length>180)throw Error('標題必填，最多180字');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Number.isFinite(Date.parse(d.date))||new Date(d.date).toISOString().slice(0,10)!==d.date)throw Error('請填寫有效活動日期');
 if(d.endDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.endDate)||!Number.isFinite(Date.parse(d.endDate))||new Date(d.endDate).toISOString().slice(0,10)!==d.endDate||d.endDate<d.date))throw Error('結束日期不能早於開始日期');
 if((d.body||'').length>20000||(d.location||'').length>300)throw Error('內容過長');
 if(approve&&d.kind==='upcoming'&&(d.endDate||d.date)<today())throw Error('活動已結束，請另建立活動記錄');
 if(approve&&d.kind==='record'&&d.date>today())throw Error('尚未發生的活動不可核定為活動記錄');
 return {kind:d.kind,groupIds:[...d.groupIds],title:d.title.trim(),date:d.date,endDate:d.endDate||'',location:d.location||'',body:d.body||''};
}
// Older saved items retain their content and workflow state; only known plan IDs recover source units.
export function withGroups(state){
 const seedById=new Map(SEED.map(item=>[item.id,item]));
 const normalize=(value,seed)=>value?{...value,groupIds:value.groupIds??seed?.groupIds??[]}:value;
 return {...state,items:state.items.map(item=>{const seed=seedById.get(item.id);return {...item,draft:normalize(item.draft,seed?.draft),...(item.published?{published:normalize(item.published,seed?.published)}:{})};})};
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
   const obj=await env.BUCKET.get(KEY);
   const state=withGroups(obj?await obj.json():{revision:0,items:structuredClone(SEED)});
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

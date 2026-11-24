const crypto=require('crypto');
const SB=process.env.SUPABASE_URL,KEY=process.env.SUPABASE_KEY,TOKEN=process.env.BOT_TOKEN;
async function sb(path,opt){
const o=opt||{};
const h=Object.assign({apikey:KEY,'Content-Type':'application/json'},o.headers||{});
if(KEY&&KEY.indexOf('eyJ')===0)h.Authorization='Bearer '+KEY;
const r=await fetch(SB+'/rest/v1/'+path,{method:o.method||'GET',headers:h,body:o.body});
const t=await r.text();
if(!r.ok)throw new Error(r.status+' '+t);
return{data:t?JSON.parse(t):null,range:r.headers.get('content-range')};
}
function verify(initData){
if(!initData||!TOKEN)return null;
const p=new URLSearchParams(initData),hash=p.get('hash');
p.delete('hash');
const s=Array.from(p.entries()).sort(function(a,b){return a[0]<b[0]?-1:1}).map(function(e){return e[0]+'='+e[1]}).join('\n');
const secret=crypto.createHmac('sha256','WebAppData').update(TOKEN).digest();
const h=crypto.createHmac('sha256',secret).update(s).digest('hex');
if(!hash||hash.length!==h.length||!crypto.timingSafeEqual(Buffer.from(h),Buffer.from(hash)))return null;
if(Date.now()/1000-Number(p.get('auth_date')||0)>172800)return null;
try{const u=JSON.parse(p.get('user'));if(!u||!u.id)return null;return{user:u,start:p.get('start_param')||''}}catch(e){return null}
}
function body(req){const b=req.body;if(typeof b==='string'){try{return JSON.parse(b)}catch(e){return{}}}return b||{}}
module.exports={sb,verify,body};

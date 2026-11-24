module.exports=async function(req,res){
const U=process.env.SUPABASE_URL||'',K=process.env.SUPABASE_KEY||'',T=process.env.BOT_TOKEN||'';
const o={url_ok:/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(U),url_len:U.length,key_start:K.slice(0,3),key_len:K.length,key_space:K!==K.trim(),token_ok:/^\d+:[A-Za-z0-9_-]{30,}$/.test(T),token_len:T.length,token_space:T!==T.trim()};
try{
const h={apikey:K};
if(K.indexOf('eyJ')===0)h.Authorization='Bearer '+K;
const r=await fetch(U.trim()+'/rest/v1/players?select=tg_id&limit=1',{headers:h});
o.db_status=r.status;
o.db_reply=(await r.text()).slice(0,120);
}catch(e){o.db_error=String(e.message||e).slice(0,100)}
res.status(200).json(o);
};

const{sb,verify,body}=require('../lib/gg.js');
const RATE=10,CAP=60000,REF=5000,NEW=2500;
function n(x,d){x=Number(x);return isFinite(x)&&x>=0?Math.floor(x):d}
module.exports=async function(req,res){
try{
const b=body(req),v=verify(b.initData);
if(!v)return res.status(401).json({error:'auth'});
const u=v.user,id=u.id,now=Date.now();
const st=b.state&&typeof b.state==='object'?b.state:null;
const base={first_name:String(u.first_name||'').slice(0,40),username:String(u.username||'').slice(0,40)};
let row=(await sb('players?tg_id=eq.'+id+'&select=*')).data[0],isNew=false;
if(!row){
const t0=st?Math.min(n(st.total,0),CAP):0,c0=st?Math.min(n(st.coins,0),t0):0;
const m=/^ref_(\d+)$/.exec(v.start||''),ref=m&&Number(m[1])!==id?Number(m[1]):null;
const rec=Object.assign({tg_id:id,coins:c0,total:t0,state:st,budget:CAP-t0,last_sync:new Date().toISOString()},base);
try{row=(await sb('players',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(rec)})).data[0];isNew=true}
catch(e){row=(await sb('players?tg_id=eq.'+id+'&select=*')).data[0];if(!row)throw e}
if(isNew&&ref){
const r=await sb('rpc/credit_referrer',{method:'POST',body:JSON.stringify({ref:ref,amt:REF})});
if(r.data===true){await sb('players?tg_id=eq.'+id,{method:'PATCH',body:JSON.stringify({referrer:ref,pending_bonus:NEW})});row.pending_bonus=NEW}
}
}
let total,coins,budget=Number(row.budget);
if(isNew||b.init){total=Number(row.total);coins=Number(row.coins)}
else{
const dt=Math.max(0,(now-new Date(row.last_sync).getTime())/1000);
budget=Math.min(CAP,budget+RATE*dt);
const old=Number(row.total),inc=Math.max(0,n(st&&st.total,old)-old),ok=Math.min(inc,Math.floor(budget));
total=old+ok;coins=Math.min(n(st&&st.coins,Number(row.coins)),Number(row.coins)+ok);budget-=ok;
}
const bonus=Number(row.pending_bonus)||0;
total+=bonus;coins+=bonus;
const patch=Object.assign({coins:coins,total:total,budget:budget,last_sync:new Date().toISOString(),pending_bonus:0},base);
if(!b.init&&!isNew&&st)patch.state=st;
await sb('players?tg_id=eq.'+id,{method:'PATCH',body:JSON.stringify(patch)});
res.status(200).json({coins:coins,total:total,bonus:bonus,refs:row.ref_count||0,state:(isNew||b.init)?row.state:null});
}catch(e){res.status(500).json({error:'server'})}
};

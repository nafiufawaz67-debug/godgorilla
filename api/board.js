const{sb,verify,body}=require('../lib/gg.js');
module.exports=async function(req,res){
try{
const v=verify(body(req).initData);
if(!v)return res.status(401).json({error:'auth'});
const top=(await sb('players?select=tg_id,first_name,username,total&order=total.desc&limit=20')).data;
const me=(await sb('players?tg_id=eq.'+v.user.id+'&select=total,ref_count')).data[0];
let rank=null,refs=0;
if(me){
const r=await sb('players?select=tg_id&total=gt.'+me.total+'&limit=1',{headers:{Prefer:'count=exact'}});
rank=Number(String(r.range||'').split('/')[1])+1;refs=me.ref_count||0;
}
res.status(200).json({rank:rank,refs:refs,top:top.map(function(p){return{n:p.first_name||p.username||'Gorilla',t:p.total,me:p.tg_id===v.user.id}})});
}catch(e){res.status(500).json({error:'server'})}
};

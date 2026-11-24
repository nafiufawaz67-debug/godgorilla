(function(){
var tg=window.Telegram&&window.Telegram.WebApp;
if(typeof S==='undefined'||!tg||!tg.initData)return;
var busy=false,ready=false;
function post(u,b){b.initData=tg.initData;return fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b),keepalive:true}).then(function(r){if(!r.ok)throw 0;return r.json()})}
function snap(){var o={};for(var k in S)o[k]=S[k];return o}
window.ggPost=post;
post('/api/sync',{init:true,state:snap()}).then(function(d){
var m=d.state;
if(m){for(var k in m)S[k]=m[k]}
S.coins=d.coins;S.total=d.total;
S.energy=Math.min(maxE(),(Number(S.energy)||0)+Math.max(0,(Date.now()-(Number(S.ts)||Date.now()))/1000)*regen());
S.ts=Date.now();
save();renderHud();ready=true;
if(d.bonus>0)toast('🎁 Bonus +'+fmt(d.bonus)+' coins!');
}).catch(function(){});
function sync(){
if(busy||!ready)return;
busy=true;
var c=S.coins,t=S.total;
post('/api/sync',{state:snap()}).then(function(d){
S.coins=d.coins+(S.coins-c);S.total=d.total+(S.total-t);
if(d.bonus>0)toast('🎁 Bonus +'+fmt(d.bonus)+' coins!');
save();renderHud();
}).catch(function(){}).then(function(){busy=false});
}
setInterval(sync,10000);
document.addEventListener('visibilitychange',function(){if(document.hidden)sync()});
})();

(function(){
if(typeof S==='undefined')return;
var H=3600000,CAP=3,MAXL=10;
function B(){if(!S.bot)S.bot={lvl:0,last:Date.now()};return S.bot}
function rate(l){return 500*l}
function bcost(l){return 2000*Math.pow(2,l)}
function pending(){var b=B();if(b.lvl<1)return 0;return Math.floor(rate(b.lvl)*Math.min(CAP,(Date.now()-b.last)/H))}
function card(){
var b=B(),p=pending(),mx=b.lvl>=MAXL;
var info=b.lvl?'Earns '+fmt(rate(b.lvl))+'/hr (max '+CAP+'h) · ready: <span id="botPending">'+fmt(p)+'</span>':'Earns coins while you are away';
if(!mx)info+='<br>'+(b.lvl?'Upgrade':'Buy')+': 🪙 '+fmt(bcost(b.lvl));
return '<div class="card"><div class="ic">🤖</div><div class="tx"><b>Gorilla Bot · Lv '+b.lvl+'</b><small>'+info+'</small></div><div style="display:flex;flex-direction:column;gap:6px">'+(b.lvl?'<button id="botClaim">Claim</button>':'')+(mx?'':'<button class="sec" id="botBuy">'+(b.lvl?'Upgrade':'Buy')+'</button>')+'</div></div>';
}
var rb=renderBoost;
renderBoost=function(){
rb();
var l=document.getElementById('boostList');if(!l)return;
l.insertAdjacentHTML('beforeend',card());
var cl=document.getElementById('botClaim'),by=document.getElementById('botBuy');
if(cl)cl.onclick=function(){var p=pending();if(p<1)return toast('Nothing to claim yet');S.coins+=p;S.total+=p;B().last=Date.now();save();renderHud();renderBoost();toast('+'+fmt(p)+' coins from your bot')};
if(by)by.onclick=function(){var b=B(),c=bcost(b.lvl);if(S.coins<c)return toast('Not enough coins');var p=pending();S.coins+=p-c;S.total+=p;b.lvl++;b.last=Date.now();save();renderHud();renderBoost();toast('Gorilla Bot upgraded!')};
};
setTimeout(function(){var p=pending();if(p>=1)toast('🤖 Your bot earned '+fmt(p)+' coins. Claim in Boost!')},1500);
setInterval(function(){var e=document.getElementById('botPending');if(e)e.textContent=fmt(pending())},1000);
})();

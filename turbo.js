(function(){
if(typeof S==='undefined')return;
var DUR=15000,MULT=5,MAXD=3,snap=0;
function T(){var t=S.turbo;if(!t||t.day!==dayStr()){t=S.turbo={day:dayStr(),used:0,until:0}}return t}
function on(){return T().until>Date.now()}
window.addEventListener('pointerdown',function(){snap=S.coins},true);
var coin=document.getElementById('coin');
if(coin)coin.addEventListener('pointerdown',function(){
if(!on())return;
var g=S.coins-snap,x;
if(g>0){x=g*(MULT-1);S.energy=Math.min(maxE(),S.energy+g);S.coins+=x;S.total+=x}
else{x=S.multi*MULT;S.coins+=x;S.total+=x}
renderHud();
});
var bn=document.createElement('div');
bn.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);background:linear-gradient(#ff9d00,#ff5e00);color:#fff;font-weight:900;padding:6px 16px;border-radius:20px;z-index:25;display:none;box-shadow:0 0 20px #ff9d00';
document.body.appendChild(bn);
setInterval(function(){var l=T().until-Date.now();if(l>0){bn.style.display='block';bn.textContent='🔥 TURBO x'+MULT+' · '+Math.ceil(l/1000)+'s'}else bn.style.display='none'},250);
function card(){
var t=T(),left=MAXD-t.used;
return '<div class="card"><div class="ic">🔥</div><div class="tx"><b>Turbo</b><small>x'+MULT+' coins for '+DUR/1000+'s, no energy used · '+left+'/'+MAXD+' today</small></div><button id="turboBtn"'+(left<1||on()?' disabled':'')+'>Go</button></div>';
}
var rb=renderBoost;
renderBoost=function(){
rb();
var l=document.getElementById('boostList');if(!l)return;
l.insertAdjacentHTML('beforeend',card());
var b=document.getElementById('turboBtn');
if(b)b.onclick=function(){var t=T();if(t.used>=MAXD||on())return;t.used++;t.until=Date.now()+DUR;save();var n=document.querySelector('nav button[data-s=tap]');if(n)n.click();toast('🔥 Turbo on! Tap fast!')};
};
})();

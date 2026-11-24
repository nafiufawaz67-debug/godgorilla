(function(){
if(typeof S==='undefined')return;
var AC=null,snd=true,last=0,li=leagueIdx();
try{snd=localStorage.getItem('gg_snd')!=='0'}catch(e){}
function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC&&AC.state==='suspended')AC.resume();return AC}
function beep(f,d,t,v){if(!snd)return;var c=ctx();if(!c)return;var o=c.createOscillator(),g=c.createGain();o.type=t||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||0.05,c.currentTime);g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d)}
function spark(x,y){var e=document.createElement('div');e.textContent='🪙';e.style.cssText='position:fixed;left:'+x+'px;top:'+y+'px;font-size:18px;pointer-events:none;z-index:19;transition:transform .7s ease-out,opacity .7s;opacity:1';document.body.appendChild(e);void e.offsetWidth;e.style.transform='translate('+((Math.random()-.5)*120)+'px,'+(-60-Math.random()*80)+'px) rotate('+(Math.random()*360)+'deg)';e.style.opacity='0';setTimeout(function(){e.remove()},750)}
var st=document.createElement('style');
st.textContent='#coin.turbo{border-color:#ff7a00!important;box-shadow:0 0 60px #ff7a00,inset 0 0 30px rgba(0,0,0,.5)!important;animation:gp .5s infinite alternate}@keyframes gp{to{box-shadow:0 0 95px #ff4d00,inset 0 0 30px rgba(0,0,0,.5)}}';
document.head.appendChild(st);
var coin=document.getElementById('coin');
if(coin)coin.addEventListener('pointerdown',function(e){
var n=Date.now();if(n-last<60)return;last=n;
spark(e.clientX,e.clientY);
var tb=S.turbo&&S.turbo.until>n;
beep(tb?900+Math.random()*200:480+Math.random()*120,0.07,tb?'square':'triangle',tb?0.03:0.05);
});
setInterval(function(){
if(coin)coin.classList.toggle('turbo',!!(S.turbo&&S.turbo.until>Date.now()));
var i=leagueIdx();
if(i>li){toast('🏆 New league: '+LEAGUES[i][1]+'!');[523,659,784,1046].forEach(function(f,k){setTimeout(function(){beep(f,0.18,'sine',0.06)},k*120)})}
li=i;
},400);
var sb=document.createElement('button');
sb.className='sec';
sb.style.cssText='position:fixed;top:42px;right:8px;z-index:24;padding:6px 10px;font-size:16px';
function sl(){sb.textContent=snd?'🔊':'🔇'}
sl();
sb.onclick=function(){snd=!snd;try{localStorage.setItem('gg_snd',snd?'1':'0')}catch(e){}sl();if(snd)beep(660,0.1)};
document.body.appendChild(sb);
})();

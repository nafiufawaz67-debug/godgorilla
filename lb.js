(function(){
var tg=window.Telegram&&window.Telegram.WebApp;
if(typeof S==='undefined'||!tg||!tg.initData)return;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var rf=renderFriends;
renderFriends=function(){
rf();
var el=document.getElementById('friends');if(!el)return;
var link='https://t.me/'+BOT+'/God_Gorilla?startapp=ref_'+user.id;
document.getElementById('reflink').textContent=link;
document.getElementById('copyBtn').onclick=function(){if(navigator.clipboard)navigator.clipboard.writeText(link).then(function(){toast('Link copied')},function(){toast(link)});else toast(link)};
document.getElementById('shareBtn').onclick=function(){tg.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(link)+'&text='+encodeURIComponent('Tap with me in God Gorilla 🦍👑 and earn $GGOD!'))};
var nt=el.querySelector('.note');if(nt)nt.textContent='Invite friends: you get 5,000 coins and they get 2,500 coins when they join.';
if(!window.ggPost)return;
var box=document.getElementById('ggBoard');
if(!box){box=document.createElement('div');box.id='ggBoard';el.appendChild(box)}
box.innerHTML='<p class="sub">Loading leaderboard…</p>';
window.ggPost('/api/board',{}).then(function(d){
var h='<h2>🏆 Top Gorillas</h2><p class="sub">Your rank: #'+(d.rank||'-')+' · Friends invited: '+d.refs+'</p>';
d.top.forEach(function(p,i){h+='<div class="card"'+(p.me?' style="border:1px solid #ffc928"':'')+'><div class="ic">'+(i<3?['🥇','🥈','🥉'][i]:(i+1))+'</div><div class="tx"><b>'+esc(p.n)+'</b></div><b>'+fmt(p.t)+'</b></div>'});
box.innerHTML=h;
}).catch(function(){box.innerHTML='<p class="note">Leaderboard unavailable.</p>'});
};
})();

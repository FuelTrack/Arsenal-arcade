/* Higher or Lower 2.0 - historical snapshot, not live stats */
(function(){
const records=[
{name:'Thierry Henry',goals:175,appearances:258},
{name:'Dennis Bergkamp',goals:87,appearances:315},
{name:'Patrick Vieira',goals:29,appearances:279},
{name:'Theo Walcott',goals:62,appearances:247},
{name:'Aaron Ramsey',goals:37,appearances:244},
{name:'Tony Adams',goals:12,appearances:255},
{name:'Lee Dixon',goals:10,appearances:305},
{name:'Martin Keown',goals:4,appearances:310},
{name:'Ray Parlour',goals:21,appearances:333},
{name:'David Seaman',goals:0,appearances:325}
];
const source='https://www.statbunker.com/alltimestats/AllTimeAppearances?club_id=5&comp_code=EPL';
let mode='goals',deck=[],step=0,points=0,locked=false,daily=false;
const store='arsenalHigherV2';
function read(){try{return JSON.parse(localStorage.getItem(store))||{best:0,played:0,daily:{}}}catch(e){return {best:0,played:0,daily:{}}}}
function write(x){localStorage.setItem(store,JSON.stringify(x))}
function shuffle(a,seed){let b=a.slice();for(let i=b.length-1;i>0;i--){let j;if(seed===undefined)j=Math.floor(Math.random()*(i+1));else{seed=(Math.imul(seed,1664525)+1013904223)>>>0;j=seed%(i+1)}[b[i],b[j]]=[b[j],b[i]]}return b}
function today(){let d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function hash(s){let h=2166136261;for(let c of s){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function label(){return mode==='goals'?'Arsenal Premier League goals':'Arsenal Premier League appearances'}
function startMenu(){let s=read();$('gameBody').innerHTML='<p class="muted">Higher or Lower 2.0 — compare historical Arsenal Premier League statistics, not fictional game scores.</p><div class="stats"><div class="stat"><b>'+s.best+'</b><small>Best score</small></div><div class="stat"><b>'+s.played+'</b><small>Games played</small></div><div class="stat"><b>'+Object.keys(s.daily).length+'</b><small>Daily challenges</small></div><div class="stat"><b>'+records.length+'</b><small>Players</small></div></div><div class="arcade-higher-controls"><label>Comparison category<select id="higherCategory"><option value="goals">Premier League goals</option><option value="appearances">Premier League appearances</option></select></label></div><div class="flex"><button onclick="arcadeHigherStart(false)">New random challenge</button><button class="secondary" onclick="arcadeHigherStart(true)">Daily challenge</button></div><p class="muted small">Historical source snapshot. <a style="color:#ffcf7b" href="'+source+'" target="_blank" rel="noopener noreferrer">View statistical source</a>. The figures shown are those in this source dataset, which may differ from other official career totals.</p>'}
window.arcadeHigherStart=function(isDaily){mode=$('higherCategory').value;daily=isDaily;let key=today()+'-'+mode,s=read();if(daily&&s.daily[key]!==undefined){$('gameBody').innerHTML='<h2>Daily challenge complete</h2><p>You scored '+s.daily[key]+'/'+(records.length-1)+' in '+label()+'. Come back tomorrow for a new order.</p><button onclick="startHigher()">Back</button>';return}deck=shuffle(records,daily?hash(key):undefined);step=0;points=0;render()};
function render(){if(step>=deck.length-1){let s=read();s.played++;s.best=Math.max(s.best,points);if(daily)s.daily[today()+'-'+mode]=points;write(s);$('gameBody').innerHTML='<h2>Challenge complete: '+points+'/'+(deck.length-1)+'</h2><p class="muted">Category: '+label()+'</p><button onclick="startHigher()">Play again</button>';return}locked=false;let a=deck[step],b=deck[step+1];$('gameBody').innerHTML='<p class="eyebrow">'+(daily?'Daily challenge':'Random challenge')+' · Round '+(step+1)+'/'+(deck.length-1)+' · Score '+points+'</p><h3>'+label()+'</h3><div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))"><div class="stat"><h3>'+a.name+'</h3><b>'+a[mode]+'</b><small>'+mode+'</small></div><div class="stat"><h3>'+b.name+'</h3><b>?</b><small>'+mode+'</small></div></div><p class="muted">Does '+b.name+' have a higher or lower figure?</p><div class="flex"><button id="higherUp" onclick="arcadeHigherAnswer(true)">Higher or equal ↑</button><button id="higherDown" onclick="arcadeHigherAnswer(false)">Lower ↓</button></div><div id="higherFeedback" aria-live="polite"></div>'}
window.arcadeHigherAnswer=function(up){if(locked)return;locked=true;let a=deck[step][mode],b=deck[step+1][mode],ok=up?b>=a:b<a;if(ok)points++;$('higherUp').disabled=true;$('higherDown').disabled=true;$('higherFeedback').innerHTML='<div class="notice">'+(ok?'Correct!':'Not quite.')+' '+deck[step+1].name+': '+b+' '+mode+'.</div><button onclick="arcadeHigherNext()">Next →</button>'};
window.arcadeHigherNext=function(){step++;render()};
window.startHigher=startMenu;
const style=document.createElement('style');style.textContent='.arcade-higher-controls{margin:18px 0}.arcade-higher-controls label{display:grid;gap:7px;font-size:.85rem;color:#e8cbd4;max-width:270px}.arcade-higher-controls select{width:100%}';document.head.appendChild(style);
})();
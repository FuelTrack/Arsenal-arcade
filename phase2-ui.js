/* Phase 2 interface for Arsenal Arcade. All scores and ratings are fictional. */
(function(){
const engine=window.ArsenalPhase2;
if(!engine)return;
const basePlayers=players.slice();
const cfg=JSON.parse(localStorage.getItem('arsenalPhase2Config')||'null')||{era:'mixed',formation:'4-3-3',mentality:'balanced'};
let events=[];
function roster(){return cfg.era==='legends'?engine.legends:basePlayers}
function persist(){localStorage.setItem('arsenalPhase2Config',JSON.stringify(cfg))}
function safe(v){return String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;'}[c]))}
function valid(){return engine.validateXI(roster(),[...selected],cfg.formation)}
function change(key,value){if((key==='era'||key==='formation')&&season?.played)return;cfg[key]=value;if(key!=='mentality')selected.clear();persist();renderSeason()}
window.arcadeChange=change;
function picker(key,label,values,locked){return '<label class="arcade-control">'+label+'<select '+(locked?'disabled':'')+' onchange="arcadeChange(\''+key+'\',this.value)">'+values.map(([v,t])=>'<option value="'+v+'" '+(cfg[key]===v?'selected':'')+'>'+t+'</option>').join('')+'</select></label>'}
function pitch(){let arr=[...selected].map(i=>roster()[i]);return ['FWD','MID','DEF','GK'].map(pos=>'<div class="field-row">'+arr.filter(p=>p[1]===pos).map(p=>'<div class="shirt">'+safe(p[0].split(' ').slice(-1)[0])+'<br><b>'+p[2]+'</b></div>').join('')+'</div>').join('')}
function fixtures(){return Array.from({length:38},(_,i)=>{let club=clubs[i%19],home=i<19,r=season?.results?.[i];return '<div class="arcade-fixture">MW '+(i+1)+' · '+(home?'Arsenal vs ':'Away at ')+safe(club)+' <b>'+(r?r.a+'–'+r.b+' '+r.outcome:'Upcoming')+'</b></div>'}).join('')}
function render(){
const s=season||{played:0,w:0,d:0,l:0,gf:0,ga:0,results:[]},locked=s.played>0;
const controls=picker('era','Squad era',[['mixed','Mixed Arsenal'],['legends','Arsenal Legends']],locked)+picker('formation','Formation',Object.keys(engine.formations).map(x=>[x,x]),locked)+picker('mentality','Mentality',[['balanced','Balanced'],['attacking','Attacking'],['defensive','Defensive']],false);
$('gameBody').innerHTML='<p class="muted">Build your Arsenal XI and chase 114 points. Ratings and match outcomes are fictional.</p><div class="stats"><div class="stat"><b>'+s.played+'/38</b><small>Matches</small></div><div class="stat"><b>'+(s.w*3+s.d)+'</b><small>Points</small></div><div class="stat"><b>'+s.w+'-'+s.d+'-'+s.l+'</b><small>W-D-L</small></div><div class="stat"><b>'+s.gf+':'+s.ga+'</b><small>Goals</small></div></div><div class="arcade-tactics">'+controls+'</div><h3>Starting XI ('+selected.size+'/11)</h3><p class="muted small">Select 1 goalkeeper and '+cfg.formation+' outfield players. Squad era and formation lock after the first match.</p><div class="roster">'+roster().map((p,i)=>'<button '+(locked?'disabled':'')+' class="player '+(selected.has(i)?'active':'')+'" onclick="togglePlayer('+i+')">'+safe(p[0])+'<small>'+p[1]+' · '+p[2]+' OVR</small></button>').join('')+'</div><div class="field">'+pitch()+'</div><div class="flex"><button onclick="playMatch()" '+(!valid()||s.played>=38?'disabled':'')+'>'+(s.played>=38?'Season complete':'Simulate match '+(s.played+1))+'</button><button class="secondary" onclick="resetSeason()">Reset season</button></div>'+(s.played===38?'<div class="notice">'+(s.w===38?'🏆 Perfect season — 38-0-0!':'Season complete — '+(s.w*3+s.d)+' points')+'</div>':'')+'<h3>Match centre</h3><div class="arcade-events">'+(events.length?events.map(e=>'<div><b>'+e.minute+'\'</b> '+safe(e.text)+'</div>').join(''):'Simulate a match to see commentary.')+'</div><details><summary>Full 38-match fixture list</summary>'+fixtures()+'</details><h3>Results</h3><div class="log">'+(s.results.length?s.results.slice().reverse().map(r=>'<div>MW '+r.week+' · Arsenal '+r.a+'–'+r.b+' '+safe(r.club)+' · '+r.outcome+'</div>').join(''):'No matches played')+'</div>';
}
window.renderSeason=render;
window.togglePlayer=function(i){if(season?.played)return;if(selected.has(i))selected.delete(i);else if(selected.size<11)selected.add(i);render()};
window.resetSeason=function(){if(!confirm('Reset this season and selected XI?'))return;season=null;selected.clear();events=[];localStorage.removeItem('arcadeSeason');render()};
window.playMatch=function(){
if(!valid()||season?.played>=38)return;
if(!season){freshSeason();season.era=cfg.era;season.formation=cfg.formation}
const week=season.played,club=clubs[week%19],home=week<19;
const rating=[...selected].reduce((sum,i)=>sum+roster()[i][2],0)/11;
const mood=engine.mentalities[cfg.mentality];
const a=Math.max(0,Math.min(5,Math.floor(Math.random()*3+(rating-82)/11+mood.attack)));
const b=Math.max(0,Math.min(5,Math.floor(Math.random()*3+(85-rating)/11-mood.defence)));
const result=a>b?'W':a===b?'D':'L';
const scorers=[...selected].map(i=>roster()[i]).filter(p=>p[1]!=='GK').map(p=>p[0]);
events=engine.makeTimeline(a,b,scorers,club);
season.played++;season[result.toLowerCase()]++;season.gf+=a;season.ga+=b;
season.results.push({week:season.played,club,home,a,b,outcome:result});
saveSeason();render();
};
if(season?.played){if(season.era)cfg.era=season.era;if(season.formation)cfg.formation=season.formation;persist()}
const css=document.createElement('style');css.textContent='.arcade-tactics{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0}.arcade-control{display:grid;gap:6px;color:#e4c6d0;font-size:.82rem}.arcade-events{border-left:2px solid #edbd68;padding-left:15px;margin:12px 0}.arcade-events div,.arcade-fixture{padding:9px;border-bottom:1px solid #ffffff20}.arcade-fixture{display:flex;justify-content:space-between;gap:8px}details{margin:18px 0}summary{cursor:pointer;font-weight:700}';document.head.append(css);
})();
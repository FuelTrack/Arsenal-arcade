/* Arsenal Arcade Phase 3: quizzes and mini-games. No external services. */
(function(){
const bank=[
['History','Easy','What year was Arsenal founded?',['1886','1896','1906','1913'],0],
['History','Easy','Which stadium did Arsenal leave in 2006?',['Wembley','Highbury','The Den','Craven Cottage'],1],
['History','Easy','What is Arsenal’s nickname?',['The Gunners','The Eagles','The Seagulls','The Clarets'],0],
['History','Medium','Who managed the 2003–04 Invincibles?',['George Graham','Arsène Wenger','Bruce Rioch','Mikel Arteta'],1],
['History','Medium','Which year did Arsenal move to Emirates Stadium?',['2004','2005','2006','2007'],2],
['History','Hard','Who scored the winning goal in the 1979 FA Cup final?',['Alan Sunderland','Liam Brady','Frank Stapleton','Charlie George'],0],
['History','Hard','What was Arsenal originally called in 1886?',['Dial Square','Royal Arsenal','Woolwich Arsenal','Highbury FC'],0],
['Legends','Easy','Who is Arsenal’s all-time leading goalscorer?',['Ian Wright','Thierry Henry','Dennis Bergkamp','Robin van Persie'],1],
['Legends','Easy','Which Arsenal legend was nicknamed Mr Arsenal?',['Tony Adams','Patrick Vieira','Ray Parlour','David Seaman'],0],
['Legends','Medium','Who captained Arsenal during the Invincibles season?',['Patrick Vieira','Thierry Henry','Sol Campbell','Robert Pirès'],0],
['Legends','Medium','Which player scored the famous pirouette goal against Newcastle in 2002?',['Dennis Bergkamp','Freddie Ljungberg','Nwankwo Kanu','Sylvain Wiltord'],0],
['Legends','Hard','Which Arsenal goalkeeper was unbeaten throughout the 2003–04 league season as a starter?',['Jens Lehmann','David Seaman','Manuel Almunia','Łukasz Fabiański'],0],
['Legends','Hard','Which player scored Arsenal’s winner in the 2014 FA Cup final?',['Aaron Ramsey','Santi Cazorla','Olivier Giroud','Laurent Koscielny'],0],
['Invincibles','Easy','How many Premier League defeats did Arsenal have in 2003–04?',['0','1','2','3'],0],
['Invincibles','Easy','How many league matches were played in Arsenal’s unbeaten title season?',['34','36','38','42'],2],
['Invincibles','Medium','Which club did Arsenal beat to clinch the 2003–04 title?',['Chelsea','Tottenham Hotspur','Manchester United','Liverpool'],1],
['Invincibles','Medium','Who was the Arsenal goalkeeper during the unbeaten 2003–04 league campaign?',['Jens Lehmann','David Seaman','Richard Wright','Manuel Almunia'],0],
['Invincibles','Hard','How many points did Arsenal earn in the 2003–04 Premier League season?',['86','88','90','92'],2],
['Invincibles','Hard','What was Arsenal’s league record in 2003–04?',['26W 12D 0L','28W 10D 0L','25W 13D 0L','27W 11D 0L'],0],
['Cup finals','Easy','Which competition did Arsenal win in 2014 to end a trophy drought?',['League Cup','FA Cup','Champions League','Europa League'],1],
['Cup finals','Medium','Who scored Arsenal’s winning goal in the 2017 FA Cup final?',['Aaron Ramsey','Alexis Sánchez','Olivier Giroud','Theo Walcott'],0],
['Cup finals','Medium','Who scored Arsenal’s extra-time winner in the 2020 FA Cup final?',['Pierre-Emerick Aubameyang','Nicolas Pépé','Alexandre Lacazette','Eddie Nketiah'],0],
['Cup finals','Hard','Who scored Arsenal’s winning goal in the 1971 FA Cup final?',['Charlie George','George Graham','Ray Kennedy','John Radford'],0],
['Cup finals','Hard','Which team did Arsenal beat in the 2005 FA Cup final?',['Manchester United','Chelsea','Liverpool','Newcastle United'],0]
];
const guess=[
['Thierry Henry',['French international','Signed from Juventus','Arsenal record goalscorer']],
['Dennis Bergkamp',['Dutch international','Signed from Inter Milan','Famous Newcastle goal in 2002']],
['Patrick Vieira',['French midfielder','Captained the Invincibles','Wore number 4']],
['Ian Wright',['English striker','Joined from Crystal Palace','Held club scoring record before Henry']],
['Tony Adams',['English centre-back','One-club Arsenal player','Known as Mr Arsenal']],
['Robert Pires',['French midfielder','Part of the Invincibles','Wore number 7']],
['Freddie Ljungberg',['Swedish international','Invincibles winger','Famous red hair']],
['David Seaman',['English goalkeeper','Played in the 1990s','Famous save against Sheffield United']],
['Aaron Ramsey',['Welsh midfielder','Wore number 8','Scored 2014 FA Cup final winner']],
['Bukayo Saka',['Arsenal academy graduate','England international','First name Bukayo']]
];
let mode='classic',category='All',difficulty='All',round=[],pos=0,points=0,locked=false,guesses=[],gpos=0,clue=1,gscore=0;
const key='arsenalArcadeQuizStatsV3';
function stats(){try{return JSON.parse(localStorage.getItem(key))||{played:0,best:0,correct:0,answered:0}}catch(e){return {played:0,best:0,correct:0,answered:0}}}
function save(s){localStorage.setItem(key,JSON.stringify(s))}
function shuffle(a){let b=a.slice();for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function escape(s){return String(s).replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;':'&quot;'}[x]))}
function menu(){let s=stats();$('gameBody').innerHTML='<p class="muted">Phase 3 · '+bank.length+' Arsenal questions across four categories, with difficulty filters, randomised rounds and saved high scores.</p><div class="stats"><div class="stat"><b>'+s.played+'</b><small>Rounds</small></div><div class="stat"><b>'+s.best+'</b><small>Best score</small></div><div class="stat"><b>'+s.correct+'</b><small>Correct answers</small></div><div class="stat"><b>'+(s.answered?Math.round(s.correct/s.answered*100):0)+'%</b><small>Accuracy</small></div></div><div class="arcade-quiz-controls"><label>Category<select id="quizCategory">'+['All','History','Legends','Invincibles','Cup finals'].map(x=>'<option '+(category===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><label>Difficulty<select id="quizDifficulty">'+['All','Easy','Medium','Hard'].map(x=>'<option '+(difficulty===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label></div><div class="flex"><button onclick="arcadeStartQuiz()">Start 10-question quiz</button><button class="secondary" onclick="arcadeStartQuiz(true)">Play all matching questions</button></div><p class="muted small">A round requires at least one matching question. Scores are saved only on this device.</p>'}
window.arcadeStartQuiz=function(all=false){category=$('quizCategory').value;difficulty=$('quizDifficulty').value;round=shuffle(bank.filter(q=>(category==='All'||q[0]===category)&&(difficulty==='All'||q[1]===difficulty)));if(!all)round=round.slice(0,10);if(!round.length){$('gameBody').innerHTML='<p>No questions in this combination.</p><button onclick="startTrivia()">Back</button>';return}pos=0;points=0;renderQuestion()};
function renderQuestion(){if(pos>=round.length){let s=stats();s.played++;s.best=Math.max(s.best,points);save(s);$('gameBody').innerHTML='<h2>Round complete! '+points+'/'+round.length+'</h2><p class="muted">Best score: '+s.best+' · Overall accuracy: '+(s.answered?Math.round(s.correct/s.answered*100):0)+'%</p><button onclick="startTrivia()">New round</button>';return}locked=false;let q=round[pos],opts=shuffle(q[3].map((text,i)=>({text,correct:i===q[4]})));window.arcadeAnswerKey=opts.map(x=>x.correct);$('gameBody').innerHTML='<p class="eyebrow">'+escape(q[0])+' · '+q[1]+' · Question '+(pos+1)+'/'+round.length+' · Score '+points+'</p><div class="question">'+escape(q[2])+'</div><div class="options">'+opts.map((x,i)=>'<button class="option" onclick="arcadeAnswerQuiz('+i+')">'+escape(x.text)+'</button>').join('')+'</div><div id="feedback" aria-live="polite"></div>'}
window.arcadeAnswerQuiz=function(i){if(locked)return;locked=true;let ok=window.arcadeAnswerKey[i],s=stats();s.answered++;if(ok){points++;s.correct++}save(s);document.querySelectorAll('#gameBody .option').forEach((b,j)=>{b.disabled=true;if(window.arcadeAnswerKey[j])b.classList.add('correct');else if(i===j)b.classList.add('wrong')});$('feedback').innerHTML='<p>'+(ok?'Correct!':'Not quite — the correct answer is highlighted.')+'</p><button onclick="arcadeNextQuiz()">'+(pos===round.length-1?'View results':'Next question')+' →</button>'};
window.arcadeNextQuiz=function(){pos++;renderQuestion()};
window.startTrivia=menu;
function normalise(x){return x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,'').trim()}
function showGuess(){if(gpos>=guesses.length){$('gameBody').innerHTML='<h2>Guess the Gunner: '+gscore+'/'+guesses.length+'</h2><button onclick="startGuess()">Play again</button>';return}let q=guesses[gpos];$('gameBody').innerHTML='<p class="eyebrow">Player '+(gpos+1)+'/'+guesses.length+' · Correct '+gscore+'</p><h3>Who is this Gunner?</h3><div class="log">'+q[1].slice(0,clue).map((x,i)=>'<div>Clue '+(i+1)+': '+escape(x)+'</div>').join('')+'</div><div class="flex" style="margin-top:15px"><input id="guessInput" placeholder="Player name" style="padding:12px;background:#352630;color:white;border:1px solid #ffffff55;border-radius:10px;flex:1"><button id="guessSubmit" onclick="arcadeGuess()">Guess</button><button id="guessReveal" class="secondary" onclick="arcadeClue()" '+(clue===3?'disabled':'')+'>Reveal clue</button></div><div id="guessFeedback" aria-live="polite"></div>'}
window.startGuess=function(){guesses=shuffle(guess);gpos=0;gscore=0;clue=1;showGuess()};
window.arcadeClue=function(){clue=Math.min(3,clue+1);showGuess()};
window.arcadeGuess=function(){let input=$('guessInput'),answer=normalise(guesses[gpos][0]),val=normalise(input.value);if(!val)return;let ok=val===answer||(val.length>=4&&val===answer.split(' ').slice(-1)[0]);if(ok)gscore++;input.disabled=true;$('guessSubmit').disabled=true;$('guessReveal').disabled=true;$('guessFeedback').innerHTML='<div class="notice">'+(ok?'Correct!':'Answer: '+escape(guesses[gpos][0]))+'</div><button onclick="arcadeNextGuess()">Next player →</button>'};
window.arcadeNextGuess=function(){gpos++;clue=1;showGuess()};
const css=document.createElement('style');css.textContent='.arcade-quiz-controls{display:flex;flex-wrap:wrap;gap:14px;margin:20px 0}.arcade-quiz-controls label{display:grid;gap:6px;font-size:.82rem;color:#e5c7d1}.arcade-quiz-controls select{min-width:155px}';document.head.appendChild(css);
})();
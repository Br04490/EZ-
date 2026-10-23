/**
 * EZRA BE HOOPING — V3 COMPLETE WEB GAME
 * ----------------------------------------
 * DESIGN CONTRACT:
 * - Every visual button is an actual, accessible DOM button.
 * - One and only one basket attempt is recorded for a valid tap.
 * - The full-screen court touch zone works ONLY in active gameplay.
 * - The bottom orange shoot button is always a primary touch target.
 * - HUD/pause/settings/menu taps cannot trigger a shot.
 * - Scenes are pre-rendered art, while the ball, meter, HUD and effects are live layers.
 * - All audio files are shipped locally; nothing depends on Gemini or external APIs.
 * - Browser-generated voices are FALLBACKS, not confirmed authentic child voices.
 */
import {GAME_SECONDS,STAGES,SISTER_LINES,greenWidth,meterPosition,isMade,secondsLeft,formatTime,bucketSentence,clamp} from './engine.mjs';
import {createGameAudio,TRACKS,TRACK_NAMES} from './audio.mjs';
import {VOICE_CLIPS} from './voice-clips.mjs';

const $=(id)=>document.getElementById(id);
const screenNames=['home','stages','game','results','music','settings','scores','help'];
const screens=Object.fromEntries(screenNames.map(x=>[x,$(`${x}-screen`)]));
const audio=createGameAudio();
const PREF_KEY='ezra-be-hooping-v3-settings';
const DEFAULTS={stage:0,easy:true,courtTap:true,music:true,sfx:true,voices:true,volume:42,track:'auto'};
function readPrefs(){try{const saved=JSON.parse(localStorage.getItem(PREF_KEY)||'{}');return{...DEFAULTS,...saved};}catch{return {...DEFAULTS};}}
const prefs=readPrefs();
const state={screen:'home',stage:clamp(Number(prefs.stage)||0,0,2),playing:false,paused:false,pausedAt:0,startedAt:0,seconds:GAME_SECONDS,score:0,
  position:.5,shotLocked:false,lastCounted:6,lastLine:-1,lastSisterSpeech:0,round:0,raf:0,voiceBusy:false};
let effectTimer=0,commentaryTimer=0,unlockCtx=null,voiceAudio=null,voiceToken=0,ballAnimation=null;
const activeTimers=new Set();

function after(ms,fn){const id=setTimeout(()=>{activeTimers.delete(id);fn();},ms);activeTimers.add(id);return id;}
function clearGameTimers(){for(const id of activeTimers)clearTimeout(id);activeTimers.clear();clearTimeout(effectTimer);clearTimeout(commentaryTimer);}
function savePrefs(){try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs));}catch{/* Private browsing */}}
function bestKey(stage){return `ezra-be-hooping-best-${STAGES[stage].id}`;}
function getBest(stage){try{return Math.max(0,Number(localStorage.getItem(bestKey(stage))||0)||0);}catch{return 0;}}
function setBest(stage,score){try{localStorage.setItem(bestKey(stage),String(Math.max(getBest(stage),score)));}catch{}}
function announce(t){$('announcer').textContent=t;}
function setScreen(next){
 for(const [name,section] of Object.entries(screens)){const open=name===next;section.hidden=!open;section.classList.toggle('is-hidden',!open);}
 state.screen=next;
 if(next==='scores')renderScores();
 if(next==='stages')renderStages();
 if(next==='music')renderMusic();
 if(next==='settings')renderSettings();
}
function enterMenu(name='home'){
 // Leaving any round ends it; no running timer hides beneath menus.
 clearGameTimers();state.round++;state.playing=false;state.paused=false;state.shotLocked=false;
 $('shoot-btn').disabled=true;
 hidePause();audio.stop();stopVoice();
 if(ballAnimation){ballAnimation.cancel();ballAnimation=null;}
 $('flight-ball').style.opacity='0';
 setScreen(name);
}
function selectStage(index){
 const stage=STAGES[index];if(!stage)return;
 state.stage=index;prefs.stage=index;savePrefs();
 $('app').classList.remove('backyard','playground','arena');$('app').classList.add(stage.className);
 $('net-effect').src=stage.net;
 $('game-stage-label').textContent=stage.name;
 audio.setStage(index);
 renderStages();
}
function renderStages(){
 const list=$('stage-cards');list.replaceChildren();
 STAGES.forEach((stage,i)=>{
  const b=document.createElement('button');b.type='button';b.className='stage-card'+(state.stage===i?' selected':'');
  b.setAttribute('aria-label',`Select ${stage.name} basketball court`);b.setAttribute('aria-pressed',String(state.stage===i));
  const img=document.createElement('img');img.src=stage.card;img.alt='';img.loading='eager';
  const label=document.createElement('b');label.textContent=stage.name;
  b.append(img,label);
  b.addEventListener('click',()=>{selectStage(i);startRound();});
  list.append(b);
 });
}
function renderMusic(){
 document.querySelectorAll('.music-choice').forEach(b=>{
  const active=b.dataset.track===prefs.track;b.classList.toggle('active',active);
  b.setAttribute('aria-pressed',String(active));b.querySelector('.track-indicator').textContent=active?'✓':'▶';
 });
 $('music-enabled').checked=!!prefs.music;$('volume-slider').value=prefs.volume;
}
function renderSettings(){
 $('settings-music').checked=!!prefs.music;$('settings-sfx').checked=!!prefs.sfx;
 $('settings-voices').checked=!!prefs.voices;$('settings-easy').checked=!!prefs.easy;$('settings-court-tap').checked=!!prefs.courtTap;
}
function renderScores(){
 const list=$('highscores-list');list.replaceChildren();
 STAGES.forEach(s=>{const box=document.createElement('div');box.className='score-record';
 const name=document.createElement('span');name.textContent=s.name;
 const score=document.createElement('strong');score.textContent=String(getBest(STAGES.indexOf(s)));
 box.append(name,score);list.append(box);});
}
function syncAudio(){audio.setStage(state.stage);audio.setSelection(prefs.track);audio.setVolume((Number(prefs.volume)||0)/100);
 audio.setMusicEnabled(prefs.music);audio.setSfxEnabled(prefs.sfx);}
function updateGreenZone(){$('green-zone').style.width=`${greenWidth(prefs.easy)*100}%`;}
function unlockAudio(){
 try{const A=window.AudioContext||window.webkitAudioContext;if(A){unlockCtx ||= new A();if(unlockCtx.state==='suspended')unlockCtx.resume().catch(()=>{});}}catch{}
}

/** Audio policy: if user supplies guardian-approved child recordings they override voice synthesis.
 *  Device TTS often sounds ADULT despite the high pitch; the UI keeps exact spoken captions.
 */
function stopVoice(){voiceToken++;if(voiceAudio){try{voiceAudio.pause();voiceAudio.currentTime=0;}catch{}voiceAudio=null;}
 if('speechSynthesis'in window)try{window.speechSynthesis.cancel();}catch{}audio.duck(false);}
function speak(who,message,{priority=false,key=''}={}){
 if(!prefs.voices)return;
 const token=++voiceToken; // priority audio wins, previous utterance never traps the duck state.
 const clip=key?VOICE_CLIPS[who]?.[key]:null;
 if(clip){
  stopVoice();const token2=voiceToken;
  try{const a=new Audio(clip);voiceAudio=a;audio.duck(true);
   a.onended=()=>{if(voiceToken===token2){voiceAudio=null;audio.duck(false);}};
   a.onerror=()=>{if(voiceToken===token2){voiceAudio=null;audio.duck(false);speakFallback(who,message);}};
   a.play().catch(()=>{if(voiceToken===token2){voiceAudio=null;audio.duck(false);speakFallback(who,message);}});return;
  }catch{}
 }
 if(voiceAudio){voiceAudio.pause();voiceAudio=null;}
 speakFallback(who,message,priority);
}
function speakFallback(who,message,priority=true){
 if(!prefs.voices||!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance==='undefined')return;
 try{
  // Rapid made shots intentionally replace the previous catchphrase rather than overlap.
  if(priority)window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(message);u.lang='en-US';u.rate=who==='Ezra'?1.10:1.15;u.pitch=who==='Ezra'?1.65:1.36;
  const voices=window.speechSynthesis.getVoices().filter(x=>x.lang?.toLowerCase().startsWith('en'));
  const pref=who==='Ezra'?/Eddy|Junior|Young|Reed|Boy/i:/Ava|Samantha|Zoe|Jenny|Girl/i;
  u.voice=voices.find(v=>pref.test(v.name))||voices[0]||null;
  u.onstart=()=>audio.duck(true);u.onend=()=>audio.duck(false);u.onerror=()=>audio.duck(false);
  window.speechSynthesis.speak(u);
 }catch{audio.duck(false);}
}
function showCaption(text,timeout=1350){const el=$('sister-caption');el.textContent=text;el.classList.add('show');
 const round=state.round;after(timeout,()=>{if(state.round===round)el.classList.remove('show');});}
function sisterComment(){if(!state.playing||state.seconds<=5)return;
 let index=Math.floor(Math.random()*SISTER_LINES.length);if(index===state.lastLine)index=(index+1)%SISTER_LINES.length;
 state.lastLine=index;showCaption(SISTER_LINES[index],1800);
 if(performance.now()-state.lastSisterSpeech>3500){state.lastSisterSpeech=performance.now();
  speak('Lennox',SISTER_LINES[index],{priority:false,key:`sister-${String(index+1).padStart(2,'0')}`});}}
function countDown(n){const el=$('countdown-call');el.textContent=String(n);el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
 showCaption(`${n}!`,900);speak('Lennox',String(n),{priority:true,key:`countdown-${n}`});if(n===5)audio.effect('green');}
function resetEffects(){
 $('made-title').classList.remove('show','miss');$('swish-flash').classList.remove('active');$('net-effect').classList.remove('swish');
 $('sister-caption').classList.remove('show');$('countdown-call').classList.remove('show');$('effect-particles').replaceChildren();
 const ball=$('flight-ball');ball.style.opacity='0';if(ballAnimation){ballAnimation.cancel();ballAnimation=null;}
}
function startRound(){
 clearGameTimers();stopVoice();resetEffects();state.round++;
 state.score=0;state.seconds=GAME_SECONDS;state.position=.5;state.lastCounted=6;state.lastLine=-1;state.lastSisterSpeech=0;
 state.shotLocked=false;state.paused=false;state.pausedAt=0;state.startedAt=performance.now();state.playing=true;
 $('score-value').textContent='0';$('time-value').textContent='0:30';$('time-container').classList.remove('danger');
 $('shoot-btn').disabled=false;$('shot-pointer').style.left='50%';$('shot-meter').setAttribute('aria-valuenow','50');
 updateGreenZone();selectStage(state.stage);setScreen('game');hidePause();syncAudio();unlockAudio();audio.activate();
 showCaption("Let's go, Ezra!",1400);
 speak('Ezra',"Let's hoop!",{priority:true,key:'lets-hoop'});
 announce('30 seconds. Tap the big orange button or the court to shoot.');
}
function showMake(text,miss=false){const el=$('made-title');el.textContent=text;el.classList.remove('show','miss');void el.offsetWidth;
 if(miss)el.classList.add('miss');el.classList.add('show');}
function popParticles(){const root=$('effect-particles');root.replaceChildren();const frag=document.createDocumentFragment();
 for(let i=0;i<15;i++){const particle=document.createElement('span');particle.className='spark';particle.textContent=i%3===0?'⭐':'✦';
 particle.style.left=`${20+Math.random()*60}%`;particle.style.top=`${19+Math.random()*30}%`;
 particle.style.color=i%3===0?'#ffe343':'#75ff36';particle.style.setProperty('--dx',`${Math.round((Math.random()-.5)*155)}px`);
 particle.style.setProperty('--dy',`${Math.round((Math.random()-.5)*130)}px`);particle.style.setProperty('--rot',`${Math.round(Math.random()*360)}deg`);
 frag.append(particle);}root.append(frag);const round=state.round;after(900,()=>{if(state.round===round)root.replaceChildren();});}
function animateShot(made,side){
 const ball=$('flight-ball');if(ballAnimation){ballAnimation.cancel();ballAnimation=null;}
 const rect=$('game-screen').getBoundingClientRect(),stage=STAGES[state.stage];const [ax,ay]=stage.origin,[hx,hy]=stage.hoop;
 const startX=ax*rect.width-20,startY=ay*rect.height-20;
 const endX=hx*rect.width-20+(made?0:side<.5?-57:57),endY=hy*rect.height-20+(made?27:-10);
 ball.style.left=`${startX}px`;ball.style.top=`${startY}px`;ball.style.opacity='1';
 const dx=endX-startX,dy=endY-startY;
 if(ball.animate){ballAnimation=ball.animate([
   {transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1,offset:0},
   {transform:`translate(${dx*.52}px,${dy*.52-82}px) scale(.86) rotate(180deg)`,opacity:1,offset:.50},
   {transform:`translate(${dx}px,${dy}px) scale(.63) rotate(320deg)`,opacity:1,offset:.85},
   {transform:`translate(${dx}px,${dy+39}px) scale(.42) rotate(400deg)`,opacity:0,offset:1}
  ],{duration:660,easing:'ease-out',fill:'forwards'});
  ballAnimation.onfinish=()=>{ball.style.opacity='0';ballAnimation=null;};
  ballAnimation.oncancel=()=>ball.style.opacity='0';
 }else ball.style.opacity='0';
}
function shoot(){
 if(state.screen!=='game'||!state.playing||state.paused||state.shotLocked||state.seconds<=0)return;
 state.shotLocked=true;
 const round=state.round,pos=state.position,made=isMade(pos,prefs.easy);
 audio.effect('shot');animateShot(made,pos);
 if(made){
  state.score++;$('score-value').textContent=String(state.score);
  showMake('GREEN!',false);announce(`Green! EZ money! ${state.score} buckets!`);
  speak('Ezra','Green! EZ money!',{priority:true,key:'green-ez-money'});
  if(navigator.vibrate)try{navigator.vibrate(25);}catch{}
  if(state.score===1||state.score%3===0)after(1250,()=>{if(state.round===round)sisterComment();});
 }else{
  showMake('ALMOST!',true);
  if(Math.random()<.45)showCaption('You got the next one!',1100);
 }
 after(430,()=>{
  if(state.round!==round)return;
  if(made){audio.effect('swish');audio.effect('green');
   const n=$('net-effect');n.classList.remove('swish');void n.offsetWidth;n.classList.add('swish');
   const s=$('swish-flash');s.classList.remove('active');void s.offsetWidth;s.classList.add('active');popParticles();
   if(state.score%3===0||state.stage===2)audio.effect('cheer');
  }else{audio.effect('rim');audio.effect('bounce');}
 });
 after(660,()=>{if(state.round===round)state.shotLocked=false;});
}
function finishRound(){
 if(!state.playing)return;
 state.playing=false;state.shotLocked=true;state.seconds=0;
 $('time-value').textContent='0:00';$('shoot-btn').disabled=true;
 clearGameTimers();audio.effect('buzzer');audio.effect('cheer');audio.pause();stopVoice();
 setBest(state.stage,state.score);
 $('result-total').textContent=String(state.score);$('result-best').textContent=`PERSONAL BEST: ${getBest(state.stage)}`;
 $('result-quip').textContent=state.score>=10?'GREEN! EZ MONEY!':'NICE HOOPIN\'!';
 const art=document.querySelector('.result-art');art.style.backgroundImage=`url('${STAGES[state.stage].image}')`;
 setScreen('results');announce(`${state.score} buckets. Time is up.`);
 speak('Ezra',bucketSentence(state.score),{priority:true,key:`bucket-total-${state.score}`});
}
function showPause(){
 if(!state.playing||state.paused)return;
 state.paused=true;state.pausedAt=performance.now();
 $('pause-overlay').hidden=false;$('pause-overlay').classList.remove('is-hidden');audio.pause();stopVoice();
}
function hidePause(){$('pause-overlay').hidden=true;$('pause-overlay').classList.add('is-hidden');}
function resumeRound(){
 if(!state.playing||!state.paused)return;
 state.startedAt+=performance.now()-state.pausedAt;
 state.paused=false;state.pausedAt=0;hidePause();syncAudio();audio.resume();
}
function frame(now){
 // The only time source is performance.now(), corrected for pausing and tab changes.
 if(state.playing&&!state.paused){
  const remain=secondsLeft(now,state.startedAt);
  state.seconds=remain;$('time-value').textContent=formatTime(remain);
  $('time-container').classList.toggle('danger',remain<=5);
  if(remain===0)finishRound();
  else{
   if(remain<=5&&remain<state.lastCounted){
    // Catch up on dropped frames without speaking 2+ countdown digits simultaneously.
    state.lastCounted=remain;countDown(remain);
   }
   const speed=prefs.easy?.88:1.35;
   state.position=meterPosition(now-state.startedAt,speed);
   $('shot-pointer').style.left=`${state.position*100}%`;
   $('shot-meter').setAttribute('aria-valuenow',String(Math.round(state.position*100)));
  }
 }
 state.raf=requestAnimationFrame(frame);
}
// ---- Events: bottom shoot button and court zone are mutually exclusive surfaces. ----
$('shoot-btn').addEventListener('click',shoot);
$('court-tap-zone').addEventListener('pointerdown',(event)=>{
 if(!prefs.courtTap||event.button!==0)return;event.preventDefault();shoot();
});
$('court-tap-zone').addEventListener('keydown',(event)=>{
 if((event.key==='Enter'||event.key===' ')&&prefs.courtTap){event.preventDefault();shoot();}
});
$('shot-meter').addEventListener('pointerdown',(event)=>{if(event.button!==0)return;event.preventDefault();shoot();});
$('play-btn').addEventListener('click',startRound);
$('stages-btn').addEventListener('click',()=>setScreen('stages'));
$('music-btn').addEventListener('click',()=>setScreen('music'));
$('settings-btn').addEventListener('click',()=>setScreen('settings'));
$('scores-btn').addEventListener('click',()=>setScreen('scores'));
$('help-btn').addEventListener('click',()=>setScreen('help'));
$('help-play-btn').addEventListener('click',startRound);
$('again-btn').addEventListener('click',startRound);
$('change-btn').addEventListener('click',()=>enterMenu('stages'));
$('result-home-btn').addEventListener('click',()=>enterMenu('home'));
$('pause-btn').addEventListener('click',showPause);
$('resume-btn').addEventListener('click',resumeRound);
$('quit-btn').addEventListener('click',()=>enterMenu('home'));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>enterMenu(b.dataset.back)));
document.querySelectorAll('.music-choice').forEach(b=>b.addEventListener('click',()=>{
 prefs.track=b.dataset.track;savePrefs();audio.setSelection(prefs.track);renderMusic();announce(`Selected ${prefs.track==='auto'?'automatic by stage':TRACK_NAMES[prefs.track]}.`);
}));
function bindCheckbox(id,key,update){$(id).addEventListener('change',e=>{prefs[key]=e.target.checked;savePrefs();if(update)update();});}
bindCheckbox('music-enabled','music',()=>{audio.setMusicEnabled(prefs.music);renderSettings();});
bindCheckbox('settings-music','music',()=>{audio.setMusicEnabled(prefs.music);renderMusic();});
bindCheckbox('settings-sfx','sfx',()=>audio.setSfxEnabled(prefs.sfx));
bindCheckbox('settings-voices','voices',()=>{if(!prefs.voices)stopVoice();});
bindCheckbox('settings-easy','easy',updateGreenZone);
bindCheckbox('settings-court-tap','courtTap',()=>{$('court-tap-zone').setAttribute('aria-disabled',String(!prefs.courtTap));});
$('volume-slider').addEventListener('input',e=>{prefs.volume=Number(e.target.value);savePrefs();audio.setVolume(prefs.volume/100);});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&state.screen==='game'){e.preventDefault();state.paused?resumeRound():showPause();return;}
 if((e.key===' '||e.key==='Enter')&&state.screen==='game'&&!state.paused){if(e.target.closest('button,[role=button],input'))return;e.preventDefault();shoot();}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing&&!state.paused)showPause();});
window.addEventListener('pagehide',()=>{if(state.playing&&!state.paused)showPause();});
// One-time initialization; there is never a need to sign in or provide private information.
selectStage(state.stage);syncAudio();updateGreenZone();setScreen('home');state.raf=requestAnimationFrame(frame);
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

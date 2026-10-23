/** Local, user-supplied music and effect player; never contacts network APIs. */
export const TRACKS=Object.freeze({
 'ezra-be-hooping-2':'./assets/music/ezra-be-hooping-2.mp3',
 'ezra-got-game':'./assets/music/ezra-got-game.mp3'
});
export const TRACK_NAMES=Object.freeze({'ezra-be-hooping-2':'Ezra Be Hooping 2','ezra-got-game':'Ezra Got Game'});
const FX=Object.freeze({shot:['shot-whoosh',.35],swish:['net-swish',.68],bounce:['ball-bounce',.42],rim:['rim-clang',.45],green:['green-sparkle',.44],cheer:['crowd-cheer',.35],buzzer:['final-buzzer',.5]});
export function trackForStage(stage,selection){return TRACKS[selection]?selection:stage===0?'ezra-got-game':'ezra-be-hooping-2';}
export function createGameAudio(){
 const music=new Audio();music.loop=true;music.preload='none';
 let started=false,playing=false,stage=0,selection='auto',currentTrack='',volume=.42,ducked=false,musicEnabled=true,sfxEnabled=true;
 const sounds=Object.fromEntries(Object.entries(FX).map(([key,[file,gain]])=>[key,{gain,pool:[new Audio(`./assets/sounds/${file}.wav`),new Audio(`./assets/sounds/${file}.wav`)],index:0}]));
 for(const s of Object.values(sounds))for(const a of s.pool)a.preload='auto';
 const calcVol=()=>{music.volume=musicEnabled?volume*(ducked?.28:1):0;};
 function syncTrack(){const next=trackForStage(stage,selection);if(next!==currentTrack){music.pause();music.src=TRACKS[next];currentTrack=next;music.load();}calcVol();if(started&&playing&&musicEnabled&&!document.hidden)music.play().catch(()=>{});}
 return{
  get track(){return currentTrack||trackForStage(stage,selection);},get musicEnabled(){return musicEnabled;},get sfxEnabled(){return sfxEnabled;},
  activate(){started=true;playing=true;syncTrack();},
  setStage(n){stage=n;syncTrack();},setSelection(s){selection=TRACKS[s]?s:'auto';syncTrack();},
  setMusicEnabled(on){musicEnabled=!!on;calcVol();if(musicEnabled&&playing&&started)music.play().catch(()=>{});else music.pause();},
  setSfxEnabled(on){sfxEnabled=!!on;},setVolume(n){volume=Math.max(0,Math.min(1,Number(n)||0));calcVol();},
  duck(on){ducked=!!on;calcVol();},
  effect(key){if(!started||!sfxEnabled||document.hidden||!sounds[key])return;const v=sounds[key];const a=v.pool[v.index];v.index=(v.index+1)%v.pool.length;try{a.pause();a.currentTime=0;a.volume=v.gain;a.play().catch(()=>{});}catch{}},
  pause(){playing=false;music.pause();},resume(){playing=true;if(started&&musicEnabled&&!document.hidden)music.play().catch(()=>{});},
  stop(){playing=false;music.pause();music.currentTime=0;},get selected(){return selection;}
 };
}

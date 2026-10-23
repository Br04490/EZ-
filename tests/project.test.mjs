import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {STAGES,SISTER_LINES,greenWidth} from '../src/engine.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(path)=>readFileSync(resolve(root,path),'utf8');
test('complete approved art and stage scenes are present',()=>{
 for(const path of ['assets/approved-art/FINAL-APPROVED-UI.png','assets/approved-art/user-confirmed-reference.jpeg','assets/approved-art/backyard-original.png']){
  assert.ok(existsSync(resolve(root,path)),`missing ${path}`);assert.ok(statSync(resolve(root,path)).size>100000,`art truncated ${path}`);
 }
 for(const stage of STAGES){for(const path of [stage.image,stage.card,stage.net])assert.ok(existsSync(resolve(root,path)),`missing stage asset ${path}`);}
});
test('HTML contains required accessible interactive controls',()=>{
 const html=read('index.html');
 for(const id of ['play-btn','stages-btn','music-btn','settings-btn','scores-btn','help-btn','stage-cards','time-value','score-value','shoot-btn','shot-meter','court-tap-zone','pause-btn','resume-btn','quit-btn','again-btn','change-btn','result-home-btn','settings-court-tap','settings-easy','settings-voices','settings-music','settings-sfx','volume-slider']){
  assert.ok(html.includes(`id="${id}"`),`missing control ${id}`);
 }
 assert.equal((html.match(/type="module"/g)||[]).length,1,'one game entrypoint');
});
test('game has multiple real pages and named mode instead of static screenshots as controls',()=>{
 const html=read('index.html');
 for(const id of ['home','stages','game','results','music','settings','scores','help'])assert.ok(html.includes(`id="${id}-screen"`));
 assert.ok(html.includes('id="court-tap-zone"'));
 assert.ok(read('src/game.js').includes("$('court-tap-zone').addEventListener('pointerdown'"));
 assert.ok(read('src/game.js').includes("$('shoot-btn').addEventListener('click',shoot)"));
 assert.ok(read('src/game.js').includes('state.shotLocked=true'));
});
test('all critical voice and timing rules remain preserved',()=>{
 assert.equal(SISTER_LINES.length,15);assert.equal(greenWidth(true),0.68);
 assert.equal(greenWidth(false),0.34);
 const code=read('src/game.js');
 assert.ok(code.includes("speak('Ezra','Green! EZ money!'"));
 assert.ok(code.includes('countDown(remain)'));
 assert.ok(code.includes('bucketSentence(state.score)'));
 assert.ok(code.includes('setBest(state.stage,state.score)'));
});
test('ZIP ready no build dependency or API keys required',()=>{
 const packageJson=JSON.parse(read('package.json'));
 assert.equal(packageJson.version,'3.0.0');assert.ok(!packageJson.dependencies);
 assert.ok(!read('index.html').includes('cdn.'));
 assert.ok(!read('src/game.js').includes('YOUR_GEMINI_API_KEY'));
});

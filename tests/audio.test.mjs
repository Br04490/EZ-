import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { TRACKS, trackForStage } from '../src/audio.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
test('both supplied songs exist in package and have audio content', () => {
  assert.equal(Object.keys(TRACKS).length, 2);
  for(const path of Object.values(TRACKS)) {
    const full = resolve(root,path); assert.ok(existsSync(full),`missing ${path}`);
    assert.ok(readFileSync(full).byteLength>1000000,`truncated ${path}`);
  }
});
test('auto soundtrack choices match the three courts',()=>{
  assert.equal(trackForStage(0),'ezra-got-game');
  assert.equal(trackForStage(1),'ezra-be-hooping-2');
  assert.equal(trackForStage(2),'ezra-be-hooping-2');
  assert.equal(trackForStage(0,'ezra-be-hooping-2'),'ezra-be-hooping-2');
});
test('all seven WAV SFX bundled with proper RIFF headers',()=>{
  for(const s of ['shot-whoosh','net-swish','green-sparkle','ball-bounce','rim-clang','crowd-cheer','final-buzzer']){
    const path=resolve(root,'assets/sounds',s+'.wav');
    assert.ok(existsSync(path)); const sig=readFileSync(path).subarray(0,4).toString();
    assert.equal(sig,'RIFF',path);
  }
});

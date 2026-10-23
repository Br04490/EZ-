import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_SECONDS, STAGES, SISTER_LINES, greenWidth, meterPosition, isMade, secondsLeft, formatTime, bucketSentence } from '../src/engine.mjs';
test('rounds last 30 seconds', () => { assert.equal(GAME_SECONDS, 30); assert.equal(secondsLeft(0,0),30); assert.equal(secondsLeft(1000,0),29); assert.equal(secondsLeft(30000,0),0); });
test('exactly three courts', () => assert.equal(STAGES.length,3));
test('exactly 15 sisterly commentary lines', () => { assert.equal(SISTER_LINES.length,15); assert.equal(new Set(SISTER_LINES).size,15); });
test('little hooper mode has wider green window', () => { assert.ok(greenWidth(true)>greenWidth(false)); assert.ok(isMade(.8,true)); assert.equal(isMade(.8,false),false); assert.ok(isMade(.5,false)); });
test('meter bounds are valid', () => { for(let ms=0; ms<12000; ms+=79) assert.ok(meterPosition(ms)>=0 && meterPosition(ms)<=1); });
test('timer and bucket grammar', () => { assert.equal(formatTime(5),'0:05'); assert.equal(bucketSentence(1),'I made 1 bucket! EZ money!'); assert.equal(bucketSentence(12),'I made 12 buckets! EZ money!'); });

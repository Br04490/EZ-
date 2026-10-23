import { Stage } from './types';

/** Pure gameplay rules: no DOM, timers, persistence or audio side effects. */
export const GAME_SECONDS = 30;

export const STAGES: readonly Stage[] = Object.freeze([
  {
    id: 'backyard',
    name: 'BACKYARD BUCKETS',
    short: 'BACKYARD',
    className: 'backyard',
    image: '/assets/game-art/backyard-scene.webp',
    card: '/assets/game-art/backyard-card.webp',
    net: '/assets/game-art/backyard-net.png',
    origin: [0.42, 0.60] as [number, number],
    hoop: [0.19, 0.32] as [number, number],
  },
  {
    id: 'playground',
    name: 'PLAYGROUND POP',
    short: 'PLAYGROUND',
    className: 'playground',
    image: '/assets/game-art/playground-scene.webp',
    card: '/assets/game-art/playground-card.webp',
    net: '/assets/game-art/playground-net.png',
    origin: [0.30, 0.56] as [number, number],
    hoop: [0.70, 0.23] as [number, number],
  },
  {
    id: 'arena',
    name: 'BIG STAGE EZ',
    short: 'ARENA',
    className: 'arena',
    image: '/assets/game-art/arena-scene.webp',
    card: '/assets/game-art/arena-card.webp',
    net: '/assets/game-art/arena-net.png',
    origin: [0.30, 0.58] as [number, number],
    hoop: [0.66, 0.16] as [number, number],
  },
]);

export const SISTER_LINES: readonly string[] = Object.freeze([
  "That's my little brother!",
  "Okay, Ezra, I see you!",
  "He shoots… he SCORES!",
  "Somebody call the highlights!",
  "Excuse me, was that ALL net?",
  "The hoop is scared of him!",
  "He didn't even need a warm-up!",
  "Hold up, that was actually clean!",
  "I'm telling Mom about that one!",
  "Buckets for breakfast, apparently!",
  "He's three and already doing this?",
  "The crowd goes WIIIIILD!",
  "Can I get your autograph, sir?",
  "Don't forget I taught you everything!",
  "That's my brother. You're welcome!",
]);

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const greenWidth = (easy: boolean): number => (easy ? 0.68 : 0.34);

export const meterPosition = (ms: number, speed: number = 1): number => {
  const c = (((ms * speed) / 1500) % 2 + 2) % 2;
  return c <= 1 ? c : 2 - c;
};

export const isMade = (position: number, easy: boolean): boolean =>
  Math.abs(position - 0.5) <= greenWidth(easy) / 2;

export const secondsLeft = (now: number, start: number): number =>
  clamp(Math.ceil(GAME_SECONDS - (now - start) / 1000), 0, GAME_SECONDS);

export const formatTime = (s: number): string =>
  `0:${String(clamp(Math.floor(s), 0, 30)).padStart(2, '0')}`;

export const bucketSentence = (n: number): string =>
  `I made ${n} ${n === 1 ? 'bucket' : 'buckets'}! EZ money!`;

export interface Stage {
  id: string;
  name: string;
  short: string;
  className: string;
  image: string;
  card: string;
  net: string;
  origin: [number, number];
  hoop: [number, number];
}

export type ScreenType = 'home' | 'stages' | 'game' | 'results' | 'music' | 'settings' | 'scores' | 'help';

export interface GamePrefs {
  stage: number;
  easy: boolean;
  courtTap: boolean;
  music: boolean;
  sfx: boolean;
  voices: boolean;
  volume: number;
  track: string;
}

export interface SoundEffectPool {
  gain: number;
  pool: HTMLAudioElement[];
  index: number;
}

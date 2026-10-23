/**
 * EZRA BE HOOPING — ROBUST AUDIO MANAGER
 * --------------------------------------
 * - Continuous background music loop across all screens
 * - Dual-audio crossfading between tracks
 * - Mobile Safari & Chrome autoplay detection & one-gesture unlock
 * - Smooth volume ducking during speech
 * - Preloaded sound effect pool with priority balance
 */

export const TRACKS: Record<string, string> = Object.freeze({
  'ezra-be-hooping-2': '/assets/music/ezra-be-hooping-2.mp3',
  'ezra-got-game': '/assets/music/ezra-got-game.mp3',
});

export const TRACK_NAMES: Record<string, string> = Object.freeze({
  'ezra-be-hooping-2': 'Ezra Be Hooping 2',
  'ezra-got-game': 'Ezra Got Game',
});

export type SoundKey = 'shot' | 'swish' | 'bounce' | 'rim' | 'green' | 'cheer' | 'buzzer';

const FX: Record<SoundKey, [string, number]> = Object.freeze({
  shot: ['shot-whoosh', 0.55],
  swish: ['net-swish', 0.85],
  bounce: ['ball-bounce', 0.6],
  rim: ['rim-clang', 0.65],
  green: ['green-sparkle', 0.7],
  cheer: ['crowd-cheer', 0.55],
  buzzer: ['final-buzzer', 0.75],
});

export function trackForStage(stage: number, selection: string = 'auto'): string {
  return TRACKS[selection] ? selection : stage === 0 ? 'ezra-got-game' : 'ezra-be-hooping-2';
}

export interface GameAudio {
  readonly track: string;
  readonly musicEnabled: boolean;
  readonly sfxEnabled: boolean;
  readonly selected: string;
  readonly isPlaying: boolean;
  readonly isAutoplayBlocked: boolean;
  attemptAutoplay(): Promise<boolean>;
  unlock(): Promise<boolean>;
  setStage(n: number): void;
  setSelection(s: string): void;
  setMusicEnabled(on: boolean): void;
  setSfxEnabled(on: boolean): void;
  setVolume(n: number): void;
  duck(on: boolean): void;
  effect(key: SoundKey): void;
  pause(): void;
  resume(): void;
  stop(): void;
  onAutoplayChange?: (blocked: boolean) => void;
}

export function createGameAudio(): GameAudio {
  let audioContext: AudioContext | null = null;

  // Dual player channels for crossfading
  const playerA = typeof Audio !== 'undefined' ? new Audio() : ({} as HTMLAudioElement);
  const playerB = typeof Audio !== 'undefined' ? new Audio() : ({} as HTMLAudioElement);

  if (typeof Audio !== 'undefined') {
    playerA.loop = true;
    playerA.preload = 'auto';
    playerB.loop = true;
    playerB.preload = 'auto';
  }

  let activePlayer = playerA;
  let inactivePlayer = playerB;
  let currentTrack = '';
  let stage = 0;
  let selection = 'auto';
  let targetVolume = 0.42;
  let currentMusicVolume = 0.42;
  let musicEnabled = true;
  let sfxEnabled = true;
  let ducked = false;
  let isPlaying = false;
  let isAutoplayBlocked = false;
  let crossfadeTimer: number | null = null;
  let duckAnimationTimer: number | null = null;

  // Preload sound effects
  const sounds: Record<string, { gain: number; pool: HTMLAudioElement[]; index: number }> = {};
  if (typeof Audio !== 'undefined') {
    for (const [key, [file, gain]] of Object.entries(FX)) {
      const a1 = new Audio(`/assets/sounds/${file}.wav`);
      const a2 = new Audio(`/assets/sounds/${file}.wav`);
      a1.preload = 'auto';
      a2.preload = 'auto';
      sounds[key] = {
        gain,
        pool: [a1, a2],
        index: 0,
      };
    }
  }

  const unlockAudioContext = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!audioContext) {
          audioContext = new AudioCtx();
        }
        if (audioContext.state === 'suspended') {
          audioContext.resume().catch(() => {});
        }
      }
    } catch {}
  };

  const computeEffectiveVolume = (baseVol: number, isDucked: boolean) => {
    if (!musicEnabled) return 0;
    return isDucked ? baseVol * 0.22 : baseVol;
  };

  const smoothRampVolume = (
    player: HTMLAudioElement,
    fromVol: number,
    toVol: number,
    durationMs: number,
    onComplete?: () => void
  ) => {
    if (!('volume' in player)) return;
    const startTime = performance.now();
    const step = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      const current = fromVol + (toVol - fromVol) * eased;
      try {
        player.volume = Math.max(0, Math.min(1, current));
      } catch {}

      if (progress < 1) {
        duckAnimationTimer = requestAnimationFrame(step);
      } else {
        try {
          player.volume = Math.max(0, Math.min(1, toVol));
        } catch {}
        if (onComplete) onComplete();
      }
    };
    if (duckAnimationTimer) cancelAnimationFrame(duckAnimationTimer);
    duckAnimationTimer = requestAnimationFrame(step);
  };

  const applyVolumeImmediately = () => {
    if ('volume' in activePlayer) {
      try {
        activePlayer.volume = computeEffectiveVolume(targetVolume, ducked);
      } catch {}
    }
  };

  function crossfadeTo(nextTrackKey: string) {
    const nextSrc = TRACKS[nextTrackKey];
    if (!nextSrc) return;

    if (nextTrackKey === currentTrack && isPlaying) {
      applyVolumeImmediately();
      return;
    }

    currentTrack = nextTrackKey;

    // If music is disabled, just change source silently
    if (!musicEnabled) {
      activePlayer.src = nextSrc;
      return;
    }

    // Prepare next player
    const fromPlayer = activePlayer;
    const toPlayer = inactivePlayer;

    toPlayer.src = nextSrc;
    toPlayer.currentTime = 0;
    toPlayer.volume = 0;

    const playPromise = toPlayer.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          isAutoplayBlocked = false;
          if (instance.onAutoplayChange) instance.onAutoplayChange(false);

          const startVol = fromPlayer.volume || computeEffectiveVolume(targetVolume, ducked);
          const endVol = computeEffectiveVolume(targetVolume, ducked);

          // Fade out old, fade in new
          smoothRampVolume(fromPlayer, startVol, 0, 700, () => {
            try {
              fromPlayer.pause();
            } catch {}
          });
          smoothRampVolume(toPlayer, 0, endVol, 700);

          // Swap active/inactive
          activePlayer = toPlayer;
          inactivePlayer = fromPlayer;
        })
        .catch(() => {
          // Fallback if blocked
          activePlayer = toPlayer;
          inactivePlayer = fromPlayer;
        });
    }
  }

  function syncTrack(forceFade: boolean = false) {
    const next = trackForStage(stage, selection);
    if (next !== currentTrack || forceFade) {
      if (isPlaying && currentTrack) {
        crossfadeTo(next);
      } else {
        currentTrack = next;
        activePlayer.src = TRACKS[next];
        applyVolumeImmediately();
        if (musicEnabled && !document.hidden) {
          activePlayer.play().catch(() => {});
        }
      }
    } else {
      applyVolumeImmediately();
    }
  }

  const instance: GameAudio = {
    onAutoplayChange: undefined,
    get track() {
      return currentTrack || trackForStage(stage, selection);
    },
    get musicEnabled() {
      return musicEnabled;
    },
    get sfxEnabled() {
      return sfxEnabled;
    },
    get selected() {
      return selection;
    },
    get isPlaying() {
      return isPlaying;
    },
    get isAutoplayBlocked() {
      return isAutoplayBlocked;
    },

    async attemptAutoplay(): Promise<boolean> {
      unlockAudioContext();
      if (!currentTrack) {
        currentTrack = trackForStage(stage, selection);
        activePlayer.src = TRACKS[currentTrack];
      }
      applyVolumeImmediately();

      if (!musicEnabled) {
        return true;
      }

      try {
        await activePlayer.play();
        isPlaying = true;
        isAutoplayBlocked = false;
        if (instance.onAutoplayChange) instance.onAutoplayChange(false);
        return true;
      } catch (err) {
        // Autoplay policy prevented playback until user interaction
        isPlaying = false;
        isAutoplayBlocked = true;
        if (instance.onAutoplayChange) instance.onAutoplayChange(true);
        return false;
      }
    },

    async unlock(): Promise<boolean> {
      unlockAudioContext();
      if (!currentTrack) {
        currentTrack = trackForStage(stage, selection);
        activePlayer.src = TRACKS[currentTrack];
      }
      applyVolumeImmediately();

      if (!musicEnabled) {
        isAutoplayBlocked = false;
        if (instance.onAutoplayChange) instance.onAutoplayChange(false);
        return true;
      }

      try {
        await activePlayer.play();
        isPlaying = true;
        isAutoplayBlocked = false;
        if (instance.onAutoplayChange) instance.onAutoplayChange(false);
        return true;
      } catch {
        return false;
      }
    },

    setStage(n: number) {
      if (stage === n) return;
      const oldAuto = trackForStage(stage, selection);
      const newAuto = trackForStage(n, selection);
      stage = n;
      if (oldAuto !== newAuto) {
        crossfadeTo(newAuto);
      }
    },

    setSelection(s: string) {
      selection = TRACKS[s] ? s : 'auto';
      const desiredTrack = trackForStage(stage, selection);
      if (desiredTrack !== currentTrack) {
        crossfadeTo(desiredTrack);
      }
    },

    setMusicEnabled(on: boolean) {
      musicEnabled = !!on;
      if (!musicEnabled) {
        try {
          activePlayer.pause();
          inactivePlayer.pause();
        } catch {}
        isPlaying = false;
      } else {
        applyVolumeImmediately();
        activePlayer.play().then(() => {
          isPlaying = true;
          isAutoplayBlocked = false;
          if (instance.onAutoplayChange) instance.onAutoplayChange(false);
        }).catch(() => {
          isAutoplayBlocked = true;
          if (instance.onAutoplayChange) instance.onAutoplayChange(true);
        });
      }
    },

    setSfxEnabled(on: boolean) {
      sfxEnabled = !!on;
    },

    setVolume(n: number) {
      targetVolume = Math.max(0, Math.min(1, Number(n) || 0));
      currentMusicVolume = targetVolume;
      applyVolumeImmediately();
    },

    duck(on: boolean) {
      ducked = !!on;
      if (!musicEnabled || !('volume' in activePlayer)) return;

      const fromVol = activePlayer.volume;
      const toVol = computeEffectiveVolume(targetVolume, ducked);
      // Smoothly ramp down in 120ms, ramp back up in 350ms
      smoothRampVolume(activePlayer, fromVol, toVol, ducked ? 120 : 350);
    },

    effect(key: SoundKey) {
      if (!sfxEnabled || (typeof document !== 'undefined' && document.hidden) || !sounds[key]) return;
      const v = sounds[key];
      const a = v.pool[v.index];
      v.index = (v.index + 1) % v.pool.length;
      try {
        a.pause();
        a.currentTime = 0;
        a.volume = v.gain;
        a.play().catch(() => {});
      } catch {}
    },

    pause() {
      try {
        activePlayer.pause();
      } catch {}
      isPlaying = false;
    },

    resume() {
      if (musicEnabled && !document.hidden) {
        activePlayer.play().then(() => {
          isPlaying = true;
          isAutoplayBlocked = false;
          if (instance.onAutoplayChange) instance.onAutoplayChange(false);
        }).catch(() => {});
      }
    },

    stop() {
      try {
        activePlayer.pause();
        activePlayer.currentTime = 0;
      } catch {}
      isPlaying = false;
    },
  };

  return instance;
}

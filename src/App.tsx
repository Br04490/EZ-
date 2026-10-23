import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GamePrefs, ScreenType } from './types';
import {
  STAGES,
  SISTER_LINES,
  GAME_SECONDS,
  secondsLeft,
  meterPosition,
  isMade,
  bucketSentence,
  clamp,
} from './engine';
import { createGameAudio, GameAudio, TRACK_NAMES } from './audio';
import { VOICE_CLIPS } from './voice-clips';
import { HomeScreen } from './components/HomeScreen';
import { StagesScreen } from './components/StagesScreen';
import { GameScreen, GameScreenHandle } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { MusicScreen } from './components/MusicScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ScoresScreen } from './components/ScoresScreen';
import { HelpScreen } from './components/HelpScreen';
import { CharacterApprovalModal } from './components/CharacterApprovalModal';

const PREF_KEY = 'ezra-be-hooping-v3-settings';
const DEFAULTS: GamePrefs = {
  stage: 0,
  easy: true,
  courtTap: true,
  music: true,
  sfx: true,
  voices: true,
  volume: 42,
  track: 'auto',
};

function readPrefs(): GamePrefs {
  try {
    const saved = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    return { ...DEFAULTS, ...saved };
  } catch {
    return { ...DEFAULTS };
  }
}

function savePrefs(p: GamePrefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch {}
}

function bestKey(stageId: string) {
  return `ezra-be-hooping-best-${stageId}`;
}

function getStoredBest(stageIndex: number): number {
  try {
    const stage = STAGES[stageIndex];
    if (!stage) return 0;
    return Math.max(0, Number(localStorage.getItem(bestKey(stage.id)) || 0) || 0);
  } catch {
    return 0;
  }
}

function storeBest(stageIndex: number, score: number) {
  try {
    const stage = STAGES[stageIndex];
    if (!stage) return;
    const currentBest = getStoredBest(stageIndex);
    localStorage.setItem(bestKey(stage.id), String(Math.max(currentBest, score)));
  } catch {}
}

export const App: React.FC = () => {
  const [prefs, setPrefs] = useState<GamePrefs>(readPrefs);
  const [screen, setScreen] = useState<ScreenType>('home');
  const [stageIndex, setStageIndex] = useState<number>(() =>
    clamp(Number(readPrefs().stage) || 0, 0, 2)
  );
  const [score, setScore] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(GAME_SECONDS);
  const [meterPos, setMeterPos] = useState<number>(0.5);
  const [shotLocked, setShotLocked] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);

  const audioRef = useRef<GameAudio | null>(null);
  const gameScreenRef = useRef<GameScreenHandle | null>(null);
  const voiceTokenRef = useRef<number>(0);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeTimersRef = useRef<Set<number>>(new Set());

  // Game loop tracking refs
  const playingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const pausedAtRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const roundRef = useRef<number>(0);
  const shotLockedRef = useRef<boolean>(false);
  const lastCountedRef = useRef<number>(6);
  const lastLineRef = useRef<number>(-1);
  const lastSisterSpeechRef = useRef<number>(0);
  const meterPosRef = useRef<number>(0.5);
  const rafRef = useRef<number>(0);

  // Initialize Audio
  if (!audioRef.current) {
    audioRef.current = createGameAudio();
  }

  const syncAudioWithPrefs = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.setStage(stageIndex);
    audio.setSelection(prefs.track);
    audio.setVolume((Number(prefs.volume) || 0) / 100);
    audio.setMusicEnabled(prefs.music);
    audio.setSfxEnabled(prefs.sfx);
  }, [stageIndex, prefs]);

  useEffect(() => {
    syncAudioWithPrefs();
  }, [syncAudioWithPrefs]);

  // Attempt autoplay immediately and register one-time gesture unlock for iOS Safari
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.onAutoplayChange = (blocked: boolean) => {
      setIsAutoplayBlocked(blocked);
    };

    // Attempt playback immediately when menu first appears
    audio.attemptAutoplay();

    const unlockOnFirstGesture = () => {
      audio.unlock();
      window.removeEventListener('pointerdown', unlockOnFirstGesture);
      window.removeEventListener('touchstart', unlockOnFirstGesture);
      window.removeEventListener('keydown', unlockOnFirstGesture);
    };

    window.addEventListener('pointerdown', unlockOnFirstGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnFirstGesture, { passive: true });
    window.addEventListener('keydown', unlockOnFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockOnFirstGesture);
      window.removeEventListener('touchstart', unlockOnFirstGesture);
      window.removeEventListener('keydown', unlockOnFirstGesture);
    };
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(() => {
      activeTimersRef.current.delete(id);
      fn();
    }, ms);
    activeTimersRef.current.add(id);
    return id;
  }, []);

  const clearGameTimers = useCallback(() => {
    for (const id of activeTimersRef.current) {
      window.clearTimeout(id);
    }
    activeTimersRef.current.clear();
  }, []);

  const announce = useCallback((text: string) => {
    setAnnouncement(text);
  }, []);

  const stopVoice = useCallback(() => {
    voiceTokenRef.current++;
    if (voiceAudioRef.current) {
      try {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      } catch {}
      voiceAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    audioRef.current?.duck(false);
  }, []);

  const speakFallback = useCallback(
    (who: 'Ezra' | 'Lennox', message: string, priority: boolean = true) => {
      if (
        !prefs.voices ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      )
        return;
      try {
        if (priority) window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(message);
        u.lang = 'en-US';
        u.rate = who === 'Ezra' ? 1.1 : 1.15;
        u.pitch = who === 'Ezra' ? 1.65 : 1.36;
        const voices = window.speechSynthesis
          .getVoices()
          .filter((x) => x.lang?.toLowerCase().startsWith('en'));
        const prefRegex =
          who === 'Ezra'
            ? /Eddy|Junior|Young|Reed|Boy/i
            : /Ava|Samantha|Zoe|Jenny|Girl/i;
        u.voice = voices.find((v) => prefRegex.test(v.name)) || voices[0] || null;
        u.onstart = () => audioRef.current?.duck(true);
        u.onend = () => audioRef.current?.duck(false);
        u.onerror = () => audioRef.current?.duck(false);
        window.speechSynthesis.speak(u);
      } catch {
        audioRef.current?.duck(false);
      }
    },
    [prefs.voices]
  );

  const speak = useCallback(
    (
      who: 'Ezra' | 'Lennox',
      message: string,
      { priority = false, key = '' }: { priority?: boolean; key?: string } = {}
    ) => {
      if (!prefs.voices) return;
      const token = ++voiceTokenRef.current;
      const clip = key ? VOICE_CLIPS[who]?.[key] : null;
      if (clip) {
        stopVoice();
        const token2 = voiceTokenRef.current;
        try {
          const a = new Audio(clip);
          voiceAudioRef.current = a;
          audioRef.current?.duck(true);
          a.onended = () => {
            if (voiceTokenRef.current === token2) {
              voiceAudioRef.current = null;
              audioRef.current?.duck(false);
            }
          };
          a.onerror = () => {
            if (voiceTokenRef.current === token2) {
              voiceAudioRef.current = null;
              audioRef.current?.duck(false);
              speakFallback(who, message);
            }
          };
          a.play().catch(() => {
            if (voiceTokenRef.current === token2) {
              voiceAudioRef.current = null;
              audioRef.current?.duck(false);
              speakFallback(who, message);
            }
          });
          return;
        } catch {}
      }

      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
      speakFallback(who, message, priority);
    },
    [prefs.voices, stopVoice, speakFallback]
  );

  const sisterComment = useCallback(() => {
    if (!playingRef.current) return;
    let index = Math.floor(Math.random() * SISTER_LINES.length);
    if (index === lastLineRef.current) index = (index + 1) % SISTER_LINES.length;
    lastLineRef.current = index;
    const line = SISTER_LINES[index];
    gameScreenRef.current?.showSisterCaption(line, 1800);

    if (performance.now() - lastSisterSpeechRef.current > 3500) {
      lastSisterSpeechRef.current = performance.now();
      speak('Lennox', line, {
        priority: false,
        key: `sister-${String(index + 1).padStart(2, '0')}`,
      });
    }
  }, [speak]);

  const finishRound = useCallback(() => {
    if (!playingRef.current) return;
    playingRef.current = false;
    shotLockedRef.current = true;
    setShotLocked(true);
    setSeconds(0);
    clearGameTimers();

    const audio = audioRef.current;
    if (audio) {
      audio.effect('buzzer');
      audio.effect('cheer');
      // Background music continues seamlessly into the results screen
    }
    stopVoice();

    const currentScore = scoreRef.current;
    storeBest(stageIndex, currentScore);

    setScreen('results');
    announce(`${currentScore} buckets. Time is up.`);
    speak('Ezra', bucketSentence(currentScore), {
      priority: true,
      key: `bucket-total-${currentScore}`,
    });
  }, [clearGameTimers, stopVoice, stageIndex, announce, speak]);

  const countDown = useCallback(
    (n: number) => {
      gameScreenRef.current?.showCountdown(n);
      gameScreenRef.current?.showSisterCaption(`${n}!`, 900);
      speak('Lennox', String(n), { priority: true, key: `countdown-${n}` });
      if (n === 5) {
        audioRef.current?.effect('green');
      }
    },
    [speak]
  );

  // Navigating between menus keeps background music running continuously
  const enterMenu = useCallback(
    (target: ScreenType = 'home') => {
      clearGameTimers();
      roundRef.current++;
      playingRef.current = false;
      isPausedRef.current = false;
      setIsPaused(false);
      shotLockedRef.current = false;
      setShotLocked(false);
      // Music continues playing without resetting or stopping
      stopVoice();
      gameScreenRef.current?.resetVisualEffects();
      setScreen(target);
    },
    [clearGameTimers, stopVoice]
  );

  const selectStage = useCallback(
    (index: number) => {
      const stage = STAGES[index];
      if (!stage) return;
      setStageIndex(index);
      setPrefs((prev) => {
        const next = { ...prev, stage: index };
        savePrefs(next);
        return next;
      });
      // Crossfade if auto track changes
      audioRef.current?.setStage(index);
    },
    []
  );

  const startRound = useCallback(() => {
    clearGameTimers();
    stopVoice();
    gameScreenRef.current?.resetVisualEffects();

    roundRef.current++;
    scoreRef.current = 0;
    setScore(0);
    setSeconds(GAME_SECONDS);
    setMeterPos(0.5);
    meterPosRef.current = 0.5;
    lastCountedRef.current = 6;
    lastLineRef.current = -1;
    lastSisterSpeechRef.current = 0;

    shotLockedRef.current = false;
    setShotLocked(false);
    isPausedRef.current = false;
    setIsPaused(false);
    pausedAtRef.current = 0;
    startedAtRef.current = performance.now();
    playingRef.current = true;

    setScreen('game');
    syncAudioWithPrefs();
    audioRef.current?.unlock();

    gameScreenRef.current?.showSisterCaption("Let's go, Ezra!", 1400);
    speak('Ezra', "Let's hoop!", { priority: true, key: 'lets-hoop' });
    announce('30 seconds. Tap the big orange button or the court to shoot.');
  }, [clearGameTimers, stopVoice, syncAudioWithPrefs, speak, announce]);

  const shoot = useCallback(() => {
    if (
      screen !== 'game' ||
      !playingRef.current ||
      isPausedRef.current ||
      shotLockedRef.current ||
      secondsLeft(performance.now(), startedAtRef.current) <= 0
    ) {
      return;
    }

    shotLockedRef.current = true;
    setShotLocked(true);

    const currentRound = roundRef.current;
    const pos = meterPosRef.current;
    const made = isMade(pos, prefs.easy);

    audioRef.current?.effect('shot');
    gameScreenRef.current?.triggerShotAnimation(made, pos);

    if (made) {
      scoreRef.current++;
      const currentScore = scoreRef.current;
      setScore(currentScore);
      gameScreenRef.current?.showMakeTitle('GREEN!', false);
      announce(`Green! EZ money! ${currentScore} buckets!`);
      speak('Ezra', 'Green! EZ money!', { priority: true, key: 'green-ez-money' });

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(25);
        } catch {}
      }

      if (currentScore === 1 || currentScore % 3 === 0) {
        after(1250, () => {
          if (roundRef.current === currentRound) sisterComment();
        });
      }
    } else {
      gameScreenRef.current?.showMakeTitle('ALMOST!', true);
      if (Math.random() < 0.45) {
        gameScreenRef.current?.showSisterCaption('You got the next one!', 1100);
      }
    }

    after(430, () => {
      if (roundRef.current !== currentRound) return;
      if (made) {
        audioRef.current?.effect('swish');
        audioRef.current?.effect('green');
        gameScreenRef.current?.triggerSwish();
        gameScreenRef.current?.popParticles();
        if (scoreRef.current % 3 === 0 || stageIndex === 2) {
          audioRef.current?.effect('cheer');
        }
      } else {
        audioRef.current?.effect('rim');
        audioRef.current?.effect('bounce');
      }
    });

    after(660, () => {
      if (roundRef.current === currentRound) {
        shotLockedRef.current = false;
        setShotLocked(false);
      }
    });
  }, [screen, prefs.easy, announce, speak, after, sisterComment, stageIndex]);

  const showPause = useCallback(() => {
    if (!playingRef.current || isPausedRef.current) return;
    isPausedRef.current = true;
    pausedAtRef.current = performance.now();
    setIsPaused(true);
    audioRef.current?.pause();
    stopVoice();
  }, [stopVoice]);

  const resumeRound = useCallback(() => {
    if (!playingRef.current || !isPausedRef.current) return;
    startedAtRef.current += performance.now() - pausedAtRef.current;
    isPausedRef.current = false;
    pausedAtRef.current = 0;
    setIsPaused(false);
    syncAudioWithPrefs();
    audioRef.current?.resume();
  }, [syncAudioWithPrefs]);

  // Request Animation Frame loop for timing and shot meter
  useEffect(() => {
    const frame = (now: number) => {
      if (playingRef.current && !isPausedRef.current) {
        const remain = secondsLeft(now, startedAtRef.current);
        setSeconds(remain);

        if (remain === 0) {
          finishRound();
        } else {
          if (remain <= 5 && remain < lastCountedRef.current) {
            lastCountedRef.current = remain;
            countDown(remain);
          }
          const speed = prefs.easy ? 0.88 : 1.35;
          const pos = meterPosition(now - startedAtRef.current, speed);
          meterPosRef.current = pos;
          setMeterPos(pos);
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finishRound, countDown, prefs.easy]);

  // Global keydown handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && screen === 'game') {
        e.preventDefault();
        if (isPausedRef.current) {
          resumeRound();
        } else {
          showPause();
        }
        return;
      }
      if (
        (e.key === ' ' || e.key === 'Enter') &&
        screen === 'game' &&
        !isPausedRef.current
      ) {
        const target = e.target as HTMLElement | null;
        if (target?.closest('button, [role=button], input')) return;
        e.preventDefault();
        shoot();
      }
    };

    const handleVisibility = () => {
      if (document.hidden && playingRef.current && !isPausedRef.current) {
        showPause();
      }
    };

    const handlePageHide = () => {
      if (playingRef.current && !isPausedRef.current) {
        showPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [screen, resumeRound, showPause, shoot]);

  const updatePref = useCallback(
    <K extends keyof GamePrefs>(key: K, value: GamePrefs[K]) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        savePrefs(next);
        return next;
      });
      if (key === 'voices' && !value) {
        stopVoice();
      }
    },
    [stopVoice]
  );

  const currentStage = STAGES[stageIndex] || STAGES[0];

  return (
    <div
      id="app"
      className={`app ${currentStage.className}`}
      aria-label="Ezra Be Hooping game"
    >
      {screen === 'home' && (
        <HomeScreen
          onPlay={startRound}
          onNavigate={(s) => setScreen(s)}
          isAutoplayBlocked={isAutoplayBlocked}
          onUnlockSound={() => audioRef.current?.unlock()}
          onOpenApprovalModal={() => setShowApprovalModal(true)}
        />
      )}

      {screen === 'stages' && (
        <StagesScreen
          currentStage={stageIndex}
          onSelectStage={selectStage}
          onNavigate={(s) => enterMenu(s)}
          onStartGame={startRound}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          ref={gameScreenRef}
          stage={currentStage}
          seconds={seconds}
          score={score}
          meterPosition={meterPos}
          shotLocked={shotLocked}
          isPaused={isPaused}
          prefs={prefs}
          onShoot={shoot}
          onPause={showPause}
          onResume={resumeRound}
          onQuit={() => enterMenu('home')}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          score={score}
          stageIndex={stageIndex}
          bestScore={getStoredBest(stageIndex)}
          onPlayAgain={startRound}
          onNavigate={(s) => enterMenu(s)}
        />
      )}

      {screen === 'music' && (
        <MusicScreen
          currentTrack={prefs.track}
          musicEnabled={prefs.music}
          volume={prefs.volume}
          onSelectTrack={(track) => {
            updatePref('track', track);
            audioRef.current?.setSelection(track);
            announce(
              `Selected ${
                track === 'auto' ? 'automatic by stage' : TRACK_NAMES[track]
              }.`
            );
          }}
          onToggleMusic={(enabled) => updatePref('music', enabled)}
          onChangeVolume={(volume) => updatePref('volume', volume)}
          onNavigate={(s) => enterMenu(s)}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          prefs={prefs}
          onUpdatePref={updatePref}
          onNavigate={(s) => enterMenu(s)}
        />
      )}

      {screen === 'scores' && (
        <ScoresScreen
          getBestScore={getStoredBest}
          onNavigate={(s) => enterMenu(s)}
        />
      )}

      {screen === 'help' && (
        <HelpScreen onPlay={startRound} onNavigate={(s) => enterMenu(s)} />
      )}

      {/* Section 10: Character Approval Gate Interactive Review */}
      <CharacterApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
      />

      <div className="sr-only" aria-live="polite" id="announcer">
        {announcement}
      </div>
    </div>
  );
};

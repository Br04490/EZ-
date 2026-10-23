import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Stage, GamePrefs } from '../types';
import { formatTime, greenWidth } from '../engine';

export interface GameScreenHandle {
  triggerShotAnimation: (made: boolean, side: number) => void;
  triggerSwish: () => void;
  triggerMissEffects: () => void;
  showMakeTitle: (text: string, miss: boolean) => void;
  showSisterCaption: (text: string, duration?: number) => void;
  showCountdown: (n: number) => void;
  popParticles: () => void;
  resetVisualEffects: () => void;
}

interface GameScreenProps {
  stage: Stage;
  seconds: number;
  score: number;
  meterPosition: number;
  shotLocked: boolean;
  isPaused: boolean;
  prefs: GamePrefs;
  onShoot: () => void;
  onPause: () => void;
  onResume: () => void;
  onQuit: () => void;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  color: string;
  dx: string;
  dy: string;
  rot: string;
  char: string;
}

export const GameScreen = forwardRef<GameScreenHandle, GameScreenProps>(
  (
    {
      stage,
      seconds,
      score,
      meterPosition,
      shotLocked,
      isPaused,
      prefs,
      onShoot,
      onPause,
      onResume,
      onQuit,
    },
    ref
  ) => {
    const gameScreenRef = useRef<HTMLDivElement>(null);
    const flightBallRef = useRef<HTMLDivElement>(null);
    const ballAnimRef = useRef<Animation | null>(null);

    const [netSwish, setNetSwish] = useState(false);
    const [swishActive, setSwishActive] = useState(false);
    const [makeTitle, setMakeTitle] = useState<{ text: string; miss: boolean; show: boolean }>({
      text: 'GREEN!',
      miss: false,
      show: false,
    });
    const [sisterCaption, setSisterCaption] = useState<{ text: string; show: boolean }>({
      text: '',
      show: false,
    });
    const [countdown, setCountdown] = useState<{ num: number; show: boolean }>({
      num: 5,
      show: false,
    });
    const [particles, setParticles] = useState<Particle[]>([]);

    const captionTimerRef = useRef<number | null>(null);
    const particleTimerRef = useRef<number | null>(null);
    const titleTimerRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      triggerShotAnimation: (made: boolean, side: number) => {
        const ball = flightBallRef.current;
        const container = gameScreenRef.current;
        if (!ball || !container) return;

        if (ballAnimRef.current) {
          ballAnimRef.current.cancel();
          ballAnimRef.current = null;
        }

        const rect = container.getBoundingClientRect();
        const [ax, ay] = stage.origin;
        const [hx, hy] = stage.hoop;

        const startX = ax * rect.width - 20;
        const startY = ay * rect.height - 20;
        const endX = hx * rect.width - 20 + (made ? 0 : side < 0.5 ? -57 : 57);
        const endY = hy * rect.height - 20 + (made ? 27 : -10);

        ball.style.left = `${startX}px`;
        ball.style.top = `${startY}px`;
        ball.style.opacity = '1';

        const dx = endX - startX;
        const dy = endY - startY;

        if (ball.animate) {
          const anim = ball.animate(
            [
              { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
              {
                transform: `translate(${dx * 0.52}px, ${dy * 0.52 - 82}px) scale(0.86) rotate(180deg)`,
                opacity: 1,
                offset: 0.5,
              },
              {
                transform: `translate(${dx}px, ${dy}px) scale(0.63) rotate(320deg)`,
                opacity: 1,
                offset: 0.85,
              },
              {
                transform: `translate(${dx}px, ${dy + 39}px) scale(0.42) rotate(400deg)`,
                opacity: 0,
                offset: 1,
              },
            ],
            { duration: 660, easing: 'ease-out', fill: 'forwards' }
          );
          ballAnimRef.current = anim;
          anim.onfinish = () => {
            ball.style.opacity = '0';
            ballAnimRef.current = null;
          };
          anim.oncancel = () => {
            ball.style.opacity = '0';
          };
        } else {
          ball.style.opacity = '0';
        }
      },
      triggerSwish: () => {
        setNetSwish(false);
        setSwishActive(false);
        requestAnimationFrame(() => {
          setNetSwish(true);
          setSwishActive(true);
        });
        setTimeout(() => {
          setNetSwish(false);
          setSwishActive(false);
        }, 660);
      },
      triggerMissEffects: () => {
        // Visual effects for miss handled via make title
      },
      showMakeTitle: (text: string, miss: boolean) => {
        if (titleTimerRef.current) window.clearTimeout(titleTimerRef.current);
        setMakeTitle({ text, miss, show: false });
        requestAnimationFrame(() => {
          setMakeTitle({ text, miss, show: true });
        });
        titleTimerRef.current = window.setTimeout(() => {
          setMakeTitle((prev) => ({ ...prev, show: false }));
        }, 850);
      },
      showSisterCaption: (text: string, duration: number = 1800) => {
        if (captionTimerRef.current) window.clearTimeout(captionTimerRef.current);
        setSisterCaption({ text, show: true });
        captionTimerRef.current = window.setTimeout(() => {
          setSisterCaption((prev) => ({ ...prev, show: false }));
        }, duration);
      },
      showCountdown: (n: number) => {
        setCountdown({ num: n, show: false });
        requestAnimationFrame(() => {
          setCountdown({ num: n, show: true });
        });
      },
      popParticles: () => {
        if (particleTimerRef.current) window.clearTimeout(particleTimerRef.current);
        const newParticles: Particle[] = [];
        for (let i = 0; i < 15; i++) {
          newParticles.push({
            id: Date.now() + i,
            left: `${20 + Math.random() * 60}%`,
            top: `${19 + Math.random() * 30}%`,
            color: i % 3 === 0 ? '#ffe343' : '#75ff36',
            dx: `${Math.round((Math.random() - 0.5) * 155)}px`,
            dy: `${Math.round((Math.random() - 0.5) * 130)}px`,
            rot: `${Math.round(Math.random() * 360)}deg`,
            char: i % 3 === 0 ? '⭐' : '✦',
          });
        }
        setParticles(newParticles);
        particleTimerRef.current = window.setTimeout(() => {
          setParticles([]);
        }, 900);
      },
      resetVisualEffects: () => {
        setNetSwish(false);
        setSwishActive(false);
        setMakeTitle({ text: 'GREEN!', miss: false, show: false });
        setSisterCaption({ text: '', show: false });
        setCountdown({ num: 5, show: false });
        setParticles([]);
        if (flightBallRef.current) {
          flightBallRef.current.style.opacity = '0';
        }
        if (ballAnimRef.current) {
          ballAnimRef.current.cancel();
          ballAnimRef.current = null;
        }
      },
    }));

    const greenZonePercentage = greenWidth(prefs.easy) * 100;
    const pointerPercentage = meterPosition * 100;

    return (
      <section
        id="game-screen"
        ref={gameScreenRef}
        className="screen game-screen"
        aria-label="Basketball gameplay"
      >
        <div id="game-art" className="game-art" aria-hidden="true"></div>
        <div className="game-vignette" aria-hidden="true"></div>

        <div
          id="court-tap-zone"
          className="court-tap-zone"
          role="button"
          tabIndex={0}
          aria-label="Tap the court to shoot a basketball"
          aria-disabled={!prefs.courtTap}
          onPointerDown={(e) => {
            if (!prefs.courtTap || e.button !== 0) return;
            e.preventDefault();
            onShoot();
          }}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && prefs.courtTap) {
              e.preventDefault();
              onShoot();
            }
          }}
        ></div>

        <header className="game-hud" aria-label="Scoreboard">
          <button
            type="button"
            id="pause-btn"
            className="hud-pause"
            aria-label="Pause game"
            onClick={onPause}
          >
            Ⅱ
          </button>
          <div
            className={`hud-pill time ${seconds <= 5 ? 'danger' : ''}`}
            id="time-container"
          >
            <span className="hud-icon">⏱</span>
            <strong id="time-value">{formatTime(seconds)}</strong>
          </div>
          <div className="hud-pill score">
            <span className="hud-icon">🏀</span>
            <div className="score-value">
              <strong id="score-value">{score}</strong>
              <small>BUCKETS</small>
            </div>
          </div>
        </header>

        <div className="stage-corner" id="game-stage-label" aria-hidden="true">
          {stage.name}
        </div>

        <div ref={flightBallRef} className="basketball" id="flight-ball" aria-hidden="true">
          🏀
        </div>

        <img
          id="net-effect"
          className={`net-effect ${netSwish ? 'swish' : ''}`}
          src={stage.net}
          alt=""
          aria-hidden="true"
        />

        <div
          id="swish-flash"
          className={`swish-flash ${swishActive ? 'active' : ''}`}
          aria-hidden="true"
        >
          ✦ ✨ ✦
        </div>

        <div
          id="made-title"
          className={`made-title ${makeTitle.show ? 'show' : ''} ${makeTitle.miss ? 'miss' : ''}`}
          aria-live="polite"
        >
          {makeTitle.text}
        </div>

        <div
          id="sister-caption"
          className={`sister-caption ${sisterCaption.show ? 'show' : ''}`}
          aria-live="polite"
        >
          {sisterCaption.text}
        </div>

        <div
          id="countdown-call"
          className={`countdown-call ${countdown.show ? 'show' : ''}`}
          aria-live="off"
        >
          {countdown.num}
        </div>

        <div id="effect-particles" className="effect-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="spark"
              style={
                {
                  left: p.left,
                  top: p.top,
                  color: p.color,
                  '--dx': p.dx,
                  '--dy': p.dy,
                  '--rot': p.rot,
                } as React.CSSProperties
              }
            >
              {p.char}
            </span>
          ))}
        </div>

        <div className="shot-ui">
          <div
            className="shot-meter"
            id="shot-meter"
            role="meter"
            aria-label="Shot timing meter, green is a make"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pointerPercentage)}
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              e.preventDefault();
              onShoot();
            }}
          >
            <div
              className="shot-green"
              id="green-zone"
              style={{ width: `${greenZonePercentage}%` }}
            ></div>
            <div
              className="shot-pointer"
              id="shot-pointer"
              style={{ left: `${pointerPercentage}%` }}
            >
              <span>🏀</span>
              <b>▼</b>
            </div>
          </div>
          <button
            type="button"
            id="shoot-btn"
            className="arcade-btn gold shoot-btn"
            disabled={shotLocked || isPaused || seconds <= 0}
            onClick={onShoot}
          >
            <span aria-hidden="true">🏀</span> TAP TO SHOOT
          </button>
          <span className="tap-hint">TAP THE BUTTON OR ANYWHERE ON THE COURT</span>
        </div>

        {isPaused && (
          <div id="pause-overlay" className="modal-shade">
            <div className="modal-card">
              <h2>PAUSED</h2>
              <p>Ready for more buckets?</p>
              <button type="button" id="resume-btn" className="arcade-btn gold" onClick={onResume}>
                ▶ RESUME
              </button>
              <button type="button" id="quit-btn" className="arcade-btn blue" onClick={onQuit}>
                ⌂ MAIN MENU
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }
);
GameScreen.displayName = 'GameScreen';

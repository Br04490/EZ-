import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onPlay: () => void;
  onNavigate: (screen: ScreenType) => void;
  isAutoplayBlocked?: boolean;
  onUnlockSound?: () => void;
  onOpenApprovalModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onNavigate,
  isAutoplayBlocked = false,
  onUnlockSound,
  onOpenApprovalModal,
}) => {
  const [animateEntrance, setAnimateEntrance] = useState(false);

  useEffect(() => {
    // Trigger staggered entrance animation sequence on menu mount
    setAnimateEntrance(true);
  }, []);

  return (
    <section id="home-screen" className="screen home-screen" aria-label="Main menu">
      <div className="home-scene" aria-hidden="true"></div>

      {/* Optional subtle Sound Unlock Banner when browser autoplay blocks audio */}
      {isAutoplayBlocked && (
        <button
          type="button"
          className="sound-unlock-pill"
          onClick={onUnlockSound}
          aria-label="Tap to enable sound"
        >
          <span aria-hidden="true">♫</span>
          <span>TAP FOR SOUND</span>
        </button>
      )}

      <div className="home-content">
        <div
          className={`brand ${animateEntrance ? 'anim-enter' : ''}`}
          aria-label="Ezra Be Hooping"
        >
          <span className="brand-crown">♛</span>
          <span className="brand-ezra">
            EZRA<span className="brand-ball">🏀</span>
          </span>
          <span className="brand-bottom">BE HOOPING!</span>
        </div>
        <div className="home-spacer"></div>
        <div className="home-actions">
          <button
            type="button"
            className={`arcade-btn gold primary-home ${animateEntrance ? 'anim-enter' : ''}`}
            id="play-btn"
            onClick={onPlay}
          >
            <span aria-hidden="true">▶</span> PLAY
          </button>
          <button
            type="button"
            className={`arcade-btn blue ${animateEntrance ? 'anim-enter' : ''}`}
            id="stages-btn"
            onClick={() => onNavigate('stages')}
          >
            <span aria-hidden="true">▣</span> STAGES
          </button>
          <button
            type="button"
            className={`arcade-btn purple ${animateEntrance ? 'anim-enter' : ''}`}
            id="music-btn"
            onClick={() => onNavigate('music')}
          >
            <span aria-hidden="true">♫</span> MUSIC
          </button>
          <nav
            className={`quick-nav ${animateEntrance ? 'anim-enter' : ''}`}
            aria-label="More options"
          >
            <button
              type="button"
              id="settings-btn"
              className="round-btn"
              aria-label="Settings"
              onClick={() => onNavigate('settings')}
            >
              <span>⚙</span>
              <small>SETTINGS</small>
            </button>
            <button
              type="button"
              id="scores-btn"
              className="round-btn"
              aria-label="High scores"
              onClick={() => onNavigate('scores')}
            >
              <span>🏆</span>
              <small>HIGH SCORES</small>
            </button>
            <button
              type="button"
              id="help-btn"
              className="round-btn"
              aria-label="How to play"
              onClick={() => onNavigate('help')}
            >
              <span>?</span>
              <small>HOW TO PLAY</small>
            </button>
            {onOpenApprovalModal && (
              <button
                type="button"
                id="models-btn"
                className="round-btn"
                aria-label="Character 3D Approval Gate"
                onClick={onOpenApprovalModal}
                title="Inspect 3D Character Approval Gate"
              >
                <span>👤</span>
                <small>3D RIGS</small>
              </button>
            )}
          </nav>
        </div>
      </div>
    </section>
  );
};

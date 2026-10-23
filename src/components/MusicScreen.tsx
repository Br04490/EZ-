import React from 'react';
import { TRACKS, TRACK_NAMES } from '../audio';
import { ScreenType } from '../types';

interface MusicScreenProps {
  currentTrack: string;
  musicEnabled: boolean;
  volume: number;
  onSelectTrack: (track: string) => void;
  onToggleMusic: (enabled: boolean) => void;
  onChangeVolume: (volume: number) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({
  currentTrack,
  musicEnabled,
  volume,
  onSelectTrack,
  onToggleMusic,
  onChangeVolume,
  onNavigate,
}) => {
  return (
    <section id="music-screen" className="screen section-screen" aria-label="Music settings">
      <header className="section-head">
        <button
          type="button"
          className="back-btn"
          data-back="home"
          aria-label="Back to main menu"
          onClick={() => onNavigate('home')}
        >
          ‹
        </button>
        <h2>♫ MUSIC</h2>
        <span className="head-crown">♛</span>
      </header>
      <div className="panel-stack">
        <p className="section-copy">CHOOSE THE SONG FOR YOUR NEXT ROUND</p>

        <button
          className={`music-choice ${currentTrack === 'auto' ? 'active' : ''}`}
          type="button"
          data-track="auto"
          aria-pressed={currentTrack === 'auto'}
          onClick={() => onSelectTrack('auto')}
        >
          <span className="album-art">🏀</span>
          <span className="track-info">
            <b>AUTO BY STAGE</b>
            <small>Backyard: Got Game · Others: Be Hooping</small>
          </span>
          <span className="track-indicator">{currentTrack === 'auto' ? '✓' : '▶'}</span>
        </button>

        <button
          className={`music-choice ${currentTrack === 'ezra-be-hooping-2' ? 'active' : ''}`}
          type="button"
          data-track="ezra-be-hooping-2"
          aria-pressed={currentTrack === 'ezra-be-hooping-2'}
          onClick={() => onSelectTrack('ezra-be-hooping-2')}
        >
          <span className="album-art">🎤</span>
          <span className="track-info">
            <b>Ezra Be Hooping 2</b>
            <small>Original full song · Track 1</small>
          </span>
          <span className="track-indicator">
            {currentTrack === 'ezra-be-hooping-2' ? '✓' : '▶'}
          </span>
        </button>

        <button
          className={`music-choice ${currentTrack === 'ezra-got-game' ? 'active' : ''}`}
          type="button"
          data-track="ezra-got-game"
          aria-pressed={currentTrack === 'ezra-got-game'}
          onClick={() => onSelectTrack('ezra-got-game')}
        >
          <span className="album-art">⭐</span>
          <span className="track-info">
            <b>Ezra Got Game</b>
            <small>Original full song · Track 2</small>
          </span>
          <span className="track-indicator">
            {currentTrack === 'ezra-got-game' ? '✓' : '▶'}
          </span>
        </button>

        <label className="control-row">
          <span>♫ MUSIC ON</span>
          <input
            id="music-enabled"
            type="checkbox"
            checked={musicEnabled}
            onChange={(e) => onToggleMusic(e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <label className="slider-row">
          <span>VOLUME</span>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onChangeVolume(Number(e.target.value))}
            aria-label="Music volume"
          />
        </label>

        <button
          type="button"
          className="arcade-btn blue bottom-home"
          data-back="home"
          onClick={() => onNavigate('home')}
        >
          ⌂ MAIN MENU
        </button>
      </div>
    </section>
  );
};

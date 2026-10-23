import React from 'react';
import { GamePrefs, ScreenType } from '../types';

interface SettingsScreenProps {
  prefs: GamePrefs;
  onUpdatePref: <K extends keyof GamePrefs>(key: K, value: GamePrefs[K]) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  prefs,
  onUpdatePref,
  onNavigate,
}) => {
  return (
    <section id="settings-screen" className="screen section-screen" aria-label="Game settings">
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
        <h2>⚙ SETTINGS</h2>
        <span className="head-crown">♛</span>
      </header>
      <div className="panel-stack settings-stack">
        <label className="control-row">
          <span>♫ MUSIC</span>
          <input
            id="settings-music"
            type="checkbox"
            checked={prefs.music}
            onChange={(e) => onUpdatePref('music', e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <label className="control-row">
          <span>◖)) SOUND EFFECTS</span>
          <input
            id="settings-sfx"
            type="checkbox"
            checked={prefs.sfx}
            onChange={(e) => onUpdatePref('sfx', e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <label className="control-row">
          <span>
            🎤 VOICES <small>Ezra & Lennox dialogue</small>
          </span>
          <input
            id="settings-voices"
            type="checkbox"
            checked={prefs.voices}
            onChange={(e) => onUpdatePref('voices', e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <label className="control-row">
          <span>
            ♛ LITTLE HOOPER MODE <small>Extra-wide green zone</small>
          </span>
          <input
            id="settings-easy"
            type="checkbox"
            checked={prefs.easy}
            onChange={(e) => onUpdatePref('easy', e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <label className="control-row">
          <span>
            ☝ COURT TAP SHOOTING <small>Tap the court as well as the button</small>
          </span>
          <input
            id="settings-court-tap"
            type="checkbox"
            checked={prefs.courtTap}
            onChange={(e) => onUpdatePref('courtTap', e.target.checked)}
          />
          <span className="toggle-indicator"></span>
        </label>

        <p className="settings-note">
          The orange TAP TO SHOOT button always works. No sign-in, data collection, or purchases.
        </p>

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

import React from 'react';
import { STAGES } from '../engine';
import { ScreenType } from '../types';

interface ScoresScreenProps {
  getBestScore: (stageIndex: number) => number;
  onNavigate: (screen: ScreenType) => void;
}

export const ScoresScreen: React.FC<ScoresScreenProps> = ({ getBestScore, onNavigate }) => {
  return (
    <section id="scores-screen" className="screen section-screen" aria-label="High scores">
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
        <h2>🏆 HIGH SCORES</h2>
        <span className="head-crown">♛</span>
      </header>
      <div className="panel-stack" id="highscores-list">
        {STAGES.map((s, index) => (
          <div key={s.id} className="score-record">
            <span>{s.name}</span>
            <strong>{getBestScore(index)}</strong>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="arcade-btn gold panel-bottom"
        data-back="home"
        onClick={() => onNavigate('home')}
      >
        ⌂ HOME
      </button>
    </section>
  );
};

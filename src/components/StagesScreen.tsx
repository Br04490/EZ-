import React from 'react';
import { STAGES } from '../engine';
import { ScreenType } from '../types';

interface StagesScreenProps {
  currentStage: number;
  onSelectStage: (index: number) => void;
  onNavigate: (screen: ScreenType) => void;
  onStartGame: () => void;
}

export const StagesScreen: React.FC<StagesScreenProps> = ({
  currentStage,
  onSelectStage,
  onNavigate,
  onStartGame,
}) => {
  return (
    <section id="stages-screen" className="screen section-screen" aria-label="Choose a stage">
      <header className="section-head">
        <button
          type="button"
          className="back-btn"
          data-back="home"
          aria-label="Back to home"
          onClick={() => onNavigate('home')}
        >
          ‹
        </button>
        <h2>CHOOSE A STAGE</h2>
        <span className="head-crown">♛</span>
      </header>
      <div id="stage-cards" className="stage-cards" aria-label="Basketball court selection">
        {STAGES.map((stage, i) => (
          <button
            key={stage.id}
            type="button"
            className={`stage-card ${currentStage === i ? 'selected' : ''}`}
            aria-label={`Select ${stage.name} basketball court`}
            aria-pressed={currentStage === i}
            onClick={() => {
              onSelectStage(i);
              onStartGame();
            }}
          >
            <img src={stage.card} alt="" loading="eager" />
            <b>{stage.name}</b>
          </button>
        ))}
      </div>
      <div className="section-bottom">
        <span>EVERY STAGE HAS THE SAME EASY CONTROLS</span>
      </div>
    </section>
  );
};

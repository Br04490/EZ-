import React from 'react';
import { STAGES } from '../engine';
import { ScreenType } from '../types';

interface ResultsScreenProps {
  score: number;
  stageIndex: number;
  bestScore: number;
  onPlayAgain: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  stageIndex,
  bestScore,
  onPlayAgain,
  onNavigate,
}) => {
  const currentStage = STAGES[stageIndex] || STAGES[0];
  const quip = score >= 10 ? 'GREEN! EZ MONEY!' : "NICE HOOPIN'!";

  return (
    <section id="results-screen" className="screen results-screen" aria-label="Game results">
      <div
        className="result-art"
        aria-hidden="true"
        style={{ backgroundImage: `url('${currentStage.image}')` }}
      ></div>
      <div className="results-gradient" aria-hidden="true"></div>
      <div className="results-content">
        <div className="result-title">♛ TIME'S UP! ♛</div>
        <p className="result-label">YOU MADE</p>
        <div className="result-total" id="result-total">
          {score}
        </div>
        <div className="result-buckets">BUCKETS!</div>
        <p id="result-best" className="result-best">
          PERSONAL BEST: {bestScore}
        </p>
        <p id="result-quip" className="result-quip">
          {quip}
        </p>
        <div className="results-actions">
          <button type="button" id="again-btn" className="arcade-btn gold" onClick={onPlayAgain}>
            ↻ PLAY AGAIN
          </button>
          <button
            type="button"
            id="change-btn"
            className="arcade-btn blue"
            onClick={() => onNavigate('stages')}
          >
            CHANGE STAGE
          </button>
          <button
            type="button"
            id="result-home-btn"
            className="arcade-btn purple"
            onClick={() => onNavigate('home')}
          >
            ⌂ MAIN MENU
          </button>
        </div>
      </div>
    </section>
  );
};

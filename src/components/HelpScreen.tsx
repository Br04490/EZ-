import React from 'react';
import { ScreenType } from '../types';

interface HelpScreenProps {
  onPlay: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({ onPlay, onNavigate }) => {
  return (
    <section id="help-screen" className="screen section-screen" aria-label="How to play">
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
        <h2>HOW TO PLAY</h2>
        <span className="head-crown">♛</span>
      </header>
      <div className="panel-stack help-stack">
        <div className="how-step">
          <span>①</span>
          <p>
            Choose one of the <b>3 basketball courts</b> and tap PLAY.
          </p>
        </div>
        <div className="how-step">
          <span>②</span>
          <p>
            Watch the ball move across the colorful meter. <b>Green means BUCKET!</b>
          </p>
        </div>
        <div className="how-step">
          <span>③</span>
          <p>
            Tap the <b>BIG ORANGE SHOOT BUTTON</b> or anywhere on the open court.
          </p>
        </div>
        <div className="how-step">
          <span>④</span>
          <p>
            Make as many buckets as you can in <b>30 seconds!</b> Lennox counts down the final five
            seconds.
          </p>
        </div>
        <div className="how-step">
          <span>⑤</span>
          <p>
            Ezra celebrates every make and tells you how many buckets he made at the end.
          </p>
        </div>
        <button type="button" id="help-play-btn" className="arcade-btn gold" onClick={onPlay}>
          ▶ PLAY NOW
        </button>
      </div>
    </section>
  );
};

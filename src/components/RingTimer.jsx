import React from 'react';

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * secondsLeft / totalSeconds -> ring drains clockwise as time runs out.
 * Signature element for the quiz-taking screen.
 */
export default function RingTimer({ secondsLeft, totalSeconds }) {
  const safeTotal = Math.max(totalSeconds, 1);
  const fraction = Math.max(secondsLeft, 0) / safeTotal;
  const offset = CIRCUMFERENCE * (1 - fraction);

  let stateClass = '';
  if (fraction <= 0.1) stateClass = 'danger';
  else if (fraction <= 0.3) stateClass = 'warn';

  return (
    <div className="ring-timer" role="timer" aria-label={`Time remaining ${formatClock(secondsLeft)}`}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle className="ring-timer-track" cx="38" cy="38" r={RADIUS} />
        <circle
          className={`ring-timer-fill ${stateClass}`}
          cx="38"
          cy="38"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-timer-label">{formatClock(Math.max(secondsLeft, 0))}</div>
    </div>
  );
}

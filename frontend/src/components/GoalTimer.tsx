import { useEffect, useState } from "react";

function formatTime(totalSeconds: number): string {
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (d > 0) return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

interface Props {
  startTime: string;
  isCompleted: boolean;
  goalDurationHours: number;
}

export default function GoalTimer({ startTime, isCompleted, goalDurationHours }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (isCompleted) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isCompleted]);

  const elapsedSec = Math.floor((now - new Date(startTime).getTime()) / 1000);

  const totalSec = goalDurationHours * 3600;
  const remainingSec = Math.max(totalSec - elapsedSec, 0);
  const progress = Math.min(elapsedSec / totalSec, 1);
  const nearComplete = remainingSec > 0 && remainingSec <= 300;

  return (
    <div>
      <div className="timer-row">
        <div className={`timer-card stopwatch ${isCompleted ? "completed" : ""} ${!isCompleted ? "pulse" : ""}`}>
          <span className="timer-label">Stopwatch</span>
          <span className="timer-value">{formatTime(elapsedSec)}</span>
        </div>
        <div className={`timer-card countdown ${isCompleted ? "completed" : ""} ${nearComplete ? "pulse" : ""}`}>
          <span className="timer-label">Countdown</span>
          <span className="timer-value">{formatTime(remainingSec)}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill ${isCompleted ? "completed" : ""}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {isCompleted && (
        <div className="completion-badge">
          <span>🎉</span>
          <span>Goal achieved!</span>
        </div>
      )}
    </div>
  );
}

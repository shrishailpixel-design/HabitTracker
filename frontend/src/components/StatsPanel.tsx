import { useState } from "react";
import type { GoalResponse } from "../types";

interface Props {
  goals: GoalResponse[];
}

function getStreak(goals: GoalResponse[]): number {
  if (goals.length === 0) return 0;
  const dates = [...new Set(goals.map((g) => g.createdAt.split("T")[0]))].sort().reverse();
  if (dates.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

function getTotalHours(goals: GoalResponse[]): number {
  return goals.reduce((sum, g) => sum + g.goalDurationHours, 0);
}

function getUrgeCount(): number {
  try {
    const data = localStorage.getItem("urge-log");
    return data ? JSON.parse(data).length : 0;
  } catch {
    return 0;
  }
}

function getDailyCost(): number {
  try {
    return Number(localStorage.getItem("daily-cost")) || 0;
  } catch {
    return 0;
  }
}

export default function StatsPanel({ goals }: Props) {
  const [showUrges, setShowUrges] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [, forceUpdate] = useState(0);

  const streak = getStreak(goals);
  const totalHours = getTotalHours(goals);
  const urgeCount = getUrgeCount();
  const dailyCost = getDailyCost();
  const moneySaved = dailyCost > 0 ? (streak * dailyCost).toFixed(2) : null;

  const refresh = () => forceUpdate((n) => n + 1);

  return (
    <>
      <div className="stats-panel">
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">day streak</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱</span>
            <span className="stat-value">{totalHours}h</span>
            <span className="stat-label">tracked</span>
          </div>
          <div className="stat-card clickable" onClick={() => setShowCost(true)}>
            <span className="stat-icon">💰</span>
            <span className="stat-value">
              {moneySaved ? `$${moneySaved}` : "—"}
            </span>
            <span className="stat-label">saved</span>
          </div>
          <div className="stat-card clickable" onClick={() => { setShowUrges(true); refresh(); }}>
            <span className="stat-icon">🤯</span>
            <span className="stat-value">{urgeCount}</span>
            <span className="stat-label">urges</span>
          </div>
        </div>
      </div>

      {showUrges && (
        <UrgeHistory onClose={() => setShowUrges(false)} onLog={refresh} />
      )}

      {showCost && (
        <CostModal
          current={dailyCost}
          onSave={(v) => { localStorage.setItem("daily-cost", String(v)); refresh(); setShowCost(false); }}
          onClose={() => setShowCost(false)}
        />
      )}
    </>
  );
}

function UrgeHistory({ onClose, onLog }: { onClose: () => void; onLog: () => void }) {
  const [urges, setUrges] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("urge-log") || "[]"); }
    catch { return []; }
  });

  const logUrge = () => {
    const now = new Date();
    const entry = now.toLocaleString();
    const updated = [entry, ...urges];
    setUrges(updated);
    localStorage.setItem("urge-log", JSON.stringify(updated));
    onLog();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal urge-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Urge Log</h3>
        <p>Every time you feel an urge, log it. Awareness beats addiction.</p>

        <button className="urge-log-btn" onClick={logUrge}>
          🤯 Log an urge
        </button>

        <div className="urge-list">
          {urges.length === 0 && (
            <p className="urge-empty">No urges logged yet. Stay strong!</p>
          )}
          {urges.map((entry, i) => (
            <div key={i} className="urge-entry">
              <span className="urge-icon">⚠️</span>
              <span>{entry}</span>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function CostModal({ current, onSave, onClose }: { current: number; onSave: (v: number) => void; onClose: () => void }) {
  const [val, setVal] = useState(String(current || ""));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal cost-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Daily Cost</h3>
        <p>How much does this habit cost you per day?</p>
        <div className="cost-input-wrap">
          <span className="cost-currency">$</span>
          <input
            autoFocus
            type="number"
            step="0.01"
            min="0"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave(Number(val))}
            placeholder="0.00"
          />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={() => onSave(Number(val))} disabled={!val}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

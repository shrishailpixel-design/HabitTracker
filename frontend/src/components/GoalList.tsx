import type { GoalResponse } from "../types";
import GoalTimer from "./GoalTimer";

interface Props {
  goals: GoalResponse[];
  onDelete: (id: number) => void;
}

function getHabitIcon(title: string): string {
  const icons: Record<string, string> = {
    smoking: "🚬",
    "social media": "📱",
    "junk food": "🍔",
    soda: "🥤",
    procrastination: "⏰",
    coffee: "☕",
    alcohol: "🍺",
    gaming: "🎮",
  };
  const key = title.toLowerCase().trim();
  for (const [k, v] of Object.entries(icons)) {
    if (key.includes(k)) return v;
  }
  return "🎯";
}

export default function GoalList({ goals, onDelete }: Props) {
  if (goals.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">🎯</div>
        <p>No habits yet. Pick one to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="goal-list">
      {goals.map((goal) => (
        <div key={goal.id} className={`goal-card ${goal.isCompleted ? "completed" : ""}`}>
          <div className="goal-header">
            <div className="goal-title-wrap">
              <div className="goal-badge">{getHabitIcon(goal.title)}</div>
              <h3>{goal.title}</h3>
            </div>
            <button className="delete-btn" onClick={() => onDelete(goal.id)} title="Delete goal">
              ✕
            </button>
          </div>
          <GoalTimer
            elapsed={goal.elapsed}
            remaining={goal.remaining}
            isCompleted={goal.isCompleted}
            goalDurationHours={goal.goalDurationHours}
          />
        </div>
      ))}
    </div>
  );
}

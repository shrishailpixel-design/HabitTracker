import { useState } from "react";
import type { CreateGoalRequest } from "../types";

interface Props {
  onSubmit: (req: CreateGoalRequest) => Promise<void>;
}

const habits = [
  { label: "Smoking", emoji: "🚬" },
  { label: "Social media", emoji: "📱" },
  { label: "Junk food", emoji: "🍔" },
  { label: "Soda", emoji: "🥤" },
  { label: "Procrastination", emoji: "⏰" },
  { label: "Coffee", emoji: "☕" },
  { label: "Alcohol", emoji: "🍺" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Other...", emoji: "🎯" },
];

export default function GoalForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("24");
  const [loading, setLoading] = useState(false);

  const totalHours = Number(days) * 24 + Number(hours);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalHours <= 0) return;
    setLoading(true);
    await onSubmit({ title: title.trim(), goalDurationHours: totalHours });
    setTitle("");
    setDays("");
    setHours("24");
    setLoading(false);
  };

  return (
    <form className="goal-form" onSubmit={handleSubmit}>
      <div className="input-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          list="habit-suggestions"
        />
        <datalist id="habit-suggestions">
          {habits.map((h) => (
            <option key={h.label} value={h.label} />
          ))}
        </datalist>
      </div>
      <div className="duration-input">
        <label>Goal duration</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min={0}
          placeholder="0"
        />
        <span>days</span>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          min={0}
        />
        <span>hours</span>
      </div>
      <button type="submit" disabled={loading || totalHours <= 0}>
        {loading ? "Starting..." : "Start New Goal"}
      </button>
    </form>
  );
}

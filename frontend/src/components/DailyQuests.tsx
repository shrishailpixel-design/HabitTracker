import { useEffect, useState } from "react";
import type { QuestResponse } from "../types";
import { getQuests, completeQuest } from "../api/gamification";

interface Props {
  onXpGained: () => void;
}

export default function DailyQuests({ onXpGained }: Props) {
  const [quests, setQuests] = useState<QuestResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setQuests(await getQuests());
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleComplete = async (id: number) => {
    setLoading(true);
    try {
      await completeQuest(id);
      await load();
      onXpGained();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="game-section">
      <h4 className="section-title">Daily Quests</h4>
      <div className="quest-list">
        {quests.map((q) => (
          <div key={q.id} className={`quest ${q.isCompleted ? "done" : ""}`}>
            <span className="quest-desc">{q.description}</span>
            <span className="quest-xp">+{q.xpReward} XP</span>
            {!q.isCompleted && (
              <button className="quest-btn" onClick={() => handleComplete(q.id)} disabled={loading}>
                Complete
              </button>
            )}
            {q.isCompleted && <span className="quest-check">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { BossResponse } from "../types";
import { getBoss, attackBoss } from "../api/gamification";

interface Props {
  onXpGained: () => void;
}

export default function WeeklyBoss({ onXpGained }: Props) {
  const [boss, setBoss] = useState<BossResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setBoss(await getBoss());
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleAttack = async () => {
    setLoading(true);
    setMessage("");
    try {
      const updated = await attackBoss();
      setBoss(updated);
      if (updated.isDefeated) {
        setMessage("Boss defeated! +200 XP");
        onXpGained();
      } else {
        setMessage(`Hit for ${updated.damagePerHit} damage!`);
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed");
    }
    setLoading(false);
  };

  if (!boss) return null;

  const hpPct = boss.maxHp > 0 ? (boss.hp / boss.maxHp) * 100 : 0;

  return (
    <div className="game-section">
      <h4 className="section-title">Weekly Boss</h4>
      <div className="boss-card">
        <div className="boss-header">
          <span className="boss-icon">👹</span>
          <span className="boss-name">{boss.name}</span>
        </div>
        <div className="boss-hp-bar">
          <div className="boss-hp-fill" style={{ width: `${hpPct}%` }} />
        </div>
        <span className="boss-hp-text">{boss.hp} / {boss.maxHp} HP</span>
        {!boss.isDefeated && (
          <button className="boss-btn" onClick={handleAttack} disabled={loading}>
            {loading ? "Attacking..." : `Attack (${boss.damagePerHit} dmg)`}
          </button>
        )}
        {boss.isDefeated && <span className="boss-defeated">💀 Defeated</span>}
        {message && <p className="boss-msg">{message}</p>}
      </div>
    </div>
  );
}

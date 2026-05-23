import type { ProfileResponse } from "../types";

interface Props {
  profile: ProfileResponse;
}

const badgeLabels: Record<string, string> = {
  "First Step": "Complete your first goal",
  "Dedicated": "Reach level 5",
  "Pet Parent": "Pet reaches level 3",
  "Quest Master": "Complete 5 daily quests",
  "Boss Slayer": "Defeat the weekly boss",
};

export default function GamificationPanel({ profile }: Props) {
  const progress = profile.xpForNext > 0 ? profile.xp / profile.xpForNext : 0;

  return (
    <div className="game-panel">
      <div className="xp-bar-wrap">
        <div className="xp-top">
          <span className="level">Lv.{profile.level}</span>
          <span className="xp-text">{profile.xp} / {profile.xpForNext} XP</span>
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
        </div>
      </div>

      {profile.badges.length > 0 && (
        <div className="badges">
          {profile.badges.map((b) => (
            <span key={b} className="badge" title={badgeLabels[b] ?? b}>{b}</span>
          ))}
        </div>
      )}
    </div>
  );
}

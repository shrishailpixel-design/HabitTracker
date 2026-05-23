import type { ProfileResponse } from "../types";
import { setPetType } from "../api/gamification";

interface Props {
  profile: ProfileResponse;
  onUpdate: () => void;
}

const petEmojis: Record<string, string[]> = {
  cat: ["🥚", "🐱", "😺", "😸", "😻", "🐱"],
  dog: ["🥚", "🐶", "🐕", "🦮", "🐕‍🦺", "🐶"],
  dragon: ["🥚", "🐉", "🐲", "🐉", "🐉", "🐉"],
  fox: ["🥚", "🦊", "🦊", "🦊", "🦊", "🦊"],
};

const petNames: Record<string, string> = {
  cat: "Cat", dog: "Dog", dragon: "Dragon", fox: "Fox",
};

export default function PetDisplay({ profile, onUpdate }: Props) {
  const emojis = petEmojis[profile.petType] ?? petEmojis.cat;
  const stage = Math.min(Math.floor((profile.petLevel - 1) / 2), emojis.length - 1);
  const emoji = profile.petLevel >= 1 ? emojis[stage] : emojis[0];
  const name = petNames[profile.petType] ?? "Pet";

  const cyclePet = async () => {
    const types = ["cat", "dog", "dragon", "fox"];
    const idx = types.indexOf(profile.petType);
    const next = types[(idx + 1) % types.length];
    await setPetType(next);
    onUpdate();
  };

  return (
    <div className="pet-card" onClick={cyclePet} title="Click to change pet">
      <span className="pet-emoji">{emoji}</span>
      <div className="pet-info">
        <span className="pet-name">{name}</span>
        <span className="pet-level">Lv.{profile.petLevel}</span>
      </div>
    </div>
  );
}

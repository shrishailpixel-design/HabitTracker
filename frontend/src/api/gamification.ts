import type { ProfileResponse, QuestResponse, BossResponse } from "../types";

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api/habitgoals").replace("/habitgoals", "/gamification");

export async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function setPetType(petType: string): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/pet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ petType }),
  });
  if (!res.ok) throw new Error("Failed to set pet");
  return res.json();
}

export async function completeGoal(): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/complete-goal`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to register completion");
  return res.json();
}

export async function getQuests(): Promise<QuestResponse[]> {
  const res = await fetch(`${API_BASE}/quests`);
  if (!res.ok) throw new Error("Failed to load quests");
  return res.json();
}

export async function completeQuest(id: number): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/quests/${id}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete quest");
  return res.json();
}

export async function getBoss(): Promise<BossResponse> {
  const res = await fetch(`${API_BASE}/boss`);
  if (!res.ok) throw new Error("Failed to load boss");
  return res.json();
}

export async function attackBoss(): Promise<BossResponse> {
  const res = await fetch(`${API_BASE}/boss/attack`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to attack boss");
  return res.json();
}

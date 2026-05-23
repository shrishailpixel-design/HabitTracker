import type { GoalResponse, CreateGoalRequest } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api/habitgoals";

export async function getGoals(): Promise<GoalResponse[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
}

export async function createGoal(req: CreateGoalRequest): Promise<GoalResponse> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
}

export async function deleteGoal(id: number, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (res.status === 403) throw new Error("Incorrect password");
  if (!res.ok) throw new Error("Failed to delete goal");
}

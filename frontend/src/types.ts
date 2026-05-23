export interface GoalResponse {
  id: number;
  title: string;
  goalDurationHours: number;
  startTime: string;
  elapsed: string;
  remaining: string;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateGoalRequest {
  title: string;
  goalDurationHours: number;
}

export interface ProfileResponse {
  xp: number;
  level: number;
  xpForNext: number;
  badges: string[];
  petType: string;
  petLevel: number;
  goalsCompleted: number;
}

export interface QuestResponse {
  id: number;
  description: string;
  xpReward: number;
  isCompleted: boolean;
}

export interface BossResponse {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  damagePerHit: number;
  isDefeated: boolean;
}

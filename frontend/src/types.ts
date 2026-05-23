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

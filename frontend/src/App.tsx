import { useEffect, useState } from "react";
import GoalForm from "./components/GoalForm";
import GoalList from "./components/GoalList";
import Quote from "./components/Quote";
import GamificationPanel from "./components/GamificationPanel";
import PetDisplay from "./components/PetDisplay";
import DailyQuests from "./components/DailyQuests";
import WeeklyBoss from "./components/WeeklyBoss";
import ReasonsModal from "./components/ReasonsModal";
import StatsPanel from "./components/StatsPanel";
import { getGoals, createGoal, deleteGoal } from "./api/habitGoals";
import { getProfile, completeGoal } from "./api/gamification";
import type { CreateGoalRequest, GoalResponse, ProfileResponse } from "./types";

export default function App() {
  const [goals, setGoals] = useState<GoalResponse[]>([]);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [showReasons, setShowReasons] = useState(false);

  const loadGoals = async () => {
    try {
      setGoals(await getGoals());
    } catch {
      console.error("Failed to load goals");
    }
  };

  const loadProfile = async () => {
    try {
      setProfile(await getProfile());
    } catch {
      console.error("Failed to load profile");
    }
  };

  useEffect(() => {
    loadGoals();
    loadProfile();
    const id = setInterval(loadGoals, 30000);
    return () => clearInterval(id);
  }, []);

  const handleCreate = async (req: CreateGoalRequest) => {
    await createGoal(req);
    await completeGoal();
    await loadGoals();
    await loadProfile();
  };

  const handleDelete = async (id: number, password: string) => {
    await deleteGoal(id, password);
    await loadGoals();
  };

  return (
    <>
      <div className="app">
        <header>
          <h1>Habit Tracker</h1>
          <p>Quit a habit. Track your progress.</p>
        </header>
        <Quote />

        <button className="reasons-toggle" onClick={() => setShowReasons(true)}>
          ⚠️ Why I Quit
        </button>

        {showReasons && <ReasonsModal onClose={() => setShowReasons(false)} />}

        <StatsPanel goals={goals} />

        {profile && (
          <div className="game-row">
            <PetDisplay profile={profile} onUpdate={loadProfile} />
            <GamificationPanel profile={profile} />
          </div>
        )}

        <main>
          <GoalForm onSubmit={handleCreate} />

          {profile && (
            <div className="game-sidebar">
              <DailyQuests onXpGained={loadProfile} />
              <WeeklyBoss onXpGained={loadProfile} />
            </div>
          )}

          <GoalList goals={goals} onDelete={handleDelete} />
        </main>
      </div>
    </>
  );
}

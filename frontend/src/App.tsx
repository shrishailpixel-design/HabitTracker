import { useEffect, useState } from "react";
import GoalForm from "./components/GoalForm";
import GoalList from "./components/GoalList";
import { getGoals, createGoal, deleteGoal } from "./api/habitGoals";
import type { CreateGoalRequest, GoalResponse } from "./types";

export default function App() {
  const [goals, setGoals] = useState<GoalResponse[]>([]);

  const load = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch {
      console.error("Failed to load goals");
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const handleCreate = async (req: CreateGoalRequest) => {
    await createGoal(req);
    await load();
  };

  const handleDelete = async (id: number) => {
    await deleteGoal(id);
    await load();
  };

  return (
    <>
      <div className="floating-orb a" />
      <div className="floating-orb b" />
      <div className="floating-orb c" />
      <div className="app">
        <header>
          <h1>Habit Tracker</h1>
          <p>Quit a habit. Track your progress.</p>
        </header>
        <main>
          <GoalForm onSubmit={handleCreate} />
          <GoalList goals={goals} onDelete={handleDelete} />
        </main>
      </div>
    </>
  );
}

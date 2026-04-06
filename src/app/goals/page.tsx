"use client";

import { useState, useEffect } from "react";
import { getGoals, addGoal, updateGoal, deleteGoal, type Goal } from "@/lib/store";
import { Plus, Trash2, Target, Pencil, Check } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    getGoals().then(setGoals);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !current || !target) return;
    await addGoal({
      title,
      current: parseFloat(current),
      target: parseFloat(target),
      unit,
      deadline,
    });
    setGoals(await getGoals());
    setTitle(""); setCurrent(""); setTarget(""); setUnit(""); setDeadline("");
    setShowForm(false);
  }

  async function handleUpdate(id: string) {
    if (!editValue) return;
    await updateGoal(id, { current: parseFloat(editValue) });
    setGoals(await getGoals());
    setEditingId(null);
    setEditValue("");
  }

  async function handleDelete(id: string) {
    await deleteGoal(id);
    setGoals(await getGoals());
  }

  function pct(current: number, target: number) {
    return Math.min(100, Math.round((current / target) * 100));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-[var(--text-secondary)] mt-1">Track your progress toward big milestones</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Goal Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chess Elo" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Current</label>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="1200" className="w-24" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Target</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="2200" className="w-24" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Unit</label>
            <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Elo" className="w-24" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-36" />
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="card text-center py-12">
            <Target size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
            <p className="text-[var(--text-secondary)]">No goals yet. Add your first goal to start tracking!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const p = pct(goal.current, goal.target);
            return (
              <div key={goal.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{goal.title}</h3>
                    {goal.deadline && (
                      <p className="text-xs text-[var(--text-secondary)]">Deadline: {goal.deadline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{p}%</span>
                    <button onClick={() => handleDelete(goal.id)} className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="w-full h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${p}%`,
                      background: p >= 75 ? "var(--success)" : p >= 40 ? "var(--warning)" : "var(--accent)",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  {editingId === goal.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="New value"
                        className="w-24 text-sm"
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(goal.id)} className="text-[var(--success)]">
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(goal.id); setEditValue(String(goal.current)); }}
                      className="flex items-center gap-1 text-[var(--accent)] text-xs hover:underline"
                    >
                      <Pencil size={12} /> Update Progress
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getStudyEntries, addStudyEntry, getTodos, getGoals, type StudyEntry } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, BookOpen, Target, CheckSquare, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

export default function Dashboard() {
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [todosCount, setTodosCount] = useState({ total: 0, done: 0 });
  const [goalsCount, setGoalsCount] = useState(0);

  useEffect(() => {
    setEntries(getStudyEntries());
    const todos = getTodos();
    setTodosCount({ total: todos.length, done: todos.filter((t) => t.completed).length });
    setGoalsCount(getGoals().length);
  }, []);

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
    const label = format(subDays(new Date(), 6 - i), "EEE");
    const dayEntries = entries.filter((e) => e.date === date);
    const totalHours = dayEntries.reduce((sum, e) => sum + e.hours, 0);
    return { date, label, hours: totalHours };
  });

  const totalHoursWeek = chartData.reduce((s, d) => s + d.hours, 0);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayHours = entries.filter((e) => e.date === todayStr).reduce((s, e) => s + e.hours, 0);

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!subject || !hours) return;
    const updated = addStudyEntry({
      date: todayStr,
      subject,
      hours: parseFloat(hours),
      notes,
    });
    setEntries(updated);
    setSubject("");
    setHours("");
    setNotes("");
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Welcome back, Anay. {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Log Study
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddEntry} className="card mb-6 flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Math" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Hours</label>
            <input type="number" step="0.25" min="0" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="1.5" className="w-24" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-48" />
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BookOpen size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{todayHours}h</p>
            <p className="text-xs text-[var(--text-secondary)]">Studied Today</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp size={24} className="text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalHoursWeek}h</p>
            <p className="text-xs text-[var(--text-secondary)]">This Week</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <CheckSquare size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{todosCount.done}/{todosCount.total}</p>
            <p className="text-xs text-[var(--text-secondary)]">Tasks Done</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Target size={24} className="text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{goalsCount}</p>
            <p className="text-xs text-[var(--text-secondary)]">Active Goals</p>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Study Hours (Last 7 Days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}
                labelStyle={{ color: "var(--text-primary)" }}
              />
              <Bar dataKey="hours" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Study Log</h2>
        {entries.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-sm">No study sessions logged yet. Click &quot;Log Study&quot; to start tracking!</p>
        ) : (
          <div className="space-y-2">
            {entries.slice(-10).reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{entry.subject}</span>
                  {entry.notes && <span className="text-xs text-[var(--text-secondary)]">{entry.notes}</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{entry.hours}h</span>
                  <span className="text-xs text-[var(--text-secondary)]">{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

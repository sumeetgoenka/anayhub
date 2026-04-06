"use client";

import { useState, useEffect } from "react";
import { getTodos, addTodo, toggleTodo, deleteTodo, type Todo } from "@/lib/store";
import { Plus, Trash2, Circle, CheckCircle2 } from "lucide-react";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    getTodos().then(setTodos);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await addTodo({ text: text.trim(), completed: false, priority });
    setTodos(await getTodos());
    setText("");
  }

  async function handleToggle(id: string, completed: boolean) {
    await toggleTodo(id, !completed);
    setTodos(await getTodos());
  }

  async function handleDelete(id: string) {
    await deleteTodo(id);
    setTodos(await getTodos());
  }

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const priorityColor = { low: "text-green-400", medium: "text-amber-400", high: "text-red-400" };
  const priorityBg = { low: "bg-green-400/10", medium: "bg-amber-400/10", high: "bg-red-400/10" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">To-Do List</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          {todos.filter((t) => !t.completed).length} tasks remaining
        </p>
      </div>

      <form onSubmit={handleAdd} className="card mb-6 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
          <label className="text-xs text-[var(--text-secondary)]">Task</label>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to be done?" className="w-full" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-secondary)]">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </form>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center text-[var(--text-secondary)]">
            {filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks.`}
          </div>
        ) : (
          filtered.map((todo) => (
            <div key={todo.id} className="card flex items-center gap-3 group">
              <button onClick={() => handleToggle(todo.id, todo.completed)} className="shrink-0">
                {todo.completed ? (
                  <CheckCircle2 size={22} className="text-[var(--success)]" />
                ) : (
                  <Circle size={22} className="text-[var(--text-secondary)] hover:text-[var(--accent)]" />
                )}
              </button>
              <span className={`flex-1 text-sm ${todo.completed ? "line-through text-[var(--text-secondary)]" : ""}`}>
                {todo.text}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColor[todo.priority]} ${priorityBg[todo.priority]}`}>
                {todo.priority}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--danger)] hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Simple localStorage-based store until Supabase is connected

export interface StudyEntry {
  id: string;
  date: string;
  subject: string;
  hours: number;
  notes: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  fetchedAt: string;
}

function getStore<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStore<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Study entries
export function getStudyEntries(): StudyEntry[] {
  return getStore<StudyEntry>("anayhub_study", []);
}
export function addStudyEntry(entry: Omit<StudyEntry, "id">) {
  const entries = getStudyEntries();
  entries.push({ ...entry, id: crypto.randomUUID() });
  setStore("anayhub_study", entries);
  return entries;
}

// Todos
export function getTodos(): Todo[] {
  return getStore<Todo>("anayhub_todos", []);
}
export function addTodo(todo: Omit<Todo, "id" | "createdAt">) {
  const todos = getTodos();
  todos.push({ ...todo, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  setStore("anayhub_todos", todos);
  return todos;
}
export function toggleTodo(id: string) {
  const todos = getTodos();
  const todo = todos.find((t) => t.id === id);
  if (todo) todo.completed = !todo.completed;
  setStore("anayhub_todos", todos);
  return todos;
}
export function deleteTodo(id: string) {
  const todos = getTodos().filter((t) => t.id !== id);
  setStore("anayhub_todos", todos);
  return todos;
}

// Calendar events
export function getEvents(): CalendarEvent[] {
  return getStore<CalendarEvent>("anayhub_events", []);
}
export function addEvent(event: Omit<CalendarEvent, "id">) {
  const events = getEvents();
  events.push({ ...event, id: crypto.randomUUID() });
  setStore("anayhub_events", events);
  return events;
}
export function deleteEvent(id: string) {
  const events = getEvents().filter((e) => e.id !== id);
  setStore("anayhub_events", events);
  return events;
}

// Goals
export function getGoals(): Goal[] {
  return getStore<Goal>("anayhub_goals", [
    { id: "1", title: "Chess Elo", current: 1200, target: 2200, unit: "Elo", deadline: "2027-04-01" },
    { id: "2", title: "YouTube Subscribers", current: 90, target: 100000, unit: "subs", deadline: "2027-04-01" },
  ]);
}
export function addGoal(goal: Omit<Goal, "id">) {
  const goals = getGoals();
  goals.push({ ...goal, id: crypto.randomUUID() });
  setStore("anayhub_goals", goals);
  return goals;
}
export function updateGoal(id: string, updates: Partial<Goal>) {
  const goals = getGoals();
  const goal = goals.find((g) => g.id === id);
  if (goal) Object.assign(goal, updates);
  setStore("anayhub_goals", goals);
  return goals;
}
export function deleteGoal(id: string) {
  const goals = getGoals().filter((g) => g.id !== id);
  setStore("anayhub_goals", goals);
  return goals;
}

// News
export function getNews(): NewsItem[] {
  return getStore<NewsItem>("anayhub_news", []);
}
export function setNews(items: NewsItem[]) {
  setStore("anayhub_news", items);
}

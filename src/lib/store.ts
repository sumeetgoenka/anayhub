import { supabase } from "./supabase";

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
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
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
  fetched_at: string;
}

// Study entries
export async function getStudyEntries(): Promise<StudyEntry[]> {
  const { data } = await supabase.from("study_entries").select("*").order("date", { ascending: false });
  return data ?? [];
}
export async function addStudyEntry(entry: Omit<StudyEntry, "id">) {
  const { data } = await supabase.from("study_entries").insert(entry).select().single();
  return data;
}

// Todos
export async function getTodos(): Promise<Todo[]> {
  const { data } = await supabase.from("todos").select("*").order("created_at", { ascending: true });
  return data ?? [];
}
export async function addTodo(todo: Omit<Todo, "id" | "created_at">) {
  const { data } = await supabase.from("todos").insert(todo).select().single();
  return data;
}
export async function toggleTodo(id: string, completed: boolean) {
  const { data } = await supabase.from("todos").update({ completed }).eq("id", id).select().single();
  return data;
}
export async function deleteTodo(id: string) {
  await supabase.from("todos").delete().eq("id", id);
}

// Calendar events
export async function getEvents(): Promise<CalendarEvent[]> {
  const { data } = await supabase.from("calendar_events").select("*").order("date", { ascending: true });
  return data ?? [];
}
export async function addEvent(event: Omit<CalendarEvent, "id">) {
  const { data } = await supabase.from("calendar_events").insert(event).select().single();
  return data;
}
export async function deleteEvent(id: string) {
  await supabase.from("calendar_events").delete().eq("id", id);
}

// Goals
export async function getGoals(): Promise<Goal[]> {
  const { data } = await supabase.from("goals").select("*").order("created_at", { ascending: true });
  return data ?? [];
}
export async function addGoal(goal: Omit<Goal, "id">) {
  const { data } = await supabase.from("goals").insert(goal).select().single();
  return data;
}
export async function updateGoal(id: string, updates: Partial<Goal>) {
  const { data } = await supabase.from("goals").update(updates).eq("id", id).select().single();
  return data;
}
export async function deleteGoal(id: string) {
  await supabase.from("goals").delete().eq("id", id);
}

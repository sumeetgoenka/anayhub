"use client";

import { useState, useEffect, useRef } from "react";
import { format, startOfWeek, addDays, getDay } from "date-fns";
import { Calendar, Plus, X, Check } from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  type: "study" | "exercise" | "meal" | "music" | "break" | "other";
  detail?: string;
}

const weeklySchedule: Record<string, ScheduleItem[]> = {
  Monday: [
    { time: "6:00 - 7:00", activity: "Wake up & get ready", type: "other", detail: "Morning routine" },
    { time: "7:00 - 14:00", activity: "School", type: "other", detail: "GEMS school" },
    { time: "16:00 - 16:30", activity: "Eat + Exercise", type: "meal", detail: "20 min workout" },
    { time: "16:30 - 17:20", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "17:20 - 17:30", activity: "Break", type: "break", detail: "Rest" },
    { time: "17:30 - 18:20", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "18:30 - 19:00", activity: "Keyboard", type: "music", detail: "Practice" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 21:00", activity: "English", type: "study", detail: "Reading & writing" },
  ],
  Tuesday: [
    { time: "6:00 - 7:00", activity: "Wake up & get ready", type: "other", detail: "Morning routine" },
    { time: "7:00 - 14:00", activity: "School", type: "other", detail: "GEMS school" },
    { time: "16:00 - 16:30", activity: "Eat + Exercise", type: "meal", detail: "20 min workout" },
    { time: "16:30 - 17:20", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "17:20 - 17:30", activity: "Break", type: "break", detail: "Rest" },
    { time: "17:30 - 18:20", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "18:30 - 19:00", activity: "Computer Science", type: "study", detail: "Coding practice" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 21:00", activity: "Biology", type: "study", detail: "Review notes" },
  ],
  Wednesday: [
    { time: "6:00 - 7:00", activity: "Wake up & get ready", type: "other", detail: "Morning routine" },
    { time: "7:00 - 14:00", activity: "School", type: "other", detail: "GEMS school" },
    { time: "16:00 - 16:30", activity: "Eat + Exercise", type: "meal", detail: "20 min workout" },
    { time: "16:30 - 17:20", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "17:20 - 17:30", activity: "Break", type: "break", detail: "Rest" },
    { time: "17:30 - 18:20", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "18:30 - 19:00", activity: "Guitar", type: "music", detail: "Practice" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 21:00", activity: "History", type: "study", detail: "Review notes" },
  ],
  Thursday: [
    { time: "6:00 - 7:00", activity: "Wake up & get ready", type: "other", detail: "Morning routine" },
    { time: "7:00 - 14:00", activity: "School", type: "other", detail: "GEMS school" },
    { time: "16:00 - 16:30", activity: "Eat + Exercise", type: "meal", detail: "20 min workout" },
    { time: "16:30 - 17:20", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "17:20 - 17:30", activity: "Break", type: "break", detail: "Rest" },
    { time: "17:30 - 18:20", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "18:30 - 19:00", activity: "Computer Science", type: "study", detail: "Coding practice" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 21:00", activity: "English", type: "study", detail: "Reading & writing" },
  ],
  Friday: [
    { time: "8:00 - 12:00", activity: "Morning free time", type: "break", detail: "Rest & recharge" },
    { time: "12:30 - 13:20", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "13:20 - 13:40", activity: "Lunch", type: "meal", detail: "Break" },
    { time: "13:40 - 14:30", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "14:30 - 14:45", activity: "Break", type: "break", detail: "Rest" },
    { time: "14:45 - 15:35", activity: "English", type: "study", detail: "Reading & writing" },
    { time: "15:35 - 15:50", activity: "Break", type: "break", detail: "Rest" },
    { time: "15:50 - 16:40", activity: "Chemistry", type: "study", detail: "Science" },
    { time: "16:40 - 17:00", activity: "Break", type: "break", detail: "Rest" },
    { time: "17:00 - 18:00", activity: "Computer Science", type: "study", detail: "Coding" },
    { time: "18:00 - 18:30", activity: "Keyboard", type: "music", detail: "Practice" },
    { time: "18:30 - 19:00", activity: "German", type: "study", detail: "Language practice" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 21:00", activity: "Geography", type: "study", detail: "Review notes" },
  ],
  Saturday: [
    { time: "7:00 - 7:20", activity: "Morning routine", type: "other", detail: "Brush & freshen up" },
    { time: "7:20 - 7:50", activity: "Exercise", type: "exercise", detail: "Workout" },
    { time: "7:50 - 8:10", activity: "Shower", type: "other", detail: "Get ready" },
    { time: "8:10 - 9:00", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "9:00 - 10:00", activity: "Breakfast", type: "meal", detail: "Morning meal" },
    { time: "10:00 - 10:50", activity: "Maths", type: "study", detail: "Session 2" },
    { time: "10:50 - 11:00", activity: "Break", type: "break", detail: "Rest" },
    { time: "11:00 - 11:50", activity: "Maths", type: "study", detail: "Session 3" },
    { time: "11:50 - 12:00", activity: "Break", type: "break", detail: "Rest" },
    { time: "12:00 - 12:45", activity: "Keyboard", type: "music", detail: "Practice" },
    { time: "12:45 - 13:00", activity: "English Vocab", type: "study", detail: "Word lists" },
    { time: "13:00 - 14:00", activity: "Break", type: "break", detail: "Lunch break" },
    { time: "14:00 - 14:50", activity: "German", type: "study", detail: "Language practice" },
    { time: "14:50 - 15:00", activity: "Break", type: "break", detail: "Rest" },
    { time: "15:00 - 15:50", activity: "English", type: "study", detail: "Reading & writing" },
    { time: "15:50 - 16:00", activity: "Break", type: "break", detail: "Rest" },
    { time: "16:00 - 16:50", activity: "Physics", type: "study", detail: "Review notes" },
    { time: "16:50 - 17:30", activity: "Computer Science", type: "study", detail: "Coding" },
    { time: "17:30 - 18:30", activity: "Plan YouTube video", type: "other", detail: "Content creation" },
    { time: "18:30 - 19:00", activity: "Teach sister", type: "other", detail: "Tutoring" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 20:30", activity: "Guitar", type: "music", detail: "Practice" },
    { time: "20:30 - 21:00", activity: "Read", type: "other", detail: "Book reading" },
  ],
  Sunday: [
    { time: "7:00 - 7:20", activity: "Morning routine", type: "other", detail: "Brush & freshen up" },
    { time: "7:20 - 7:50", activity: "Exercise", type: "exercise", detail: "Workout" },
    { time: "7:50 - 8:10", activity: "Shower", type: "other", detail: "Get ready" },
    { time: "8:10 - 9:00", activity: "Maths", type: "study", detail: "Session 1" },
    { time: "9:00 - 10:00", activity: "Breakfast", type: "meal", detail: "Morning meal" },
    { time: "10:00 - 10:50", activity: "English", type: "study", detail: "Reading & writing" },
    { time: "11:00 - 11:50", activity: "Science", type: "study", detail: "Review notes" },
    { time: "12:00 - 12:50", activity: "History", type: "study", detail: "Review notes" },
    { time: "13:00 - 14:00", activity: "Lunch + Break", type: "meal", detail: "Midday break" },
    { time: "14:00 - 14:50", activity: "German", type: "study", detail: "Language practice" },
    { time: "15:00 - 15:50", activity: "Geography", type: "study", detail: "Review notes" },
    { time: "15:50 - 16:50", activity: "Computer Science", type: "study", detail: "Coding" },
    { time: "16:50 - 19:00", activity: "YouTube videos", type: "other", detail: "Content creation" },
    { time: "19:00 - 20:00", activity: "Dinner", type: "meal", detail: "Family dinner" },
    { time: "20:00 - 20:30", activity: "Keyboard", type: "music", detail: "Practice" },
    { time: "20:30 - 21:00", activity: "Read", type: "other", detail: "Book reading" },
  ],
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TYPE_COLOR: Record<string, string> = {
  study:    "#3b82f6",
  exercise: "#22c55e",
  meal:     "#f97316",
  music:    "#a855f7",
  break:    "#52525b",
  other:    "#71717a",
};

function parseTimeRange(time: string): { startMins: number; endMins: number } | null {
  const parts = time.split("-").map(s => s.trim());
  if (parts.length !== 2) return null;
  const [h1, m1] = parts[0].split(":").map(Number);
  const [h2, m2] = parts[1].split(":").map(Number);
  return { startMins: h1 * 60 + (m1 || 0), endMins: h2 * 60 + (m2 || 0) };
}

export default function SchedulePage() {
  const [now, setNow] = useState(new Date());
  const todayIdx = (() => { const d = getDay(new Date()); return d === 0 ? 6 : d - 1; })();
  const [selectedIdx, setSelectedIdx] = useState(todayIdx);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const activeRef = useRef<HTMLDivElement>(null);
  const didScroll = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("schedule-notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  // Scroll to active block once
  useEffect(() => {
    if (didScroll.current || !activeRef.current) return;
    activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    didScroll.current = true;
  }, [selectedIdx]);

  useEffect(() => { didScroll.current = false; }, [selectedIdx]);

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const isToday = selectedIdx === todayIdx;

  // Build week dates starting from Monday of current week
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const dayName = DAYS[selectedIdx];
  const items = weeklySchedule[dayName] ?? [];

  function noteKey(idx: number) {
    return `${dayName}-${idx}`;
  }

  function saveNote(key: string) {
    const updated = { ...notes, [key]: noteInput };
    setNotes(updated);
    localStorage.setItem("schedule-notes", JSON.stringify(updated));
    setEditingNote(null);
    setNoteInput("");
  }

  function deleteNote(key: string) {
    const updated = { ...notes };
    delete updated[key];
    setNotes(updated);
    localStorage.setItem("schedule-notes", JSON.stringify(updated));
  }

  function isActive(item: ScheduleItem) {
    if (!isToday) return false;
    const range = parseTimeRange(item.time);
    if (!range) return false;
    return nowMins >= range.startMins && nowMins < range.endMins;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Month label */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          {format(now, "MMMM")}
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          {format(now, "yyyy")}
        </p>
      </div>

      {/* Week date strip */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {/* Calendar icon button */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[72px]"
          style={{ background: "#e07b39" }}
        >
          <Calendar size={22} color="white" />
          <span className="text-white text-xs font-bold mt-1 tracking-widest">DATE</span>
        </div>

        {weekDates.map((date, i) => {
          const isSelected = i === selectedIdx;
          const isTodayDate = i === todayIdx;
          return (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className="flex-1 min-w-[72px] flex flex-col items-center justify-center rounded-xl py-3 px-2 transition-all"
              style={{
                background: isSelected
                  ? "#3b82f6"
                  : isTodayDate
                  ? "rgba(59,130,246,0.12)"
                  : "var(--bg-card)",
                border: isSelected
                  ? "2px solid #3b82f6"
                  : isTodayDate
                  ? "2px solid rgba(59,130,246,0.35)"
                  : "2px solid var(--border)",
              }}
            >
              <span
                className="text-2xl font-bold leading-none"
                style={{ color: isSelected ? "white" : isTodayDate ? "#93c5fd" : "var(--text-secondary)" }}
              >
                {format(date, "dd")}
              </span>
              <span
                className="text-xs mt-1 font-medium"
                style={{ color: isSelected ? "rgba(255,255,255,0.85)" : "var(--text-secondary)" }}
              >
                {DAY_ABBR[i]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Schedule list */}
      <div className="card !p-0 overflow-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-secondary)]">No schedule for this day.</div>
        ) : (
          items.map((item, idx) => {
            const active = isActive(item);
            const key = noteKey(idx);
            const hasNote = !!notes[key];
            const isEditing = editingNote === key;
            const color = TYPE_COLOR[item.type];

            return (
              <div
                key={idx}
                ref={active ? activeRef : undefined}
                style={{
                  borderLeft: active ? `4px solid ${color}` : "4px solid transparent",
                  background: active ? `${color}14` : "transparent",
                  transition: "background 0.3s, border-color 0.3s",
                }}
              >
                <div className="flex items-start gap-4 px-6 py-5">
                  {/* Time */}
                  <div className="flex-shrink-0 w-32">
                    <span
                      className="text-sm font-mono"
                      style={{ color: active ? color : "var(--text-secondary)" }}
                    >
                      {item.time}
                    </span>
                    {active && (
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: color }}
                        />
                        <span className="text-xs" style={{ color }}>Now</span>
                      </div>
                    )}
                  </div>

                  {/* Activity info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-semibold text-base"
                        style={{ color: active ? "var(--foreground)" : "var(--foreground)" }}
                      >
                        {item.activity}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ background: `${color}22`, color }}
                      >
                        {item.type}
                      </span>
                    </div>
                    {item.detail && (
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">{item.detail}</p>
                    )}

                    {/* Note display / edit */}
                    {isEditing ? (
                      <div className="mt-2 flex gap-2 items-center">
                        <input
                          autoFocus
                          value={noteInput}
                          onChange={e => setNoteInput(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") saveNote(key); if (e.key === "Escape") setEditingNote(null); }}
                          placeholder="Type your note..."
                          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                        />
                        <button
                          onClick={() => saveNote(key)}
                          className="p-1.5 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="p-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors border border-[var(--border)]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : hasNote ? (
                      <div className="mt-2 flex items-start gap-2 group">
                        <p
                          className="text-xs flex-1 px-2.5 py-1.5 rounded-lg"
                          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", borderLeft: `2px solid ${color}` }}
                        >
                          {notes[key]}
                        </p>
                        <button
                          onClick={() => { setNoteInput(notes[key]); setEditingNote(key); }}
                          className="text-xs text-[var(--text-secondary)] hover:text-[var(--foreground)] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(key)}
                          className="text-xs text-[var(--danger)] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* ADD NOTE button */}
                  <button
                    onClick={() => { setNoteInput(notes[key] ?? ""); setEditingNote(key); }}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all"
                    style={{
                      background: active ? color : "var(--bg-secondary)",
                      color: active ? "white" : "var(--text-secondary)",
                      border: `1px solid ${active ? color : "var(--border)"}`,
                    }}
                  >
                    <Plus size={12} />
                    ADD NOTE
                  </button>
                </div>

                {/* Divider */}
                {idx < items.length - 1 && (
                  <div className="border-b border-[var(--border)] mx-6" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

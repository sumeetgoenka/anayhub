"use client";

import { useState, useEffect } from "react";
import { getEvents, addEvent, deleteEvent, type CalendarEvent } from "@/lib/store";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am to 9pm
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    setEvents(addEvent({ title, date, startTime, endTime, color }));
    setTitle("");
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setEvents(deleteEvent(id));
  }

  function getEventStyle(event: CalendarEvent) {
    const [sh, sm] = event.startTime.split(":").map(Number);
    const [eh, em] = event.endTime.split(":").map(Number);
    const top = ((sh - 6) + sm / 60) * 60; // 60px per hour
    const height = ((eh - sh) + (em - sm) / 60) * 60;
    return { top: `${top}px`, height: `${Math.max(height, 20)}px` };
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--border)]">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))} className="px-3 py-2 rounded-lg bg-[var(--bg-card)] text-sm hover:bg-[var(--border)]">
            Today
          </button>
          <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--border)]">
            <ChevronRight size={20} />
          </button>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card mb-6 flex gap-3 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event name" className="w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Start</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">End</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)]">Color</label>
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full border-2 transition-transform"
                  style={{ background: c, borderColor: color === c ? "white" : "transparent", transform: color === c ? "scale(1.2)" : "" }}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      {/* Weekly Calendar Grid */}
      <div className="card overflow-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[800px]">
          {/* Header row */}
          <div className="border-b border-[var(--border)] p-2" />
          {days.map((day) => (
            <div key={day.toISOString()} className={`border-b border-l border-[var(--border)] p-2 text-center ${isSameDay(day, new Date()) ? "bg-[var(--accent)]/10" : ""}`}>
              <div className="text-xs text-[var(--text-secondary)]">{format(day, "EEE")}</div>
              <div className={`text-lg font-semibold ${isSameDay(day, new Date()) ? "text-[var(--accent)]" : ""}`}>
                {format(day, "d")}
              </div>
            </div>
          ))}

          {/* Time rows */}
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="border-b border-[var(--border)] p-1 text-xs text-[var(--text-secondary)] text-right pr-2 h-[60px] flex items-start justify-end">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {days.map((day) => {
                const dayEvents = events.filter((ev) => {
                  try { return isSameDay(parseISO(ev.date), day); } catch { return false; }
                });
                return (
                  <div key={day.toISOString() + hour} className="border-b border-l border-[var(--border)] h-[60px] relative">
                    {hour === HOURS[0] &&
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="absolute left-1 right-1 rounded-md px-1 py-0.5 text-xs text-white overflow-hidden cursor-pointer group/ev z-10"
                          style={{ ...getEventStyle(ev), background: ev.color }}
                          title={`${ev.title} (${ev.startTime}-${ev.endTime})`}
                        >
                          <div className="font-medium truncate">{ev.title}</div>
                          <div className="text-[10px] opacity-80">{ev.startTime}-{ev.endTime}</div>
                          <button
                            onClick={() => handleDelete(ev.id)}
                            className="absolute top-0.5 right-0.5 opacity-0 group-hover/ev:opacity-100 p-0.5"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

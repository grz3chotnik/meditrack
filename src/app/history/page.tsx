"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMonthString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthString = getMonthString(currentDate);

  const monthHistory = useQuery(api.takenHistory.listByMonth, {
    month: monthString,
  });
  const medicines = useQuery(api.medicines.list);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Group history entries by date
  const entriesByDate: Record<string, typeof monthHistory> = {};
  monthHistory?.forEach((entry) => {
    if (!entriesByDate[entry.date]) entriesByDate[entry.date] = [];
    entriesByDate[entry.date]!.push(entry);
  });

  // Map medicine IDs to names
  const medicineNames: Record<string, string> = {};
  medicines?.forEach((med) => {
    medicineNames[med._id] = med.name;
  });

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  }

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Month header with arrows */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="text-foreground/50 hover:text-foreground transition-colors cursor-pointer text-lg px-2"
        >
          &larr;
        </button>
        <h1 className="text-2xl font-semibold">{monthLabel}</h1>
        <button
          onClick={nextMonth}
          className="text-foreground/50 hover:text-foreground transition-colors cursor-pointer text-lg px-2"
        >
          &rarr;
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-foreground/50 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateString = `${monthString}-${day.toString().padStart(2, "0")}`;
          const entries = entriesByDate[dateString] ?? [];
          const isSelected = selectedDay === dateString;
          const isToday =
            dateString === new Date().toISOString().slice(0, 10);

          return (
            <button
              key={day}
              onClick={() =>
                setSelectedDay(isSelected ? null : dateString)
              }
              className={`h-14 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors
                ${isSelected ? "bg-white/15" : "hover:bg-white/10"}
                ${isToday ? "border border-white/30" : ""}
              `}
            >
              <span className="text-sm">{day}</span>
              {entries.length > 0 && (
                <div className="flex gap-0.5">
                  {entries.slice(0, 4).map((_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full bg-green-400"
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-6 p-4 rounded-lg border border-white/20">
          <h2 className="text-sm font-medium text-foreground/50 mb-3">
            {new Date(selectedDay + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          {(entriesByDate[selectedDay] ?? []).length === 0 ? (
            <p className="text-sm text-foreground/50">
              No medicines taken this day.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {entriesByDate[selectedDay]!.map((entry) => (
                <div key={entry._id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-sm">
                    {medicineNames[entry.medicineId] ?? "Unknown medicine"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

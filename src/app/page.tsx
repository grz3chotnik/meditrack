"use client";

import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useReminders } from "./hooks/useReminders";

export default function Home() {
  const { isSignedIn, user } = useUser();
  const medicines = useQuery(api.medicines.list);
  const takenToday = useQuery(api.takenHistory.listToday);
  const markTaken = useMutation(api.takenHistory.markTaken);
  const unmarkTaken = useMutation(api.takenHistory.unmarkTaken);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const timeToday = new Date();

  const takenIds = takenToday?.map((entry) => entry.medicineId) ?? [];

  useReminders(medicines, takenIds, user?.primaryEmailAddress?.emailAddress);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <p className="text-sm text-foreground/50 mb-1">{today}</p>
      <h1 className="text-2xl font-semibold mb-6">Today's Medicines</h1>

      {!isSignedIn && (
        <p className="text-sm text-foreground/50">
          Sign in to see your medicines.
        </p>
      )}

      {isSignedIn && (medicines === undefined || takenToday === undefined) && (
        <p className="text-sm text-foreground/50">Loading...</p>
      )}

      {isSignedIn && medicines !== undefined && takenToday !== undefined && medicines.length === 0 && (
        <p className="text-sm text-foreground/50">
          No medicines due today. Add some from the dashboard.
        </p>
      )}

      {takenToday !== undefined && medicines?.map((med) => {
        const taken = takenIds.includes(med._id);
        const overdue =
          !taken &&
          med.reminderTime &&
          timeToday.getHours() + ":" + timeToday.getMinutes() >
            med.reminderTime;
        return (
          <div
            key={med._id}
            className={`flex items-center gap-3 p-4 mb-3 rounded-lg border ${overdue ? "border-red-500" : "border-white/20"} ${taken ? "opacity-50" : ""}`}
          >
            <button
              onClick={() =>
                taken
                  ? unmarkTaken({ medicineId: med._id })
                  : markTaken({ medicineId: med._id })
              }
              className="flex-shrink-0 cursor-pointer"
            >
              {taken ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-green-400 transition-colors" />
              )}
            </button>
            <div>
              <p className={`font-medium ${taken ? "line-through" : ""}`}>
                {med.name}
              </p>
              <p className="text-sm text-foreground/50">
                {med.dosage}
                {med.reminderTime && <> &middot; {med.reminderTime}</>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

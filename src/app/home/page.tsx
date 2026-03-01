"use client";

import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Progress } from "@base-ui/react/progress";
import { api } from "../../../convex/_generated/api";
import { useReminders } from "@/app/hooks/useReminders";

export default function Home() {
  const { user, isLoaded } = useUser();
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
  const hour = timeToday.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const takenIds = takenToday?.map((entry) => entry.medicineId) ?? [];

  useReminders(medicines, takenIds);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
      <p className="text-sm text-foreground/50 mb-1 mt-2 sm:mt-0">{today}</p>
      <h1 className="text-2xl font-semibold mb-4">
        {isLoaded ? `${greeting}, ${user?.firstName}` : greeting}
      </h1>

      {medicines && medicines.length > 0 && (
        <Progress.Root
          value={takenIds.length}
          max={medicines.length}
          className="mb-6"
        >
          <div className="flex items-center justify-between text-sm mb-2">
            <Progress.Label className="text-foreground/50">
              {takenIds.length}/{medicines.length} taken
            </Progress.Label>
          </div>
          <Progress.Track className="w-full h-2 rounded-full bg-white/10">
            <Progress.Indicator className="h-full rounded-full bg-green-500 transition-all duration-300" />
          </Progress.Track>
        </Progress.Root>
      )}

      {(medicines === undefined || takenToday === undefined) && (
        <p className="text-sm text-foreground/50">Loading...</p>
      )}

      {medicines !== undefined &&
        takenToday !== undefined &&
        medicines.length === 0 && (
          <p className="text-sm text-foreground/50">
            No medicines due today. Add some from the dashboard.
          </p>
        )}

      {takenToday !== undefined &&
        medicines?.map((med) => {
          const taken = takenIds.includes(med._id);
          const overdue =
            !taken &&
            med.reminderTime &&
            timeToday.getHours() + ":" + timeToday.getMinutes() >
              med.reminderTime;
          return (
            <div
              key={med._id}
              onClick={(e) => {
                if (taken) {
                  unmarkTaken({ medicineId: med._id });
                  toast(`Unmarked ${med.name}`);
                } else {
                  markTaken({ medicineId: med._id });
                  toast.success(`${med.name} marked as taken!`);
                  import("@hiseb/confetti").then(({ default: confetti }) =>
                    confetti({
                      position: { x: e.clientX, y: e.clientY },
                      count: 200,
                      size: 2,
                      velocity: 250,
                      fade: true,
                    }),
                  );
                }
              }}
              className={`flex items-center gap-3 p-4 mb-3 rounded-lg border cursor-pointer transition-colors ${overdue ? "border-red-500 hover:bg-red-500/10" : "border-white/20 hover:bg-white/5"} ${taken ? "opacity-50" : ""}`}
            >
              <div className="flex-shrink-0">
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
              </div>
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

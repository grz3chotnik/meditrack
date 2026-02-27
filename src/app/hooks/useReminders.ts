"use client";

import { useEffect, useRef } from "react";

type Medicine = {
  _id: string;
  name: string;
  dosage: string;
  reminderTime?: string;
};

export function useReminders(
  medicines: Medicine[] | undefined,
  takenIds: string[],
  userEmail: string | undefined,
) {
  //ask for permission on first load
  useEffect(() => {
    if (typeof Notification !== "undefined" &&  Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // checks every 10 seconds if any medicine is due
  const lastNotifiedMinute = useRef("");
  useEffect(() => {
    const interval = setInterval(() => {
      if (!medicines) return;

      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      if (currentTime === lastNotifiedMinute.current) return;
      lastNotifiedMinute.current = currentTime;

      for (const med of medicines) {
        const isDue =
          med.reminderTime === currentTime && !takenIds.includes(med._id);
        if (isDue) {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Time to take your medicine", {
              body: `${med.name} — ${med.dosage}`,
            });
          }

          if (userEmail) {
            fetch("/api/send-reminder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                medicineName: med.name,
                dosage: med.dosage,
                email: userEmail,
              }),
            });
          }
        }
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [medicines, takenIds, userEmail]);
}

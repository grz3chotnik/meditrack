import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const getDueMedicines = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const localTime = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Montevideo" }),
    );

    const currentHourMinute =
      localTime.getHours().toString().padStart(2, "0") +
      ":" +
      localTime.getMinutes().toString().padStart(2, "0");

    const todayDate = localTime.toISOString().slice(0, 10);

    const allMedicines = await ctx.db.query("medicines").collect();
    const dueMedicines = allMedicines.filter(
      (medicine) => medicine.reminderTime === currentHourMinute,
    );

    const results = [];

    for (const medicine of dueMedicines) {
      const alreadyTakenToday = await ctx.db
        .query("takenHistory")
        .withIndex("by_medicine_date", (filter) =>
          filter
            .eq("medicineId", medicine._id)
            .eq("date", todayDate),
        )
        .first();

      if (alreadyTakenToday) continue;

      const user = await ctx.db.get(medicine.userId);
      if (!user || !user.email) continue;

      results.push({
        medicineName: medicine.name,
        dosage: medicine.dosage,
        email: user.email,
      });
    }

    return results;
  },
});

export const send = internalAction({
  args: {},
  handler: async (ctx) => {
    const dueMedicines = await ctx.runQuery(internal.reminders.getDueMedicines);

    if (dueMedicines.length === 0) return;

    const resend = new Resend(process.env.RESEND_API_KEY);

    for (const medicine of dueMedicines) {
      await resend.emails.send({
        from: "MediTrack <reminders@2004.lol>",
        to: medicine.email,
        subject: `Reminder: Time to take ${medicine.medicineName}`,
        html: `<p>It's time to take <strong>${medicine.medicineName}</strong> (${medicine.dosage}).</p>`,
      });
    }
  },
});

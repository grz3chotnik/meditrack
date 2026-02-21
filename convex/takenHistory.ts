import { mutation, query, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import { getUser } from "./helpers";

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function findTodaysDose(ctx: QueryCtx, medicineId: Id<"medicines">) {
  return await ctx.db
    .query("takenHistory")
    .withIndex("by_medicine_date", (q) =>
      q.eq("medicineId", medicineId).eq("date", today()),
    )
    .first();
}

export const markTaken = mutation({
  args: { medicineId: v.id("medicines") },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error("Not logged in");

    const alreadyTaken = await findTodaysDose(ctx, args.medicineId);
    if (alreadyTaken) return alreadyTaken._id;

    return await ctx.db.insert("takenHistory", {
      medicineId: args.medicineId,
      userId: user._id,
      date: today(),
      status: "taken",
      takenAt: Date.now(),
    });
  },
});

export const unmarkTaken = mutation({
  args: { medicineId: v.id("medicines") },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error("Not logged in");

    const dose = await findTodaysDose(ctx, args.medicineId);
    if (dose && dose.userId === user._id) {
      await ctx.db.delete(dose._id);
    }
  },
});

export const listByMonth = query({
  args: { month: v.string() },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const startDate = `${args.month}-01`;
    const endDate = `${args.month}-31`;

    return (
      await ctx.db
        .query("takenHistory")
        .withIndex("by_user_date", (q) =>
          q.eq("userId", user._id).gte("date", startDate).lte("date", endDate),
        )
        .collect()
    );
  },
});

export const listToday = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("takenHistory")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", today()),
      )
      .collect();
  },
});

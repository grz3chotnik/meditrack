import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUser } from "./helpers";

export const add = mutation({
  args: {
    name: v.string(),
    dosage: v.string(),
    reminderTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error("Not logged in");
    await ctx.db.insert("medicines", { userId: user._id, ...args });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];
    return await ctx.db
      .query("medicines")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const remove = mutation({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error("Not logged in");
    const medicine = await ctx.db.get(args.id);
    if (!medicine || medicine.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

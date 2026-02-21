import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not logged in");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (existing) return existing._id;

    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
    });

    return userId;
  },
});

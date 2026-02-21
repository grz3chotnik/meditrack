import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  medicines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    dosage: v.string(),
    reminderTime: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  takenHistory: defineTable({
    medicineId: v.id("medicines"),
    userId: v.id("users"),
    date: v.string(),
    status: v.union(
      v.literal("taken"),
      v.literal("skipped"),
      v.literal("missed"),
    ),
    takenAt: v.optional(v.number()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_medicine_date", ["medicineId", "date"]),
});

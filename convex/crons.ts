import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("send reminders", { minutes: 1 }, internal.reminders.send);

export default crons;

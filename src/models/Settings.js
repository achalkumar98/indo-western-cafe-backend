const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true },
    address: {
      type: String,
      trim: true,
    },
    closesAt: { type: String, trim: true },
    isOpenNow: { type: Boolean, default: true },
    priceRange: { type: String, trim: true },
    instagramUrl: {
      type: String,
      trim: true,
    },
    instagramHandle: { type: String, trim: true },
    directionsUrl: {
      type: String,
      trim: true,
    },
    highlights: {
      type: [String],
    },
    rating: { type: Number },
    reviewCount: { type: Number },
    reviewSummary: {
      type: String,
      trim: true,
    },
    reportedByCount: { type: Number },
    popularTimes: {
      type: Map,
      of: [Number],
    },
    // ── Weekly schedule (opens/closes per day + week-off toggle) ─────────────
    weekSchedule: {
      type: [
        {
          day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
          opensAt: { type: String, trim: true, default: "11:00 AM" },
          closesAt: { type: String, trim: true, default: "10:00 PM" },
          weekOff: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

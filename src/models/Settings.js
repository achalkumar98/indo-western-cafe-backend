const mongoose = require("mongoose");

// Singleton document — the app always reads/writes the first document.
const settingsSchema = new mongoose.Schema(
  {
    // ── Contact & identity ────────────────────────────────────────────────────
    phone: { type: String, trim: true, default: "092637 50882" },
    address: {
      type: String,
      trim: true,
      default: "Madan Jee Ka Hata, Pakari Chowk, Near Ara Medical, Pakari, Arrah, Bihar 802301",
    },
    closesAt: { type: String, trim: true, default: "10:00 PM" },
    isOpenNow: { type: Boolean, default: true },
    priceRange: { type: String, trim: true, default: "₹200–400" },
    instagramUrl: {
      type: String,
      trim: true,
      default: "https://www.instagram.com/indo__western_ara/?hl=en",
    },
    instagramHandle: { type: String, trim: true, default: "@indo__western_ara" },
    directionsUrl: {
      type: String,
      trim: true,
      default:
        "https://maps.google.com/maps?q=Indo+Western+Cafe+%26+Restaurant+Pakari+Arrah+Bihar",
    },
    highlights: {
      type: [String],
      default: ["All you can eat", "Happy-hour food", "Fireplace"],
    },
    rating: { type: Number, default: 4.4 },
    reviewCount: { type: Number, default: 487 },

    // ── Public-facing text ────────────────────────────────────────────────────
    reviewSummary: {
      type: String,
      trim: true,
      default:
        "Guests consistently call out the rich, smooth, perfectly chilled cold coffee with ice cream, along with attentive service and a comfortable vibe that makes this a favourite spot to sit and unwind.",
    },
    reportedByCount: { type: Number, default: 91 },

    // ── Popular times (7 days × 12 hourly slots, 11 AM–10 PM) ─────────────────
    // Stored as a flat object: { Mon: [10,15,...], Tue: [...], ... }
    popularTimes: {
      type: Map,
      of: [Number],
      default: () =>
        new Map([
          ["Mon", [10, 15, 20, 35, 55, 70, 60, 45, 30, 20, 10, 5]],
          ["Tue", [10, 18, 22, 38, 58, 72, 62, 48, 32, 22, 12, 6]],
          ["Wed", [12, 20, 25, 40, 60, 75, 65, 50, 34, 24, 14, 6]],
          ["Thu", [12, 20, 26, 42, 62, 78, 68, 52, 36, 26, 15, 7]],
          ["Fri", [15, 25, 30, 48, 70, 88, 82, 65, 45, 32, 20, 10]],
          ["Sat", [20, 32, 40, 58, 82, 95, 90, 75, 55, 40, 28, 14]],
          ["Sun", [18, 28, 35, 52, 74, 85, 78, 60, 42, 30, 18, 9]],
        ]),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

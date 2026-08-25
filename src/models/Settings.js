const mongoose = require("mongoose");

// Singleton document — the app always reads/writes the first document.
// Seeded on first boot if none exists.
const settingsSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true, default: "092637 50882" },
    address: {
      type: String,
      trim: true,
      default:
        "Madan Jee Ka Hata, Pakari Chowk, Near Ara Medical, Pakari, Arrah, Bihar 802301",
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);

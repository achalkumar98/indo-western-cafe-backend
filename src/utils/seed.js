/**
 * Seed script — populates Reservations, MenuItems, Banner, and Settings with
 * real data matching the physical menu board.
 *
 * Usage (from backend/ directory):
 *   node src/utils/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const MenuItem = require("../models/MenuItem");
const Banner = require("../models/Banner");
const Settings = require("../models/Settings");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/indo-western";

// ─── Menu items — sourced from the physical menu board ────────────────────────
const menuItems = [
  // ── Beverages ──────────────────────────────────────────────────────────────
  { category: "Beverages", name: "Cold Coffee with Ice Cream", price: 150, isVeg: true, signature: true, sortOrder: 1 },
  { category: "Beverages", name: "Classic Shakes", price: 130, isVeg: true, sortOrder: 2 },
  { category: "Beverages", name: "Fresh Lime Soda", price: 80, isVeg: true, sortOrder: 3 },
  { category: "Beverages", name: "Masala Chai", price: 40, isVeg: true, sortOrder: 4 },

  // ── Starters ───────────────────────────────────────────────────────────────
  { category: "Starters", name: "Chicken Chilli", price: 220, isVeg: false, signature: true, sortOrder: 1 },
  { category: "Starters", name: "Paneer Tikka", price: 190, isVeg: true, sortOrder: 2 },
  { category: "Starters", name: "Veg Manchurian", price: 170, isVeg: true, sortOrder: 3 },
  { category: "Starters", name: "Chicken 65", price: 230, isVeg: false, sortOrder: 4 },

  // ── Egg ────────────────────────────────────────────────────────────────────
  { category: "Egg", name: "Egg Do Pyaja (2P)", price: 170, isVeg: false, sortOrder: 1 },
  { category: "Egg", name: "Egg Kadhai (2P)", price: 180, isVeg: false, sortOrder: 2 },
  { category: "Egg", name: "Egg Curry (2)", price: 190, isVeg: false, sortOrder: 3 },

  // ── Dal ────────────────────────────────────────────────────────────────────
  { category: "Dal", name: "Dal Fry", price: 130, isVeg: true, sortOrder: 1 },
  { category: "Dal", name: "Dal Tadka", price: 150, isVeg: true, sortOrder: 2 },
  { category: "Dal", name: "Dal Makhani", price: 170, isVeg: true, signature: true, sortOrder: 3 },

  // ── Rice ───────────────────────────────────────────────────────────────────
  { category: "Rice", name: "Veg Pulao", price: 150, isVeg: true, sortOrder: 1 },
  { category: "Rice", name: "Jeera Rice", price: 120, isVeg: true, sortOrder: 2 },
  { category: "Rice", name: "Mutter Pulao", price: 160, isVeg: true, sortOrder: 3 },
  { category: "Rice", name: "Plain Rice", price: 90, isVeg: true, sortOrder: 4 },

  // ── Roti ───────────────────────────────────────────────────────────────────
  { category: "Roti", name: "Paneer Paratha", price: 110, isVeg: true, signature: true, sortOrder: 1 },
  { category: "Roti", name: "Butter Tandoori Roti", price: 20, isVeg: true, sortOrder: 2 },
  { category: "Roti", name: "Lacha Paratha", price: 60, isVeg: true, sortOrder: 3 },
  { category: "Roti", name: "Aloo Paratha", price: 70, isVeg: true, sortOrder: 4 },
  { category: "Roti", name: "Tandoori Roti", price: 15, isVeg: true, sortOrder: 5 },

  // ── Naan ───────────────────────────────────────────────────────────────────
  { category: "Naan", name: "Butter Naan", price: 60, isVeg: true, sortOrder: 1 },
  { category: "Naan", name: "Garlic Naan", price: 80, isVeg: true, signature: true, sortOrder: 2 },
  { category: "Naan", name: "Onion Naan", price: 70, isVeg: true, sortOrder: 3 },
  { category: "Naan", name: "Stuff Naan", price: 90, isVeg: true, sortOrder: 4 },
  { category: "Naan", name: "Plain Naan", price: 50, isVeg: true, sortOrder: 5 },
  { category: "Naan", name: "Aloo Naan", price: 70, isVeg: true, sortOrder: 6 },

  // ── Biryani ────────────────────────────────────────────────────────────────
  { category: "Biryani", name: "Veg Biryani", price: 180, isVeg: true, sortOrder: 1 },
  { category: "Biryani", name: "Egg Biryani", price: 200, isVeg: false, sortOrder: 2 },
  { category: "Biryani", name: "Chicken Biryani", price: 250, isVeg: false, signature: true, sortOrder: 3 },
  { category: "Biryani", name: "Mutton Biryani", price: 290, isVeg: false, sortOrder: 4 },

  // ── Mains ──────────────────────────────────────────────────────────────────
  { category: "Mains", name: "Indo-Western Fusion Bowl", price: 260, isVeg: true, signature: true, sortOrder: 1 },
  { category: "Mains", name: "Butter Chicken", price: 280, isVeg: false, sortOrder: 2 },
  { category: "Mains", name: "Veg Fried Rice", price: 180, isVeg: true, sortOrder: 3 },
  { category: "Mains", name: "Cheese Loaded Pasta", price: 210, isVeg: true, sortOrder: 4 },

  // ── Salads ─────────────────────────────────────────────────────────────────
  { category: "Salads", name: "Green Salad", price: 50, isVeg: true, sortOrder: 1 },

  // ── Desserts ───────────────────────────────────────────────────────────────
  { category: "Desserts", name: "Brownie with Ice Cream", price: 160, isVeg: true, sortOrder: 1 },
  { category: "Desserts", name: "Chocolate Waffle", price: 170, isVeg: true, sortOrder: 2 },
];

const banner = {
  title: "Indo Western",
  subtitle: "Cafe & Restaurant",
  tagline: "Where Indian spice meets Western comfort — in the heart of Pakari, Arrah.",
  imageUrl:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop",
  isActive: true,
};

// ─── Synthetic monthly reservations (trending upward over 6 months) ───────────
function buildReservations() {
  const reservations = [];
  const names = [
    "Rahul Sharma", "Priya Singh", "Amit Kumar", "Sneha Verma",
    "Rohit Gupta", "Anjali Tiwari", "Vikram Yadav", "Pooja Jha",
  ];
  const monthCounts = [14, 19, 25, 31, 38, 44];
  const now = new Date();

  for (let m = 0; m < 6; m++) {
    const count = monthCounts[m];
    const year = now.getFullYear();
    const month = now.getMonth() - 5 + m;
    for (let i = 0; i < count; i++) {
      const day = 1 + Math.floor(Math.random() * 27);
      const hour = 12 + Math.floor(Math.random() * 10);
      const minute = Math.random() > 0.5 ? "00" : "30";
      const statuses = ["pending", "confirmed", "cancelled"];
      const createdAt = new Date(year, month, day, hour);
      reservations.push({
        name: names[i % names.length],
        phone: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
        partySize: 1 + Math.floor(Math.random() * 6),
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        time: `${String(hour).padStart(2, "0")}:${minute}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
  return reservations;
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    Reservation.deleteMany({}),
    MenuItem.deleteMany({}),
    Banner.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log("Cleared existing collections");

  // Insert fresh data
  await Reservation.collection.insertMany(buildReservations());
  console.log(`Inserted ${menuItems.length} menu items across ${[...new Set(menuItems.map((i) => i.category))].length} categories`);
  await MenuItem.insertMany(menuItems);
  await Banner.create(banner);
  await Settings.create({}); // schema defaults
  console.log("Seed complete ✓");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Seed script — populates Reservations, MenuItems, Banner, and Settings with
 * demo data. Existing collections are cleared first.
 *
 * Usage: node src/utils/seed.js  (from backend/ directory)
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const MenuItem = require("../models/MenuItem");
const Banner = require("../models/Banner");
const Settings = require("../models/Settings");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/indo-western";

const menuItems = [
  { category: "Beverages", name: "Cold Coffee with Ice Cream", price: 150, isVeg: true, signature: true, sortOrder: 1 },
  { category: "Beverages", name: "Classic Shakes", price: 130, isVeg: true, sortOrder: 2 },
  { category: "Beverages", name: "Fresh Lime Soda", price: 80, isVeg: true, sortOrder: 3 },
  { category: "Beverages", name: "Masala Chai", price: 40, isVeg: true, sortOrder: 4 },
  { category: "Starters", name: "Chicken Chilli", price: 220, isVeg: false, signature: true, sortOrder: 1 },
  { category: "Starters", name: "Paneer Tikka", price: 190, isVeg: true, sortOrder: 2 },
  { category: "Starters", name: "Veg Manchurian", price: 170, isVeg: true, sortOrder: 3 },
  { category: "Starters", name: "Chicken 65", price: 230, isVeg: false, sortOrder: 4 },
  { category: "Mains", name: "Indo-Western Fusion Bowl", price: 260, isVeg: true, signature: true, sortOrder: 1 },
  { category: "Mains", name: "Butter Chicken", price: 280, isVeg: false, sortOrder: 2 },
  { category: "Mains", name: "Veg Fried Rice", price: 180, isVeg: true, sortOrder: 3 },
  { category: "Mains", name: "Cheese Loaded Pasta", price: 210, isVeg: true, sortOrder: 4 },
  { category: "Desserts", name: "Brownie with Ice Cream", price: 160, isVeg: true, sortOrder: 1 },
  { category: "Desserts", name: "Chocolate Waffle", price: 170, isVeg: true, sortOrder: 2 },
];

const banner = {
  title: "Indo Western",
  subtitle: "Cafe & Restaurant",
  tagline: "Where Indian spice meets Western comfort — in the heart of Pakari, Arrah.",
  imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop",
  isActive: true,
};

// Build synthetic monthly reservations (trending upward)
function buildReservations() {
  const reservations = [];
  const names = ["Rahul Sharma", "Priya Singh", "Amit Kumar", "Sneha Verma", "Rohit Gupta", "Anjali Tiwari", "Vikram Yadav", "Pooja Jha"];
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

  // Clear
  await Promise.all([
    Reservation.deleteMany({}),
    MenuItem.deleteMany({}),
    Banner.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // Insert
  await Reservation.collection.insertMany(buildReservations());
  await MenuItem.insertMany(menuItems);
  await Banner.create(banner);
  await Settings.create({}); // uses schema defaults
  console.log("Seed data inserted");

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

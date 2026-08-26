/**
 * Seed script — populates Reservations, MenuItems, Banner, and Settings.
 * Each menu item includes a curated Unsplash photo URL.
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

// ─── Unsplash helper — append consistent sizing params ───────────────────────
const u = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// ─── Menu items with curated food photos ─────────────────────────────────────
const menuItems = [
  // ── Beverages ──────────────────────────────────────────────────────────────
  {
    category: "Beverages",
    name: "Cold Coffee with Ice Cream",
    price: 150,
    isVeg: true,
    signature: true,
    sortOrder: 1,
    imageUrl: u("1461023058943-362e16de9b6d"), // iced coffee with cream
  },
  {
    category: "Beverages",
    name: "Classic Shakes",
    price: 130,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1572490122747-3968b75cc699"), // thick milkshake
  },
  {
    category: "Beverages",
    name: "Fresh Lime Soda",
    price: 80,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1625772299848-391b6a87d7b3"), // lime soda glass
  },
  {
    category: "Beverages",
    name: "Masala Chai",
    price: 40,
    isVeg: true,
    sortOrder: 4,
    imageUrl: u("1567632417025-b53e7ebb3ac1"), // masala chai cup
  },

  // ── Starters ───────────────────────────────────────────────────────────────
  {
    category: "Starters",
    name: "Chicken Chilli",
    price: 220,
    isVeg: false,
    signature: true,
    sortOrder: 1,
    imageUrl: u("1603133872878-684f208fb84b"), // chilli chicken Indo-Chinese
  },
  {
    category: "Starters",
    name: "Paneer Tikka",
    price: 190,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1567188040759-fb8a883dc6d8"), // paneer tikka skewers
  },
  {
    category: "Starters",
    name: "Veg Manchurian",
    price: 170,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1625398407796-3b4ba68ffd6f"), // manchurian balls in sauce
  },
  {
    category: "Starters",
    name: "Chicken 65",
    price: 230,
    isVeg: false,
    sortOrder: 4,
    imageUrl: u("1610057099443-61cd7ea53b27"), // crispy fried chicken bites
  },

  // ── Egg ────────────────────────────────────────────────────────────────────
  {
    category: "Egg",
    name: "Egg Do Pyaza (2P)",
    price: 170,
    isVeg: false,
    sortOrder: 1,
    imageUrl: u("1612240498936-65f5101365d2"), // egg curry with onions
  },
  {
    category: "Egg",
    name: "Egg Kadhai (2P)",
    price: 180,
    isVeg: false,
    sortOrder: 2,
    imageUrl: u("1603894584373-5ac82b2ae398"), // kadhai egg dish
  },
  {
    category: "Egg",
    name: "Egg Curry (2)",
    price: 190,
    isVeg: false,
    sortOrder: 3,
    imageUrl: u("1596797882218-a0d03d4e2e48"), // egg curry bowl
  },

  // ── Dal ────────────────────────────────────────────────────────────────────
  {
    category: "Dal",
    name: "Dal Fry",
    price: 130,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1546833999-b9f581b1158c"), // dal fry in bowl
  },
  {
    category: "Dal",
    name: "Dal Tadka",
    price: 150,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1505253716362-afaea1d3d1af"), // yellow dal tadka
  },
  {
    category: "Dal",
    name: "Dal Makhani",
    price: 170,
    isVeg: true,
    signature: true,
    sortOrder: 3,
    imageUrl: u("1585937421612-70a008356fbe"), // creamy dal makhani
  },

  // ── Rice ───────────────────────────────────────────────────────────────────
  {
    category: "Rice",
    name: "Veg Pulao",
    price: 150,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1596560548464-f010640f6882"), // veg pulao with veggies
  },
  {
    category: "Rice",
    name: "Jeera Rice",
    price: 120,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1601050690597-df0568f70950"), // jeera rice close-up
  },
  {
    category: "Rice",
    name: "Mutter Pulao",
    price: 160,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1645177628172-a5fd8a44af3d"), // peas pulao
  },
  {
    category: "Rice",
    name: "Plain Rice",
    price: 90,
    isVeg: true,
    sortOrder: 4,
    imageUrl: u("1536304929831-ee1ca9d44906"), // steamed white rice
  },

  // ── Roti ───────────────────────────────────────────────────────────────────
  {
    category: "Roti",
    name: "Paneer Paratha",
    price: 110,
    isVeg: true,
    signature: true,
    sortOrder: 1,
    imageUrl: u("1589302168068-964664d93dc0"), // stuffed paratha with butter
  },
  {
    category: "Roti",
    name: "Butter Tandoori Roti",
    price: 20,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1626202386054-b95ea6024c29"), // tandoori roti with butter
  },
  {
    category: "Roti",
    name: "Lacha Paratha",
    price: 60,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1609501676725-7186f017a4b0"), // flaky layered lacha paratha
  },
  {
    category: "Roti",
    name: "Aloo Paratha",
    price: 70,
    isVeg: true,
    sortOrder: 4,
    imageUrl: u("1565557623262-b51656e06c2b"), // aloo paratha with curd
  },
  {
    category: "Roti",
    name: "Tandoori Roti",
    price: 15,
    isVeg: true,
    sortOrder: 5,
    imageUrl: u("1626202386054-b95ea6024c29"), // plain tandoori roti
  },

  // ── Naan ───────────────────────────────────────────────────────────────────
  {
    category: "Naan",
    name: "Butter Naan",
    price: 60,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1574071318508-1cdbab80d002"), // butter naan in a basket
  },
  {
    category: "Naan",
    name: "Garlic Naan",
    price: 80,
    isVeg: true,
    signature: true,
    sortOrder: 2,
    imageUrl: u("1632778162833-53bed9c45e74"), // garlic naan with herbs
  },
  {
    category: "Naan",
    name: "Onion Naan",
    price: 70,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1601050690597-df0568f70950"), // onion naan flatbread
  },
  {
    category: "Naan",
    name: "Stuff Naan",
    price: 90,
    isVeg: true,
    sortOrder: 4,
    imageUrl: u("1574071318508-1cdbab80d002"), // stuffed naan cross-section
  },
  {
    category: "Naan",
    name: "Plain Naan",
    price: 50,
    isVeg: true,
    sortOrder: 5,
    imageUrl: u("1574071318508-1cdbab80d002"), // plain soft naan
  },
  {
    category: "Naan",
    name: "Aloo Naan",
    price: 70,
    isVeg: true,
    sortOrder: 6,
    imageUrl: u("1565557623262-b51656e06c2b"), // aloo stuffed naan
  },

  // ── Biryani ────────────────────────────────────────────────────────────────
  {
    category: "Biryani",
    name: "Veg Biryani",
    price: 180,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1585937421612-70a008356fbe"), // aromatic veg biryani
  },
  {
    category: "Biryani",
    name: "Egg Biryani",
    price: 200,
    isVeg: false,
    sortOrder: 2,
    imageUrl: u("1596797882218-a0d03d4e2e48"), // egg biryani in handi
  },
  {
    category: "Biryani",
    name: "Chicken Biryani",
    price: 250,
    isVeg: false,
    signature: true,
    sortOrder: 3,
    imageUrl: u("1563379926898-05f4575a45d8"), // chicken biryani hero shot
  },
  {
    category: "Biryani",
    name: "Mutton Biryani",
    price: 290,
    isVeg: false,
    sortOrder: 4,
    imageUrl: u("1574653853027-5382a3d23a15"), // mutton biryani with raita
  },

  // ── Mains ──────────────────────────────────────────────────────────────────
  {
    category: "Mains",
    name: "Indo-Western Fusion Bowl",
    price: 260,
    isVeg: true,
    signature: true,
    sortOrder: 1,
    imageUrl: u("1512058564366-18510be2db19"), // vibrant fusion bowl
  },
  {
    category: "Mains",
    name: "Butter Chicken",
    price: 280,
    isVeg: false,
    sortOrder: 2,
    imageUrl: u("1603894584373-5ac82b2ae398"), // butter chicken in curry
  },
  {
    category: "Mains",
    name: "Veg Fried Rice",
    price: 180,
    isVeg: true,
    sortOrder: 3,
    imageUrl: u("1536304929831-ee1ca9d44906"), // wok-tossed fried rice
  },
  {
    category: "Mains",
    name: "Cheese Loaded Pasta",
    price: 210,
    isVeg: true,
    sortOrder: 4,
    imageUrl: u("1555949258-eb67b1ef0ceb"), // cheesy pasta bake
  },

  // ── Salads ─────────────────────────────────────────────────────────────────
  {
    category: "Salads",
    name: "Green Salad",
    price: 50,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1512621776951-a57ef161de6b"), // fresh green salad bowl
  },

  // ── Desserts ───────────────────────────────────────────────────────────────
  {
    category: "Desserts",
    name: "Brownie with Ice Cream",
    price: 160,
    isVeg: true,
    sortOrder: 1,
    imageUrl: u("1563805042-7062-dc6d9c3e2b9"), // brownie with ice cream scoop
  },
  {
    category: "Desserts",
    name: "Chocolate Waffle",
    price: 170,
    isVeg: true,
    sortOrder: 2,
    imageUrl: u("1562376552-0d160a2f238d"), // chocolate waffle with syrup
  },
];

// ─── Hero banner ─────────────────────────────────────────────────────────────
const banner = {
  title: "Indo Western",
  subtitle: "Cafe & Restaurant",
  tagline: "Where Indian spice meets Western comfort — in the heart of Pakari, Arrah.",
  imageUrl: u("1517248135467-4c7edcad34c4", 1600),
  isActive: true,
};

// ─── Synthetic monthly reservations (trending upward over 6 months) ──────────
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

  await Promise.all([
    Reservation.deleteMany({}),
    MenuItem.deleteMany({}),
    Banner.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log("Cleared existing collections");

  await Reservation.collection.insertMany(buildReservations());
  await MenuItem.insertMany(menuItems);
  await Banner.create(banner);
  await Settings.create({});

  const categories = [...new Set(menuItems.map((i) => i.category))];
  console.log(
    `Seeded ${menuItems.length} menu items across ${categories.length} categories: ${categories.join(", ")}`
  );
  console.log("Seed complete ✓");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

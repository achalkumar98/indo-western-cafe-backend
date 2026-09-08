/**
 * Seed script — seeds only structural/reference data that the admin will
 * manage: menu items with photos, a hero banner, default settings, and
 * initial gallery photos.
 *
 * NO fake reservations are seeded — those are real guest data created through
 * the public booking form and managed through the admin panel.
 *
 * Usage (from backend/ directory):
 *   node src/utils/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const { MenuItem, Banner, Settings, GalleryItem } = require('../models');

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/indo-western";

// ─── Unsplash helper ─────────────────────────────────────────────────────────
const u = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// ─── Menu items ───────────────────────────────────────────────────────────────
const menuItems = [
  // Beverages
  { category: "Beverages", name: "Cold Coffee with Ice Cream", price: 150, isVeg: true, signature: true, sortOrder: 1, imageUrl: u("1461023058943-362e16de9b6d") },
  { category: "Beverages", name: "Classic Shakes", price: 130, isVeg: true, sortOrder: 2, imageUrl: u("1572490122747-3968b75cc699") },
  { category: "Beverages", name: "Fresh Lime Soda", price: 80, isVeg: true, sortOrder: 3, imageUrl: u("1625772299848-391b6a87d7b3") },
  { category: "Beverages", name: "Masala Chai", price: 40, isVeg: true, sortOrder: 4, imageUrl: u("1567632417025-b53e7ebb3ac1") },
  // Starters
  { category: "Starters", name: "Chicken Chilli", price: 220, isVeg: false, signature: true, sortOrder: 1, imageUrl: u("1603133872878-684f208fb84b") },
  { category: "Starters", name: "Paneer Tikka", price: 190, isVeg: true, sortOrder: 2, imageUrl: u("1567188040759-fb8a883dc6d8") },
  { category: "Starters", name: "Veg Manchurian", price: 170, isVeg: true, sortOrder: 3, imageUrl: u("1625398407796-3b4ba68ffd6f") },
  { category: "Starters", name: "Chicken 65", price: 230, isVeg: false, sortOrder: 4, imageUrl: u("1610057099443-61cd7ea53b27") },
  // Egg
  { category: "Egg", name: "Egg Do Pyaza (2P)", price: 170, isVeg: false, sortOrder: 1, imageUrl: u("1612240498936-65f5101365d2") },
  { category: "Egg", name: "Egg Kadhai (2P)", price: 180, isVeg: false, sortOrder: 2, imageUrl: u("1603894584373-5ac82b2ae398") },
  { category: "Egg", name: "Egg Curry (2)", price: 190, isVeg: false, sortOrder: 3, imageUrl: u("1596797882218-a0d03d4e2e48") },
  // Dal
  { category: "Dal", name: "Dal Fry", price: 130, isVeg: true, sortOrder: 1, imageUrl: u("1546833999-b9f581b1158c") },
  { category: "Dal", name: "Dal Tadka", price: 150, isVeg: true, sortOrder: 2, imageUrl: u("1505253716362-afaea1d3d1af") },
  { category: "Dal", name: "Dal Makhani", price: 170, isVeg: true, signature: true, sortOrder: 3, imageUrl: u("1585937421612-70a008356fbe") },
  // Rice
  { category: "Rice", name: "Veg Pulao", price: 150, isVeg: true, sortOrder: 1, imageUrl: u("1596560548464-f010640f6882") },
  { category: "Rice", name: "Jeera Rice", price: 120, isVeg: true, sortOrder: 2, imageUrl: u("1601050690597-df0568f70950") },
  { category: "Rice", name: "Mutter Pulao", price: 160, isVeg: true, sortOrder: 3, imageUrl: u("1645177628172-a5fd8a44af3d") },
  { category: "Rice", name: "Plain Rice", price: 90, isVeg: true, sortOrder: 4, imageUrl: u("1536304929831-ee1ca9d44906") },
  // Roti
  { category: "Roti", name: "Paneer Paratha", price: 110, isVeg: true, signature: true, sortOrder: 1, imageUrl: u("1589302168068-964664d93dc0") },
  { category: "Roti", name: "Butter Tandoori Roti", price: 20, isVeg: true, sortOrder: 2, imageUrl: u("1626202386054-b95ea6024c29") },
  { category: "Roti", name: "Lacha Paratha", price: 60, isVeg: true, sortOrder: 3, imageUrl: u("1609501676725-7186f017a4b0") },
  { category: "Roti", name: "Aloo Paratha", price: 70, isVeg: true, sortOrder: 4, imageUrl: u("1565557623262-b51656e06c2b") },
  { category: "Roti", name: "Tandoori Roti", price: 15, isVeg: true, sortOrder: 5, imageUrl: u("1626202386054-b95ea6024c29") },
  // Naan
  { category: "Naan", name: "Butter Naan", price: 60, isVeg: true, sortOrder: 1, imageUrl: u("1574071318508-1cdbab80d002") },
  { category: "Naan", name: "Garlic Naan", price: 80, isVeg: true, signature: true, sortOrder: 2, imageUrl: u("1632778162833-53bed9c45e74") },
  { category: "Naan", name: "Onion Naan", price: 70, isVeg: true, sortOrder: 3, imageUrl: u("1601050690597-df0568f70950") },
  { category: "Naan", name: "Stuff Naan", price: 90, isVeg: true, sortOrder: 4, imageUrl: u("1574071318508-1cdbab80d002") },
  { category: "Naan", name: "Plain Naan", price: 50, isVeg: true, sortOrder: 5, imageUrl: u("1574071318508-1cdbab80d002") },
  { category: "Naan", name: "Aloo Naan", price: 70, isVeg: true, sortOrder: 6, imageUrl: u("1565557623262-b51656e06c2b") },
  // Biryani
  { category: "Biryani", name: "Veg Biryani", price: 180, isVeg: true, sortOrder: 1, imageUrl: u("1585937421612-70a008356fbe") },
  { category: "Biryani", name: "Egg Biryani", price: 200, isVeg: false, sortOrder: 2, imageUrl: u("1596797882218-a0d03d4e2e48") },
  { category: "Biryani", name: "Chicken Biryani", price: 250, isVeg: false, signature: true, sortOrder: 3, imageUrl: u("1563379926898-05f4575a45d8") },
  { category: "Biryani", name: "Mutton Biryani", price: 290, isVeg: false, sortOrder: 4, imageUrl: u("1574653853027-5382a3d23a15") },
  // Mains
  { category: "Mains", name: "Indo-Western Fusion Bowl", price: 260, isVeg: true, signature: true, sortOrder: 1, imageUrl: u("1512058564366-18510be2db19") },
  { category: "Mains", name: "Butter Chicken", price: 280, isVeg: false, sortOrder: 2, imageUrl: u("1603894584373-5ac82b2ae398") },
  { category: "Mains", name: "Veg Fried Rice", price: 180, isVeg: true, sortOrder: 3, imageUrl: u("1536304929831-ee1ca9d44906") },
  { category: "Mains", name: "Cheese Loaded Pasta", price: 210, isVeg: true, sortOrder: 4, imageUrl: u("1555949258-eb67b1ef0ceb") },
  // Salads
  { category: "Salads", name: "Green Salad", price: 50, isVeg: true, sortOrder: 1, imageUrl: u("1512621776951-a57ef161de6b") },
  // Desserts
  { category: "Desserts", name: "Brownie with Ice Cream", price: 160, isVeg: true, sortOrder: 1, imageUrl: u("1563805042-7062-dc6d9c3e2b9") },
  { category: "Desserts", name: "Chocolate Waffle", price: 170, isVeg: true, sortOrder: 2, imageUrl: u("1562376552-0d160a2f238d") },
];

// ─── Hero banner ──────────────────────────────────────────────────────────────
const banner = {
  title: "Indo Western",
  subtitle: "Cafe & Restaurant",
  tagline: "Where Indian spice meets Western comfort — in the heart of Pakari, Arrah.",
  imageUrl: u("1517248135467-4c7edcad34c4", 1600),
  isActive: true,
};

// ─── Gallery photos ───────────────────────────────────────────────────────────
const galleryItems = [
  {
    imageUrl: u("1509042239860-f550ce710b93"),
    label: "Cold Coffee",
    span: "tall",
    sortOrder: 1,
  },
  {
    imageUrl: u("1565299624946-b28f40a0ae38"),
    label: "Starters",
    span: "normal",
    sortOrder: 2,
  },
  {
    imageUrl: u("1567620905732-2d1ec7ab7445"),
    label: "Mains",
    span: "normal",
    sortOrder: 3,
  },
  {
    imageUrl: u("1414235077428-338989a2e8c0"),
    label: "Ambience",
    span: "wide",
    sortOrder: 4,
  },
  {
    imageUrl: u("1551024601-bec78aea704b"),
    label: "Desserts",
    span: "normal",
    sortOrder: 5,
  },
  {
    imageUrl: u("1555396273-367ea4eb4db5"),
    label: "The Vibe",
    span: "normal",
    sortOrder: 6,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear only reference data — NOT reservations (those are real guest bookings)
  await Promise.all([
    MenuItem.deleteMany({}),
    Banner.deleteMany({}),
    Settings.deleteMany({}),
    GalleryItem.deleteMany({}),
  ]);
  console.log("Cleared menu, banners, settings, gallery");

  await MenuItem.insertMany(menuItems);
  console.log(`Seeded ${menuItems.length} menu items`);

  await Banner.create(banner);
  console.log("Seeded hero banner");

  await Settings.create({});
  console.log("Seeded default settings");

  await GalleryItem.insertMany(galleryItems);
  console.log(`Seeded ${galleryItems.length} gallery photos`);

  console.log("\nSeed complete ✓");
  console.log("→ Reservations are NOT seeded — they come from real guest bookings.");
  console.log("→ Log in to the admin panel to customise all settings.");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

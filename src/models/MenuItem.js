const mongoose = require("mongoose");

const CATEGORIES = [
  "Beverages",
  "Starters",
  "Mains",
  "Desserts",
  "Egg",
  "Dal",
  "Rice",
  "Roti",
  "Naan",
  "Biryani",
  "Salads",
];

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: CATEGORIES,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    isVeg: { type: Boolean, required: true, default: true },
    signature: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    // Optional photo shown on the public menu card. Store a full HTTPS URL
    // (e.g. Unsplash, Cloudinary, S3) — no file uploads handled by this API.
    imageUrl: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// Compound index for fast category listing
menuItemSchema.index({ category: 1, sortOrder: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
module.exports.CATEGORIES = CATEGORIES;

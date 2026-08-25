const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ["Beverages", "Starters", "Mains", "Desserts"],
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    isVeg: { type: Boolean, required: true, default: true },
    signature: { type: Boolean, default: false },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for fast category listing
menuItemSchema.index({ category: 1, sortOrder: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);

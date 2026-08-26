const mongoose = require("mongoose");

// Each gallery item is a photo the admin uploads (by URL) with a label.
// The public /api/gallery endpoint returns these sorted by sortOrder.
const galleryItemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    label: { type: String, trim: true, maxlength: 60, default: "" },
    // "tall" = row-span-2, "wide" = col-span-2, "normal" = default
    span: {
      type: String,
      enum: ["normal", "tall", "wide"],
      default: "normal",
    },
    sortOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

galleryItemSchema.index({ sortOrder: 1, createdAt: 1 });

module.exports = mongoose.model("GalleryItem", galleryItemSchema);

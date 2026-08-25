const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    subtitle: { type: String, trim: true, maxlength: 100, default: "" },
    tagline: { type: String, trim: true, maxlength: 200, default: "" },
    imageUrl: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);

const mongoose = require("mongoose");

// Admin account for the dashboard. Passwords are stored hashed (bcrypt) in
// `passwordHash`, which is never selected by default so it can't leak through
// a stray query. Hashing/verification lives in services/authService.js.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    name: { type: String, trim: true, maxlength: 60 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

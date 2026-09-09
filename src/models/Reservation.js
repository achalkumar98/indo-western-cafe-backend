const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    customerMobileNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    tableSize: { type: Number, required: true, min: 1, max: 30 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    occasion: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, maxlength: 300, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);

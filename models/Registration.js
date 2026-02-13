/*
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
});

// Ensure unique registration per user per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
*/

const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event ID is required"],
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["confirmed", "cancelled"],
    default: "confirmed",
  },
});

// Ensure unique registration per user per event (only for confirmed registrations)
registrationSchema.index(
  { user: 1, event: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);

module.exports = mongoose.model("Registration", registrationSchema);

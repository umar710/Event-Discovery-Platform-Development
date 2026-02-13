const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide event name"],
    trim: true,
    maxlength: [100, "Event name cannot be more than 100 characters"],
  },
  organizer: {
    type: String,
    required: [true, "Please provide organizer name"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Please provide event location"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Please provide event date"],
  },
  description: {
    type: String,
    required: [true, "Please provide event description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  capacity: {
    type: Number,
    required: [true, "Please provide event capacity"],
    min: [1, "Capacity must be at least 1"],
  },
  category: {
    type: String,
    required: [true, "Please provide event category"],
    enum: ["Conference", "Workshop", "Meetup", "Concert", "Sports", "Other"],
  },
  imageUrl: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for registrations
eventSchema.virtual("registrations", {
  ref: "Registration",
  localField: "_id",
  foreignField: "event",
  count: true,
});

// Virtual for available seats
eventSchema.virtual("availableSeats").get(function () {
  return this.capacity - (this.registrationsCount || 0);
});

// Include virtuals in JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);

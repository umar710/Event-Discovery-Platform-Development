const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    console.log("📝 Registration request received");
    console.log("User:", req.user?._id);
    console.log("Body:", req.body);

    const { eventId } = req.body;

    // Validation
    if (!eventId) {
      console.log("❌ No eventId provided");
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("❌ Event not found:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("✅ Event found:", event.name);

    // Check if event date is valid
    const eventDate = new Date(event.date);
    const today = new Date();
    if (eventDate < today) {
      console.log("❌ Event is in the past:", event.date);
      return res
        .status(400)
        .json({ message: "Cannot register for past events" });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: eventId,
      status: "confirmed",
    });

    if (existingRegistration) {
      console.log("❌ User already registered");
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check capacity
    const registrationsCount = await Registration.countDocuments({
      event: eventId,
      status: "confirmed",
    });

    console.log(
      `📊 Current registrations: ${registrationsCount}/${event.capacity}`
    );

    if (registrationsCount >= event.capacity) {
      console.log("❌ Event is full");
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = new Registration({
      user: req.user._id,
      event: eventId,
      status: "confirmed",
      registeredAt: new Date(),
    });

    await registration.save();
    console.log("✅ Registration created:", registration._id);

    // Populate event details for response
    await registration.populate("event");

    res.status(201).json({
      message: "Successfully registered for event",
      registration,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // Handle duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You are already registered for this event",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   DELETE /api/registrations/:eventId
// @desc    Cancel registration
// @access  Private
router.delete("/:eventId", protect, async (req, res) => {
  try {
    console.log(
      "📝 Cancel registration request for event:",
      req.params.eventId
    );

    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
      status: "confirmed",
    });

    if (!registration) {
      console.log("❌ Registration not found");
      return res.status(404).json({ message: "Registration not found" });
    }

    // Check if event is in the future
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Cannot cancel past events" });
    }

    registration.status = "cancelled";
    await registration.save();

    console.log("✅ Registration cancelled successfully");
    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("❌ Cancel registration error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/registrations/my-registrations
// @desc    Get user's registrations
// @access  Private
router.get("/my-registrations", protect, async (req, res) => {
  try {
    console.log("📝 Fetching registrations for user:", req.user._id);

    const registrations = await Registration.find({
      user: req.user._id,
      status: "confirmed",
    }).populate("event");

    console.log(`✅ Found ${registrations.length} registrations`);

    // Separate upcoming and past events
    const now = new Date();
    const upcoming = [];
    const past = [];

    registrations.forEach((reg) => {
      if (reg.event && new Date(reg.event.date) > now) {
        upcoming.push(reg);
      } else if (reg.event) {
        past.push(reg);
      }
    });

    console.log(`📊 Upcoming: ${upcoming.length}, Past: ${past.length}`);

    res.json({
      upcoming,
      past,
    });
  } catch (error) {
    console.error("❌ Fetch registrations error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/registrations/check/:eventId
// @desc    Check if user is registered for an event
// @access  Private
router.get("/check/:eventId", protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
      status: "confirmed",
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    console.error("❌ Check registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

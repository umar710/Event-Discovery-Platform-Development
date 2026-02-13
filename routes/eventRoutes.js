const express = require("express");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with filtering
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { search, category, location, page = 1, limit = 9 } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Execute query with pagination
    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get registrations count for each event
    const Registration = require("../models/Registration");
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const registrationsCount = await Registration.countDocuments({
          event: event._id,
          status: "confirmed",
        });
        return {
          ...event.toJSON(),
          registrationsCount,
        };
      })
    );

    // Get total count
    const total = await Event.countDocuments(query);

    res.json({
      events: eventsWithCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Get registrations count
    const Registration = require("../models/Registration");
    const registrationsCount = await Registration.countDocuments({
      event: event._id,
      status: "confirmed",
    });

    res.json({
      ...event.toJSON(),
      registrationsCount,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/events
// @desc    Create event (for seeding)
// @access  Public (temporarily for seeding)
router.post("/", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

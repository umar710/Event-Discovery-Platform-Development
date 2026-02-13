const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");

dotenv.config();

// Generate dates that are in the future from today
const getFutureDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const events = [
  {
    name: "Tech Conference 2026",
    organizer: "Tech Events Inc",
    location: "San Francisco, CA",
    date: getFutureDate(30),
    description:
      "Join us for the biggest tech conference of the year featuring keynote speakers from leading tech companies.",
    capacity: 500,
    category: "Conference",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "React Workshop 2026",
    organizer: "Frontend Masters",
    location: "Online",
    date: getFutureDate(15),
    description:
      "Learn React from scratch and build real-world applications in this hands-on workshop.",
    capacity: 100,
    category: "Workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Startup Meetup",
    organizer: "Startup Grind",
    location: "Austin, TX",
    date: getFutureDate(7),
    description:
      "Network with founders, investors, and tech enthusiasts at our monthly meetup.",
    capacity: 150,
    category: "Meetup",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Summer Music Festival",
    organizer: "Live Nation",
    location: "Los Angeles, CA",
    date: getFutureDate(60),
    description:
      "A day of amazing music with top artists from around the world.",
    capacity: 5000,
    category: "Concert",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Data Science Symposium",
    organizer: "Data Community",
    location: "Boston, MA",
    date: getFutureDate(45),
    description:
      "Explore the latest trends in data science and machine learning.",
    capacity: 300,
    category: "Conference",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Yoga Retreat",
    organizer: "Wellness Center",
    location: "Boulder, CO",
    date: getFutureDate(20),
    description:
      "Rejuvenate your mind and body with our weekend yoga retreat in the mountains.",
    capacity: 50,
    category: "Other",
    imageUrl:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Startup Pitch Night",
    organizer: "Venture Capital Association",
    location: "New York, NY",
    date: getFutureDate(25),
    description:
      "Watch startups pitch to top investors and network with the ecosystem.",
    capacity: 200,
    category: "Meetup",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "UX Design Workshop",
    organizer: "Design School",
    location: "Seattle, WA",
    date: getFutureDate(35),
    description:
      "Learn user-centered design principles and create better products.",
    capacity: 75,
    category: "Workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Charity Run",
    organizer: "Community Foundation",
    location: "Chicago, IL",
    date: getFutureDate(40),
    description: "Run for a cause and help raise funds for local charities.",
    capacity: 1000,
    category: "Sports",
    imageUrl:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "AI Summit 2026",
    organizer: "Tech Leaders",
    location: "San Jose, CA",
    date: getFutureDate(90),
    description:
      "Explore the future of artificial intelligence with industry experts.",
    capacity: 400,
    category: "Conference",
    imageUrl:
      "https://images.unsplash.com/photo-1485826229042-3d5a1a9c1f1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Photography Workshop",
    organizer: "Art Center",
    location: "Portland, OR",
    date: getFutureDate(50),
    description:
      "Master your camera and learn professional photography techniques.",
    capacity: 30,
    category: "Workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1554048612-b76b7f2461ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Blockchain Conference",
    organizer: "Crypto Association",
    location: "Miami, FL",
    date: getFutureDate(120),
    description:
      "Discover the latest in blockchain technology and cryptocurrency.",
    capacity: 600,
    category: "Conference",
    imageUrl:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing events
    console.log("Clearing existing events...");
    await Event.deleteMany({});
    console.log("✅ Cleared existing events");

    // Insert new events
    console.log("Inserting mock events...");
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ Successfully added ${insertedEvents.length} mock events`);

    console.log("\n📅 Events added:");
    insertedEvents.forEach((event, index) => {
      console.log(
        `${index + 1}. ${event.name} - ${event.date.toLocaleDateString()}`
      );
    });

    // Show count
    const count = await Event.countDocuments();
    console.log(`\n📊 Total events in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();

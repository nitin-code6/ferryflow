const mongoose = require("mongoose");
require("dotenv").config();

// Import seed utilities
const seedUsers = require("./user.seed");
const seedFerries = require("./ferry.seed");
const seedRoutes = require("./route.seed");
const seedSchedules = require("./schedule.seed");
const seedBookings = require("./booking.seed");
const seedAlerts = require("./alert.seed");

// Import Mongoose Models to clear collections
const User = require("../src/models/user.model");
const Ferry = require("../src/models/ferry.model");
const Route = require("../src/models/route.model");
const Schedule = require("../src/models/schedule.model");
const Booking = require("../src/models/booking.model");
const Alert = require("../src/models/alert.model");
const Otp = require("../src/models/otp.model");

const runSeeds = async () => {
    // 8. SAFETY CHECK - Warning
    console.log("=========================================");
    console.log("⚠️  DEVELOPMENT DATABASE SEED TRIGGERED  ⚠️");
    console.log("=========================================");
    console.log("This script will empty existing user, ferry, route, schedule, booking, and alert tables.");
    console.log("Running in 3 seconds... Press Ctrl+C to cancel.");
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        const dbUri = process.env.MONGODB_URI;
        if (!dbUri) {
            throw new Error("MONGODB_URI is not set in environmental configuration.");
        }

        console.log("Connecting to Database...");
        await mongoose.connect(dbUri);
        console.log("Connected successfully.");

        // Clear existing development collections
        console.log("\nCleaning existing database collections...");
        await User.deleteMany({});
        await Ferry.deleteMany({});
        await Route.deleteMany({});
        await Schedule.deleteMany({});
        await Booking.deleteMany({});
        await Alert.deleteMany({});
        await Otp.deleteMany({});
        console.log("Collections cleared successfully.");

        // Run seed functions in strict order
        const users = await seedUsers();
        const ferries = await seedFerries();
        const routes = await seedRoutes();
        const schedules = await seedSchedules(ferries, routes);
        await seedBookings(users, schedules);
        await seedAlerts(users, ferries, routes);

        console.log("\n=========================================");
        console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY 🎉");
        console.log("=========================================");
    } catch (error) {
        console.error("Database seeding failed with error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
        process.exit(0);
    }
};

runSeeds();

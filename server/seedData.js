require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import all models
const User = require("./src/models/user.model");
const Ferry = require("./src/models/ferry.model");
const Route = require("./src/models/route.model");
const Schedule = require("./src/models/schedule.model");
const Booking = require("./src/models/booking.model");
const Alert = require("./src/models/alert.model");
const Inquiry = require("./src/models/inquiry.model");

const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ferryflow";

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        console.log("Clearing existing data...");
        await User.deleteMany();
        await Ferry.deleteMany();
        await Route.deleteMany();
        await Schedule.deleteMany();
        await Booking.deleteMany();
        await Alert.deleteMany();
        await Inquiry.deleteMany();

        const defaultPassword = await bcrypt.hash("Password@123", 10);

        // ==========================================
        // 1. USERS
        // ==========================================
        console.log("Creating Users...");

        const admin = await User.create({
            name: "Rajesh Sharma",
            email: "admin@ferryflow.com",
            password: defaultPassword,
            role: "admin",
            isVerified: true,
            accountStatus: "active"
        });

        const staffNames = ["Amit Kumar", "Priya Singh", "Rahul Verma", "Neha Gupta", "Suresh Yadav"];
        const staffUsers = [];
        for (let i = 0; i < staffNames.length; i++) {
            staffUsers.push(await User.create({
                name: staffNames[i],
                email: `staff${i + 1}@ferryflow.com`,
                password: defaultPassword,
                role: "staff",
                isVerified: true,
                accountStatus: "active"
            }));
        }

        const passengerNames = [
            "Arjun Sharma", "Rohan Patel", "Ananya Singh", "Sneha Verma", "Vikram Rao", "Kavya Gupta",
            "Aditya Iyer", "Diya Menon", "Aryan Desai", "Ishita Bose", "Ravi Teja", "Nisha Reddy",
            "Karan Johar", "Pooja Hegde", "Varun Dhawan", "Alia Bhatt", "Siddharth Malhotra", "Kiara Advani",
            "Ranveer Singh", "Deepika Padukone", "Ranbir Kapoor", "Shraddha Kapoor", "Tiger Shroff", "Disha Patani",
            "Ayushmann Khurrana", "Bhumi Pednekar", "Rajkummar Rao", "Kriti Sanon", "Kartik Aaryan", "Sara Ali Khan"
        ];
        const passengerUsers = [];
        for (let i = 0; i < passengerNames.length; i++) {
            passengerUsers.push(await User.create({
                name: passengerNames[i],
                email: `passenger${i + 1}@ferryflow.com`,
                password: defaultPassword,
                role: "citizen", // passenger role in schema is 'citizen' or 'tourist'
                isVerified: true,
                accountStatus: "active"
            }));
        }


        // ==========================================
        // 2. FERRIES
        // ==========================================
        console.log("Creating Ferries...");
        const ferriesData = [
            { name: "Sea Explorer", capacity: 150, status: "available", registrationNumber: "IND-MAH-001" },
            { name: "Ocean Pearl", capacity: 200, status: "available", registrationNumber: "IND-KER-002" },
            { name: "Coastal Express", capacity: 120, status: "available", registrationNumber: "IND-GOA-003" },
            { name: "Blue Wave", capacity: 80, status: "maintenance", registrationNumber: "IND-MAH-004" },
            { name: "River Queen", capacity: 50, status: "available", registrationNumber: "IND-WB-005" },
            { name: "Island Star", capacity: 150, status: "available", registrationNumber: "IND-TN-006" },
            { name: "Marine Voyager", capacity: 200, status: "available", registrationNumber: "IND-GUJ-007" },
            { name: "Sunrise Ferry", capacity: 120, status: "out_of_service", registrationNumber: "IND-AP-008" }
        ];
        const ferries = await Ferry.insertMany(ferriesData);


        // ==========================================
        // 3. ROUTES
        // ==========================================
        console.log("Creating Routes...");
        const routesData = [
            { name: "Mumbai Heritage Route", origin: "Gateway of India", destination: "Elephanta Island", distance: 10, estimatedDuration: 60, status: "active" },
            { name: "Kochi Commuter", origin: "Kochi Harbour", destination: "Vypin Island", distance: 5, estimatedDuration: 20, status: "active" },
            { name: "Goa Coastal", origin: "Goa Jetty", destination: "Panaji", distance: 15, estimatedDuration: 45, status: "active" },
            { name: "Mandwa Express", origin: "Mumbai Harbour", destination: "Mandwa", distance: 20, estimatedDuration: 90, status: "active" },
            { name: "Chennai Link", origin: "Chennai Marina", destination: "Island Point", distance: 12, estimatedDuration: 50, status: "active" },
            { name: "Kolkata River Run", origin: "Kolkata River", destination: "Garden Reach", distance: 8, estimatedDuration: 30, status: "active" }
        ];
        const routes = await Route.insertMany(routesData);


        // ==========================================
        // 4. SCHEDULES
        // ==========================================
        console.log("Creating Schedules...");

        // Base Date: 02 August 2026
        const baseDate = new Date("2026-08-02T00:00:00Z");

        const timings = [
            { hour: 8, minute: 0 },   // 08:00 AM
            { hour: 10, minute: 30 }, // 10:30 AM
            { hour: 14, minute: 0 },  // 02:00 PM
            { hour: 16, minute: 30 }, // 04:30 PM
            { hour: 18, minute: 0 }   // 06:00 PM
        ];

        const schedules = [];

        // Generate for today, tomorrow, and next 7 days
        for (let dayOffset = 0; dayOffset <= 8; dayOffset++) {
            const currentDate = new Date(baseDate);
            currentDate.setDate(currentDate.getDate() + dayOffset);

            // Assign a couple of routes per day
            for (let routeIdx = 0; routeIdx < routes.length; routeIdx++) {
                const route = routes[routeIdx];
                const ferry = ferries[routeIdx % ferries.length]; // cycle through ferries

                // Skip inactive ferries
                if (ferry.status !== "available") continue;

                for (let time of timings) {
                    const departureTime = new Date(currentDate);
                    departureTime.setUTCHours(time.hour, time.minute, 0, 0);

                    const arrivalTime = new Date(departureTime);
                    arrivalTime.setUTCMinutes(arrivalTime.getUTCMinutes() + route.estimatedDuration);

                    let status = "scheduled";
                    // For today, let's make some early ones departed/completed
                    if (dayOffset === 0 && time.hour < 12) status = "completed";
                    else if (dayOffset === 0 && time.hour === 14) status = "boarding";

                    // Cancel a random few
                    if (Math.random() < 0.05) status = "cancelled";

                    schedules.push({
                        ferry: ferry._id,
                        route: route._id,
                        departureTime,
                        arrivalTime,
                        fare: Math.floor(Math.random() * (500 - 100 + 1) + 100), // Random fare between 100 and 500
                        availableSeats: ferry.capacity,
                        bookedSeats: [],
                        status: status
                    });
                }
            }
        }
        const createdSchedules = await Schedule.insertMany(schedules);


        // ==========================================
        // 5. BOOKINGS
        // ==========================================
        console.log("Creating Bookings...");
        const bookings = [];
        let ticketCounter = 1;

        for (let i = 0; i < 50; i++) {
            // Pick random user and random future schedule
            const user = passengerUsers[Math.floor(Math.random() * passengerUsers.length)];
            const schedule = createdSchedules[Math.floor(Math.random() * createdSchedules.length)];

            const seatsBooked = Math.floor(Math.random() * 3) + 1; // 1 to 3 seats
            const seatNumbers = Array.from({ length: seatsBooked }, (_, i) => `S${Math.floor(Math.random() * 100) + 1}`);

            bookings.push({
                user: user._id,
                schedule: schedule._id,
                passengerDetails: [
                    {
                        name: user.name,
                        age: Math.floor(Math.random() * 40) + 18,
                        gender: Math.random() > 0.5 ? "male" : "female",
                        phone: "9876543210",
                        email: user.email
                    }
                ],
                seatsBooked,
                seatNumbers,
                totalAmount: schedule.fare * seatsBooked,
                bookingStatus: Math.random() > 0.2 ? "confirmed" : "pending_payment",
                paymentStatus: Math.random() > 0.2 ? "paid" : "pending",
                ticketId: `FF20260802${ticketCounter.toString().padStart(3, '0')}`
            });
            ticketCounter++;
        }
        await Booking.insertMany(bookings);


        // ==========================================
        // 6. ALERTS
        // ==========================================
        console.log("Creating Alerts...");
        const alertsData = [
            { title: "Ferry Delayed Due To Weather", message: "The evening ferry service is delayed by 20 minutes due to heavy rainfall.", type: "weather", priority: "high", status: "active", createdBy: admin._id },
            { title: "Maintenance Schedule", message: "Blue Wave is under scheduled maintenance today.", type: "maintenance", priority: "medium", status: "active", createdBy: staffUsers[0]._id },
            { title: "New Extra Service", message: "Additional ferry added to Goa Coastal route due to high demand.", type: "info", priority: "low", status: "active", createdBy: admin._id },
            { title: "Safety Announcement", message: "Please ensure you wear life jackets during the monsoon season.", type: "warning", priority: "high", status: "active", createdBy: staffUsers[1]._id },
            { title: "Route Update", message: "Mandwa Express will operate from Gate 2 today.", type: "info", priority: "low", status: "active", createdBy: staffUsers[2]._id },
            { title: "Boarding Information", message: "Boarding for Kochi Commuter starts 15 mins prior to departure.", type: "info", priority: "low", status: "active", createdBy: staffUsers[3]._id },
            { title: "Service Cancellation", message: "Sunrise Ferry is out of service for the week.", type: "cancellation", priority: "critical", status: "active", createdBy: admin._id },
            { title: "Heavy Traffic at Terminal", message: "Expect delays at Mumbai Harbour due to tourist rush.", type: "delay", priority: "medium", status: "active", createdBy: staffUsers[0]._id },
            { title: "Lost & Found", message: "A black wallet was found on Ocean Pearl. Contact staff desk.", type: "info", priority: "low", status: "active", createdBy: staffUsers[4]._id },
            { title: "Welcome to FerryFlow", message: "Book your tickets online seamlessly with our new app!", type: "info", priority: "low", status: "active", createdBy: admin._id }
        ];
        await Alert.insertMany(alertsData);


        // ==========================================
        // 7. INQUIRIES
        // ==========================================
        console.log("Creating Inquiries...");
        const inquiries = [];
        for (let i = 0; i < 15; i++) {
            inquiries.push({
                name: passengerUsers[i].name,
                email: passengerUsers[i].email,
                subject: i % 2 === 0 ? "Ticket issue" : "Refund Request",
                message: i % 2 === 0 ? "I am unable to download my ticket for tomorrow's trip." : "My payment failed but money was deducted.",
                status: i % 3 === 0 ? "resolved" : "pending"
            });
        }
        await Inquiry.insertMany(inquiries);


        console.log("=========================================");
        console.log("✅ SEED DATA GENERATED SUCCESSFULLY!");
        console.log("=========================================");
        console.log("Total Admins: 1");
        console.log("Total Staff: 5");
        console.log("Total Passengers: 30");
        console.log(`Total Ferries: ${ferries.length}`);
        console.log(`Total Routes: ${routes.length}`);
        console.log(`Total Schedules: ${createdSchedules.length}`);
        console.log(`Total Bookings: ${bookings.length}`);
        console.log(`Total Alerts: ${alertsData.length}`);
        console.log(`Total Inquiries: ${inquiries.length}`);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();

const Booking = require("../src/models/booking.model");
const Schedule = require("../src/models/schedule.model");

const seedBookings = async (users, schedules) => {
    console.log("Seeding Bookings...");

    // Filter citizen and tourist users
    const passengers = users.filter(u => u.role === "citizen" || u.role === "tourist");

    // Bookings data
    const bookingsData = [
        {
            user: passengers[0]._id, // citizen 1
            schedule: schedules[0]._id, // Schedule 1 (Ocean Express - Gateway Link)
            seatsBooked: 2,
            seatNumbers: ["1A", "1B"],
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            totalAmount: 300,
            passengerDetails: [
                { name: "Rahul Sharma", age: 29, gender: "male", phone: "9876543210", email: "citizen1@ferryflow.com" },
                { name: "Sita Sharma", age: 27, gender: "female" }
            ],
            ticketId: "TKT-GW-1011"
        },
        {
            user: passengers[1]._id, // citizen 2
            schedule: schedules[0]._id, // Schedule 1
            seatsBooked: 1,
            seatNumbers: ["2C"],
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            totalAmount: 150,
            passengerDetails: [
                { name: "Priya Patel", age: 25, gender: "female", phone: "9876543211", email: "citizen2@ferryflow.com" }
            ],
            ticketId: "TKT-GW-1012"
        },
        {
            user: passengers[2]._id, // citizen 3
            schedule: schedules[1]._id, // Schedule 2
            seatsBooked: 3,
            seatNumbers: ["1D", "1E", "1F"],
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            totalAmount: 450,
            passengerDetails: [
                { name: "Amit Kumar", age: 34, gender: "male", phone: "9876543212" },
                { name: "Sushma Kumar", age: 32, gender: "female" },
                { name: "Aarav Kumar", age: 5, gender: "male" }
            ],
            ticketId: "TKT-GW-1013"
        },
        {
            user: passengers[3]._id, // tourist 1
            schedule: schedules[2]._id, // Schedule 3 (Sea Breeze - North Passage)
            seatsBooked: 2,
            seatNumbers: ["3A", "3B"],
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            totalAmount: 700,
            passengerDetails: [
                { name: "John Doe", age: 40, gender: "male", phone: "9123456780", email: "tourist1@ferryflow.com" },
                { name: "Jane Doe", age: 38, gender: "female" }
            ],
            ticketId: "TKT-NP-2011"
        },
        {
            user: passengers[4]._id, // tourist 2
            schedule: schedules[3]._id, // Schedule 4 (Island Cruiser - Coastal Shuttle)
            seatsBooked: 1,
            seatNumbers: ["4C"],
            bookingStatus: "pending_payment",
            paymentStatus: "pending",
            totalAmount: 200,
            passengerDetails: [
                { name: "Emma Watson", age: 30, gender: "female", phone: "9123456781", email: "tourist2@ferryflow.com" }
            ],
            ticketId: "TKT-CS-3011"
        },
        {
            user: passengers[0]._id, // citizen 1
            schedule: schedules[4]._id, // Schedule 5 (Sea Breeze - East Bay)
            seatsBooked: 1,
            seatNumbers: ["5A"],
            bookingStatus: "cancelled",
            paymentStatus: "pending",
            totalAmount: 250,
            passengerDetails: [
                { name: "Rahul Sharma", age: 29, gender: "male" }
            ],
            ticketId: "TKT-EB-4011",
            cancellationReason: "Change of plans",
            cancelledAt: new Date()
        }
    ];

    const seededBookings = await Booking.create(bookingsData);

    // Update schedules to record the booked seats and remaining availability
    for (const b of seededBookings) {
        if (b.bookingStatus === "confirmed") {
            await Schedule.findByIdAndUpdate(b.schedule, {
                $push: { bookedSeats: { $each: b.seatNumbers } },
                $inc: { availableSeats: -b.seatsBooked }
            });
        }
    }

    console.log(`Seeded ${seededBookings.length} Bookings successfully.`);
    return seededBookings;
};

module.exports = seedBookings;

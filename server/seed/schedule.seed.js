const Schedule = require("../src/models/schedule.model");

const seedSchedules = async (ferries, routes) => {
    console.log("Seeding Schedules...");

    const schedules = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper to add days to date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Helper to set time on date
    const setTime = (date, hours, minutes) => {
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    };

    // Create schedules for next 3 days
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
        const currentDate = addDays(today, dayOffset);

        // Schedule 1: Gateway Link (Route 0) using Ocean Express (Ferry 0)
        const dep1 = setTime(currentDate, 8, 0); // 08:00 AM
        const arr1 = setTime(currentDate, 8, 30); // 08:30 AM
        schedules.push({
            ferry: ferries[0]._id,
            route: routes[0]._id,
            departureTime: dep1,
            arrivalTime: arr1,
            fare: 150,
            availableSeats: ferries[0].capacity,
            status: "scheduled"
        });

        // Schedule 2: Gateway Link (Route 0) using Ocean Express (Ferry 0) - Return trip
        const dep2 = setTime(currentDate, 10, 30); // 10:30 AM
        const arr2 = setTime(currentDate, 11, 0); // 11:00 AM
        schedules.push({
            ferry: ferries[0]._id,
            route: routes[0]._id,
            departureTime: dep2,
            arrivalTime: arr2,
            fare: 150,
            availableSeats: ferries[0].capacity,
            status: "scheduled"
        });

        // Schedule 3: North Passage (Route 1) using Sea Breeze (Ferry 1)
        const dep3 = setTime(currentDate, 9, 0); // 09:00 AM
        const arr3 = setTime(currentDate, 10, 0); // 10:00 AM
        schedules.push({
            ferry: ferries[1]._id,
            route: routes[1]._id,
            departureTime: dep3,
            arrivalTime: arr3,
            fare: 350,
            availableSeats: ferries[1].capacity,
            status: "scheduled"
        });

        // Schedule 4: Coastal Shuttle (Route 2) using Island Cruiser (Ferry 2)
        const dep4 = setTime(currentDate, 14, 0); // 02:00 PM
        const arr4 = setTime(currentDate, 14, 20); // 02:20 PM
        schedules.push({
            ferry: ferries[2]._id,
            route: routes[2]._id,
            departureTime: dep4,
            arrivalTime: arr4,
            fare: 200,
            availableSeats: ferries[2].capacity,
            status: "scheduled"
        });

        // Schedule 5: East Bay Line (Route 3) using Sea Breeze (Ferry 1)
        const dep5 = setTime(currentDate, 16, 30); // 04:30 PM
        const arr5 = setTime(currentDate, 17, 15); // 05:15 PM
        schedules.push({
            ferry: ferries[1]._id,
            route: routes[3]._id,
            departureTime: dep5,
            arrivalTime: arr5,
            fare: 250,
            availableSeats: ferries[1].capacity,
            status: "scheduled"
        });
    }

    const seededSchedules = await Schedule.create(schedules);
    console.log(`Seeded ${seededSchedules.length} Schedules successfully.`);
    return seededSchedules;
};

module.exports = seedSchedules;

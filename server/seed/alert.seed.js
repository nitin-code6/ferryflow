const Alert = require("../src/models/alert.model");

const seedAlerts = async (users, ferries, routes) => {
    console.log("Seeding Alerts...");

    // Get Admin and Staff users
    const admin = users.find(u => u.role === "admin");
    const staff = users.find(u => u.role === "staff");

    const alerts = [
        {
            title: "Ferry Delay: Ocean Express",
            message: "Ocean Express morning link is delayed by 15 minutes due to heavy harbor fog.",
            type: "delay",
            priority: "medium",
            status: "active",
            ferry: ferries[0]._id,
            route: routes[0]._id,
            createdBy: staff._id
        },
        {
            title: "Scheduled Maintenance: Wave Runner",
            message: "Wave Runner will be out of service for regular drydock maintenance until next Monday.",
            type: "maintenance",
            priority: "low",
            status: "active",
            ferry: ferries[3]._id,
            createdBy: admin._id
        },
        {
            title: "General Service Announcement",
            message: "Special weekend discount fares are now active for all tourist routes! Book now.",
            type: "info",
            priority: "low",
            status: "active",
            createdBy: admin._id
        }
    ];

    const seededAlerts = await Alert.create(alerts);
    console.log(`Seeded ${seededAlerts.length} Alerts successfully.`);
    return seededAlerts;
};

module.exports = seedAlerts;

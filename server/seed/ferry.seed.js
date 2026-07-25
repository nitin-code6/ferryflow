const Ferry = require("../src/models/ferry.model");

const seedFerries = async () => {
    console.log("Seeding Ferries...");

    const ferries = [
        {
            name: "Ocean Express",
            registrationNumber: "FF-OE-001",
            capacity: 200,
            status: "available"
        },
        {
            name: "Sea Breeze",
            registrationNumber: "FF-SB-002",
            capacity: 120,
            status: "available"
        },
        {
            name: "Island Cruiser",
            registrationNumber: "FF-IC-003",
            capacity: 150,
            status: "available"
        },
        {
            name: "Wave Runner",
            registrationNumber: "FF-WR-004",
            capacity: 80,
            status: "maintenance"
        },
        {
            name: "Harbour Queen",
            registrationNumber: "FF-HQ-005",
            capacity: 180,
            status: "out_of_service"
        }
    ];

    // Using Ferry.create triggers the Mongoose pre('save') hook to build seat configurations!
    const seededFerries = [];
    for (const f of ferries) {
        const ferry = new Ferry(f);
        await ferry.save();
        seededFerries.push(ferry);
    }

    console.log(`Seeded ${seededFerries.length} Ferries successfully (seat layout generated).`);
    return seededFerries;
};

module.exports = seedFerries;

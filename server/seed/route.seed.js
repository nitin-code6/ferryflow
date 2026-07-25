const Route = require("../src/models/route.model");

const seedRoutes = async () => {
    console.log("Seeding Routes...");

    const routes = [
        {
            name: "Gateway Link",
            origin: "Gateway Terminal",
            destination: "Island Beach",
            distance: 12,
            estimatedDuration: 30,
            status: "active"
        },
        {
            name: "North Passage",
            origin: "Main Harbour",
            destination: "North Port",
            distance: 25,
            estimatedDuration: 60,
            status: "active"
        },
        {
            name: "Coastal Shuttle",
            origin: "West Marina",
            destination: "Coastal Cove",
            distance: 8,
            estimatedDuration: 20,
            status: "active"
        },
        {
            name: "East Bay Line",
            origin: "Gateway Terminal",
            destination: "East Bay",
            distance: 18,
            estimatedDuration: 45,
            status: "active"
        },
        {
            name: "South Cape Voyage",
            origin: "Main Harbour",
            destination: "South Cape",
            distance: 35,
            estimatedDuration: 90,
            status: "active"
        }
    ];

    const seededRoutes = await Route.create(routes);
    console.log(`Seeded ${seededRoutes.length} Routes successfully.`);
    return seededRoutes;
};

module.exports = seedRoutes;

const User = require("../src/models/user.model");
const bcrypt = require("bcrypt");

const seedUsers = async () => {
    console.log("Seeding Users...");
    
    // Hash default password
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const users = [
        {
            name: "System Administrator",
            email: "admin@ferryflow.com",
            password: hashedPassword,
            role: "admin",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "Ferry Operations Staff",
            email: "staff@ferryflow.com",
            password: hashedPassword,
            role: "staff",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "Rahul Sharma",
            email: "citizen1@ferryflow.com",
            password: hashedPassword,
            role: "citizen",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "Priya Patel",
            email: "citizen2@ferryflow.com",
            password: hashedPassword,
            role: "citizen",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "Amit Kumar",
            email: "citizen3@ferryflow.com",
            password: hashedPassword,
            role: "citizen",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "John Doe",
            email: "tourist1@ferryflow.com",
            password: hashedPassword,
            role: "tourist",
            isVerified: true,
            accountStatus: "active"
        },
        {
            name: "Emma Watson",
            email: "tourist2@ferryflow.com",
            password: hashedPassword,
            role: "tourist",
            isVerified: true,
            accountStatus: "active"
        }
    ];

    const seededUsers = await User.create(users);
    console.log(`Seeded ${seededUsers.length} Users successfully.`);
    return seededUsers;
};

module.exports = seedUsers;

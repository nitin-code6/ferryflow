require('dotenv').config();

const connectDB = require('./config/db.js');
const client = require('./config/redis');
const app = require('./app.js')

const port = process.env.PORT || 8000;

client.connect().then(async () => {
    await client.set("name", "Nitin");

    const value = await client.get("name");
    console.log(value);
}).catch((err) => {
    console.error("Redis connection failed! Server startup aborted.", err);
});
connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error(" Express server error: ", error);
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed! Server startup aborted.", err);
    });

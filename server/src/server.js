require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db.js');
const client = require('./config/redis');
const app = require('./app.js');
const http = require('http');
const { initSocket } = require('./config/socket');


const port = process.env.PORT || 8000;

client.connect().catch((err) => {
    console.error("Redis connection failed! Server startup aborted.", err);
});
console.log("redis Connected");

const server = http.createServer(app);
initSocket(server);

connectDB()
    .then(() => {
        server.on("error", (error) => {
            console.error(" Express server error: ", error);
        });

        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed! Server startup aborted.", err);
    });

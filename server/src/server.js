require('dotenv').config();
console.log(process.env.PORT)

const connectDB = require('./config/db.js');

const app = require('./app.js')

const port = process.env.PORT || 8000;

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

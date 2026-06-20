const { OAuth2Client } = require("google-auth-library");
// console.log(process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(

    process.env.GOOGLE_CLIENT_ID
);

module.exports = client;
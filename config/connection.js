// Establishing connection to the MongoDB database and creating an active connection to that database
const { connect, connection } = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongo://127.0.0.1:27017/socialnetworkDB';

connect(connectionString, {
    // tells Mongoose to use the new URL parser instead of the legacy parser
    useNewUrlParser: true,
    // tells Mongoose to use the new server discovery and monitoring engine instead of the legacy engine
    useUnifiedTopology: true,
});

module.exports = connection;
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let database = null;
let mongo = null; // Store the MongoMemoryServer instance globally

async function startDatabase() {
    mongo = await MongoMemoryServer.create(); // Use create() to start the server
    const mongoDBURL = await mongo.getUri(); // Use getUri() when the server is ready
    const connection = await MongoClient.connect(mongoDBURL, { useNewUrlParser: true });
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

module.exports = {
    getDatabase,
    startDatabase,
};

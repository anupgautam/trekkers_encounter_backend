const mysql = require("mysql2/promise"); // Use promise-based mysql2 for better async handling

const pool = mysql.createPool({
    host: '192.250.229.20',
    user: 'trekker1_trek_encounter',
    password: 'Office@0977',
    database: 'trekker1_encounter',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // 30 seconds timeout
    acquireTimeout: 30000, // 30 seconds to acquire a connection
});

pool.getConnection()
    .then((connection) => {
        console.log("Connected to MySQL database.");
        connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
        console.error("Error connecting to MySQL:", err);
    });

// Handle pool errors globally
pool.on('error', (err) => {
    console.error("Pool error:", err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("Connection lost, attempting to reconnect...");
        // Optionally, reinitialize the pool here if needed
    }
});

module.exports = pool;
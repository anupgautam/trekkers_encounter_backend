const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: '192.250.229.20',  
    user: 'trekker1_trek_encounter',
    password: 'Office@0977',
    database: 'trekker1_encounter',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

module.exports = connection;

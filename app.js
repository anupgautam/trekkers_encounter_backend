var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const router = require('./router/userRouter');
const basic = require('./router/basicRouter');
var cors = require('cors');
const mediaPath = '/media';

const client = require('./utils/db');

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

// Test the pool connection on startup
client.getConnection()
    .then((connection) => {
        console.log("Successfully acquired a connection from the MySQL pool.");
        connection.release(); // Release the connection back to the pool
    })
    .catch((err) => {
        console.error("MySQL DB Connection Error:", err);
    });

// Handle pool errors (e.g., connection lost)
client.on('error', (err) => {
    console.error("Pool error:", err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log("Connection lost, pool will attempt to reconnect...");
    }
});

const port = 8888;

app.use(express.json());
app.use(mediaPath, express.static(path.join(__dirname, 'media')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', router);
app.use('/basic', basic);

app.listen(port, 'localhost', () => {
    console.log(`Server is running on localhost:${port}`);
});
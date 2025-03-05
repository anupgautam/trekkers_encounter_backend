var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const router = require('./router/userRouter');
const basic = require('./router/basicRouter');
var cors = require('cors');
const mediaPath = '/media';

const client = require('./utils/db');

app.use(cors({ origin: '*' }));

client.connect((err) => {
    if (err) {
        console.error("MySQL DB Connection Error:", err);
        return;
    }
    console.log("Connected to MySQL database.");
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

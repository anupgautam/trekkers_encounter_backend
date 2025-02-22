var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
const router = require('./router/userRouter');
const client = require('./utils/db');
const basic = require('./router/basicRouter');
var cors = require('cors');
const mediaPath = '/media';

app.use(cors({ origin: 'http://localhost:3000' }));

// PostgreSQL connection configuration


client
    .connect()
    .then(() => {
        console.log('PostgreSQL DB Connected');
    })
    .catch((error) => {
        console.error('PostgreSQL DB Connection Error:', error);
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

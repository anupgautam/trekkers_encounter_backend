const { Client } = require("pg");



const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'himalayantours',
    password: 'czvxynmch',
    port: 5432,
});

module.exports = client;
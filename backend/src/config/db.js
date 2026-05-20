const mysql = require('mysql2');
const config = require('./config.service');

const pool = mysql.createPool({
    host : config.db.host,
    user : config.db.user,
    password : config.db.password,
    database : config.db.name,

    connectionLimit : 10,
    waitForConnections : true,
    connectTimeout : 10000,
    idleTimeout : 60000
});

pool.getConnection((err, connection) => {
    if(err){
        console.log('DB connection failed', err);
        return;
    }

    console.log(`MYSQL connected`);
    connection.release();
});

module.exports = pool.promise();    
const { cli } = require('winston/lib/winston/config');
const config = require('./src/config/config.service');
const { Connection } = require('mysql2');

module.exports = {
    development : {
        client : 'mysql2',
        connection : {
            host : config.db.host,
            user : config.db.user,
            password : config.db.password,
            database : config.db.name
        },
        migrations : {
            directory : './src/DB/migrations',
            tableName : 'schema_migrations'
        }
    }
}
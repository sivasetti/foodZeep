require('dotenv').config();

const db = require('../src/config/db');

async function setup(){
    try{
        await db.query(`CREATE DATABASE if not exists foodzeep`);
        await db.query(`USE foodzeep`);

        // users table

        await db.query(`CREATE TABLE IF NOT EXISTS Users(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255),
            role VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        
        await console.log(`Tables created successfully`);
        process.exit(0);
    } 
    catch(err){
        console.error(`setup failed`, err.message);
        process.exit(1);
    }
}
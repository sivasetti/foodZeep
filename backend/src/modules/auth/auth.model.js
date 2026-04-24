const db = require('../../config/db');

async function createUser({name, email, password, role}) {
    const query = `INSERT INTO users (name, email, password, role) 
    VALUES (?,?,?,?)`;

    const [result] = await db.query(query, [
        name,
        email,
        password,
        role
    ]);

    return result;    
}

async function getEmailByUser(email) {
    const[rows] = await db.query(`SELECT * FROM users WHERE EMAIL = ?`, [email]);
    return rows[0];
}



async function getAllUsers() {
    const [rows] = await db.query(`SELECT * FROM users`);
    return rows;
}

module.exports = {
    createUser,
    getEmailByUser,
    getAllUsers
}
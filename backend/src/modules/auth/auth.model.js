const db = require('../../config/db');
// const knex = require('knex');
// const knexFile = require('../../../knexfile.js');

// const knexInstance = knex(knexConfig.development);

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

const saveRefreshToken = async (userId, token, expiresAt) => {
    const expires_At = expiresAt.toISOString().slice(0, 19).replace('T', ' ');
    return await db.query(`INSERT INTO refresh_tokens (user_id, token, expires_At) VALUES (?, ?, ?)`,
        [userId, token, expires_At]
    );
};

module.exports = {
    createUser,
    getEmailByUser,
    getAllUsers,
    saveRefreshToken,
    // knexInstance
}
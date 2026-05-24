const bcrypt = require('bcryptjs');
const authModel = require('./auth.model');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const registerUser= async (data) =>{
    const {name, email, password, role} = data;

    // checking existing user
    const existingUser = await authModel.getEmailByUser(email);

    if(existingUser){
        throw new Error(`User already exists`);
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await authModel.createUser({
        name,
        email,
        password : hashedPassword,
        role
    });

    return result;
}



async function getUsers() {
    const result = await authModel.getAllUsers();
    return result;
}



const login = async (data) => {
    const {email, password} = data;

    const user = await authModel.getEmailByUser(email);

    if(!user){
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('Invalid Password');
    }

    //generate token

    const token = jwt.sign({
        id : user.id,
        email : user.email,
        role : user.role
    }, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRY
    });
    //Generate refresh token for 7 days
    const refreshToken = crypto.randomBytes(40).toString('hex');

    //calculate the 7 days deadline date  for MySQL

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const mysqlExpiresAt = expiresAt.toISOString().slice(0,19).replace('T', ' ');


    // save this into refresh_tokens table

    await pool.query(
        `INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES (?, ?, ?)`,
        [user.id, refreshToken, mysqlExpiresAt]
    );


    return {
        token,
        refreshToken,
        expiresAt,
        user : {
            id : user.id,
            email : user.email,
            role : user.role,
            name : user.name
        }
    }
}


module.exports = {registerUser, getUsers, login};
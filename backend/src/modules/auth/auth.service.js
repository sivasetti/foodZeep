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

    await authModel.saveRefreshToken(user.id, refreshToken, expiresAt);

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


const refreshSession = async (oldTokenString) => {
    // 1. Lookup the token in the database
    const session = await authModel.findRefreshTokens(oldTokenString);
    if(!session){
        throw new Error("Invalid Session token, Please login again");
    }
    //2. check if the token has expired past its 7-day lifetime
    if(new Date() > new Date(session.expires_at)){
        await authModel.deleteRefreshToken(session.id);
        throw new Error("Session Expired, Login again");
    }
    //3.Token Rotation : Delete the old token from the table immediately
    await authModel.deleteRefreshToken(session.id);

    //4. Generate a brand new 15-minute Access token
    const newAccessToken = jwt.sign({
        id : session.user_id,
        role : session.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn : '15m'
    }
);

//5.Generate a brand-new 7-day refresh token
const newRefreshToken = crypto.randomBytes(40).toString('hex');
const nextExpiry = new Date();
nextExpiry.setDate(nextExpiry.getDate() + 7);

//6. Save the brand-new refresh token back into the database
await authModel.saveRefreshToken(session.user_id, newRefreshtoken, nextExpiry);

//7. send the refresh tokens back to the controller
return{
    accessToken : newAccessToken,
    refreshToken : newRefreshToken,
    expiresAt : nextExpiry
    };

}


const logoutSession = async (tokenString) => {
    if(!tokenString) return; // if there's no token passed, skip to prevent crashing
    //hand it to the model to erase it from the table ledger
    await authModel.revokeToken(tokenString);
}
module.exports = {registerUser, getUsers, login, refreshSession, logoutSession};
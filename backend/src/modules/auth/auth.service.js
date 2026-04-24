const bcrypt = require('bcryptjs');
const authModel = require('./auth.model');
const jwt = require('jsonwebtoken');

async function registerUser(data) {
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




async function login(data) {
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

    return {
        token,
        user : {
            id : user.id,
            email : user.email,
            role : user.role,
            name : user.name
        }
    }
}


module.exports = {registerUser, getUsers, login};
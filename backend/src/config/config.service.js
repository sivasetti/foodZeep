require('dotenv').config();

const requiredEnvVariables = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
];

const validateEnv = () =>{
    const missingVariables = [];

    for(let variableName of requiredEnvVariables){
        if(!process.env[variableName]){
            missingVariables.push(variableName);
        }
    }

    // if anything is missing, halt the server immediately with a clear report
    if(missingVariables.length > 0){
        console.error('CONFIGURATION ERROR: Missing vital environment variables inside you .env file!');
        console.error(`Please define the following keys immediately: [ ${missingVariables.join(', ')}]`);
        console.error(`server startup aborted to prevent runtime crashes`);
    };
};
// Run the inspection immediately when this file is loaded
validateEnv();

module.exports = {
    port : process.env.PORT || 5000,
    db : {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        name : process.env.DB_NAME
    },
    jwtSecret : process.env.JWT_SECRET
}
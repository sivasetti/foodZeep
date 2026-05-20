const logger = require('../config/logger');

const errorHandler = (err, req, res, next) =>{

    if(err.code === 'ER_DUP_ENTRY'){
        err.statusCode = 400;
        err.message = 'The email address or matching unique credential is already registered'
    }
    else if(err.code === 'ER_NO_REFERENCED_ROW_2'){
        err.statusCode = 400;
        err.message = 'The requested food item or entity does not exist in our system.';
    }
    
    const statusCode = err.statusCode || 500;

    //Structured Context Capture
    logger.error({
        message : err.message,
        statusCode : statusCode, 
        path : req.originalUrl,
        method : req.method,
        ip : req.ip,
        stack : err.stack //Captures the exact line configuration path where code failed
    });

    res.status(statusCode).json({
        success : false,
        message : statusCode === 500 ? 'Internal Server Error' : err.message
    });
}


module.exports = errorHandler;
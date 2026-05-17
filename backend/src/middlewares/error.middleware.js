const logger = require('../config/logger');

const errorHandler = (err, req, res, next) =>{
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
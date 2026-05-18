

const app = require('./src/app');
const db = require('./src/config/db');
const config = require('./src/config/config.service');
const logger = require('./src/config/logger');

const PORT = config.port;

//Capture the server reference when startup
app.listen(PORT, () => {
    logger.info(`Server is running securely on PORT ${PORT}`);
});

// Centralized Shutdown Handler Function
const handleGracefulShutdown = (signal) => {
    logger.warn(`Received ${signal}. Starting production graceful shutdown sequence...`);

    //1. Stop accepting any new incoming HTTP requests
    server.close(async ()=>{
        logger.info('HTTP server stopped accepting new requests');

        try{
            //2. Securely close your db connection pool
            // This ensures active connections drop natively after finishing ongoing queries
            if(db && typeof db.end === 'function'){
                await db.end();
                logger.info('MySQL database pool closed cleany');
            }
            logger.info('Graceful Shutdown complete, Exiting process safely.');
            process.exit(0); //Exit code 0 means clean termination without errors
        }
        catch(error){
            logger.error({
                message : 'Error during database pool cleanup during shutdown',
                error : error.message
            });
            process.exit(1); // Exit code 1 means an unexpected error forced the exit
        }
    });
    
    //Forced Safety timeout: If cleanup takes longer than 10 seconds, force terminate
    //So the deployment engine doesn't hang forever if a connection is stuck open.
    setTimeout(() =>{
        logger.error('Forced Shutdown: cleanup took too long. Forcing exit');
        process.exit(1);
    }, 10000);
}

// Listen for standard termination event signals from the operating system

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
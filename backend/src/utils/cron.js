const cron = require('node-cron');
const pool = require('../config/db');
const configService = require('../config/config.service');

// 1. we schedule a job to run once every single minute(* * * * *)
cron.schedule('* * * * *', async () => {
    const now = new Date().toISOString().slice(0,19).replace('T', ' ');
    console.log(`[CRON WORKER] Running database janitor sweep at : ${now}`);

    try{
    // 2. Run a raw DELETE query to cleanly drop any food item that past its expiry
    const [result] = await pool.query(
        `DELETE FROM food_items WHERE expiry_time < NOW()`
    );
    
    if(result.affectedRows > 0){
        console.log(`[CRON WORKER] Success : Removed ${result.affectedRows} expired food items`);
            }
    }    
    catch(error){
        console.error(`[CRON WORKER] Database sweep failed with error: `, error);
    }   
});

console.log(`[CRON WORKER] Automated background tasks initialized successfully`);
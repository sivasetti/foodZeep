const db = require('../config/db');

const runInTransaction = async (workFn) => {
    const connection = await db.getConnection();

    try{
        await connection.beginTransaction();

        const result = await workFn(connection);

        await connection.commit();
        return result;
    }
    catch(error){
        await connection.rollback();
        throw error;
    }
    finally{
        connection.release();
    }
};

module.exports = {
    runInTransaction
};
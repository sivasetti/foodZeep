const db = require('../../config/db');


createFood = async (data) => {
    const {
        seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg,
        image_url
    } = data;

    const [result] = await db.query(`INSERT INTO food_items(
        seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg,
        image_url) VALUES (?,?,?,?,?,?,?)`,[seller_id, name, quantity, price, expiry_time, veg, image_url]);


    return result;
}


getFood = async (user, filters) => {
        const {search, veg, price, sort = 'id', order = 'ASC', page, limit} = filters;
        const offset = (page - 1) * limit;

        let filterSql = ` FROM food_items WHERE 1=1`;
        const queryParams = [];

        if(user.role.toLowerCase() === 'seller'){
            filterSql += ` AND seller_id = ?`;
            queryParams.push(user.id);
        }

        if(search){
            filterSql += ` AND name LIKE ?`;
            const sanitizedSearch = search.trim();
            queryParams.push(`${sanitizedSearch}`);
        }

        if( veg != undefined){
            filterSql += ` AND veg = ?`;
            queryParams.push(veg === 'true' ? 1 : 0);
        }

        const [countResult] = await db.query(`SELECT COUNT(*) AS total` + filterSql, queryParams);
        const total = countResult[0].total;

        let dataSql = `SELECT *` + filterSql + ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
        const [result] = await db.query(dataSql, [...queryParams, parseInt(limit), offset]);

        return {
            data : result,
            pagination : {
                total,
                page : parseInt(page),
                limit : parseInt(limit),
                totalPages : Math.ceil(total/limit)
            }
        };        
};


getFoodById = async (id) =>{
    const [result] = await db.query(`SELECT * FROM food_items WHERE id = ?`, [id]);
    return result[0];
};


updateFood = async (id, user, data) => {
    const {name, quantity, price, expiry_time, veg} = data;

    let query;
    let values;
    

    if(user.role.toLowerCase() === 'admin'){
        query = `UPDATE food_items 
                SET name = ?, quantity = ?, price = ?, expiry_time = ?, veg = ? 
                WHERE id = ?`; 
                values = [name, quantity, price, expiry_time, veg, id];
    }
    else{
        query = `UPDATE food_items 
                SET name = ?, quantity = ?, price = ?, expiry_time = ?, veg = ? 
                WHERE id = ? AND seller_id = ?`;
                values = [name, quantity, price, expiry_time, veg, id, user.id];
    }

    const [result] = await db.query(query, values);

    return result;
}


removeFoodModel = async (id, user) => {
    let query;
    let values;

    if (user.role.toLowerCase() === 'admin'){
        query = `DELETE FROM food_items WHERE id = ?`; 
        values = [id];
    }
    else{
        query = `DELETE FROM food_items WHERE id = ?  AND seller_id = ?`; 
        values = [id, user.id]
    }
    const [result] = await db.query(query, values);

    return result;
}




module.exports = {
    createFood, 
    getFood, 
    getFoodById,
    updateFood, 
    removeFoodModel
    
};
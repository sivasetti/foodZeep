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


getFood = async (user, query) => {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        let offset = (page - 1) * limit;
        let search = query.search || '';
        let veg = query.veg;
        let sort = query.sort;
        let order = query.order || 'ASC'; 


        // sorting

        let allowedSortFields = ['price', 'expiry_time', 'name', 'id'];

        if(!allowedSortFields.includes(sort)){
            sort = 'expiry_time'
        }
        if(order !== 'ASC' && order !== 'DESC'){
            order = 'ASC'
        }

        // count query

        let countSql = `SELECT COUNT(*) AS total FROM food_items
                            WHERE seller_id = ?
                            AND name LIKE ?`

        let countValues = [user.id, `%${search}%`];

        if(veg !== undefined){
            countSql += ` AND veg = ?`;
            countValues.push(veg === 'true' ? 1 : 0);
        }

        const [countResult] = await db.query(countSql, countValues);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total/limit);


        // Data Query

        let sql = `SELECT * FROM food_items
                    WHERE seller_id = ? 
                    AND name LIKE ? `;
        
        let values = [user.id, `%${search}%`];
        if(veg !== undefined){
            sql += ` AND veg = ?`;
            values.push(veg === 'true' ? 1 : 0)
        }

        sql += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
        values.push(limit, offset);


        const [result] = await db.query(sql, values);
        return {
            data : result,
            page,
            limit,
            total,
            totalPages
        };  
}


getFoodById = async (id) =>{
    const [rows] = await db.query(`SELECT * FROM food_items WHERE id = ?`, [id]);
    return rows[0];
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
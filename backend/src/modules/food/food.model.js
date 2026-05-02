const db = require('../../config/db');


createFood = async (data) => {
    const {
        seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg
    } = data;

    const [result] = await db.query(`INSERT INTO food_items(seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg) VALUES (?,?,?,?,?,?)`,[seller_id, name, quantity, price, expiry_time, veg]);


    return result;
}


getFood = async (user, query) => {
        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 10;
        let offset = (page - 1) * limit;
        let search = query.search || '';
        let veg = query.veg;

        let sql = `SELECT * FROM food_items
                    WHERE seller_id = ? 
                    AND name LIKE ? `;
        
        let values = [user.id, `%${search}%`];
        if(veg !== undefined){
            sql += `AND veg = ?`;
            values.push(veg === 'true' ? 1 : 0)
        }

        sql += `ORDER BY expiry_time ASC LIMIT ? OFFSET ?`;
        values.push(limit, offset);


        const [result] = await db.query(sql, values);
        return result;
    
}


updateFood = async (id, user, data) => {
    const {name, quantity, price, expiry_time, veg} = data;

    let query;
    let values;
    

    if(user.role === 'Admin'){
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

    if (user.role === 'Admin'){
        query = `DELETE FROM food_items WHERE id = ?`; values = [id]
    }
    else{
        query = `DELETE FROM food_items WHERE id = ?  AND seller_id = ?`; values = [id, user.id]
    }
    const [result] = await db.query(query, values);

    return result;
}




module.exports = {createFood, getFood, updateFood, removeFoodModel};
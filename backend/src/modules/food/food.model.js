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


getFood = async (user) => {

        const [result] = await db.query(`SELECT * from food_items where seller_id = ?`,[user.id]);
        return [result];
    
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




module.exports = {createFood, getFood, updateFood};
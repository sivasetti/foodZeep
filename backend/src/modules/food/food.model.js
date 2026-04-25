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


module.exports = {createFood, getFood};
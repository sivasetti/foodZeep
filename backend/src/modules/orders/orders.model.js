const db = require('../../config/db');

const createOrder = async (user_id, total_amount) => {
    const [result] = await db.query(`INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`, [user_id, total_amount]);

    return result.insertId;
}

const createOrderItem = async (order_id, items) => {
    const [result] = await db.query(`INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?,?,?,?)`, 
        [
            order_id,
            item.food_id,
            item.quantity,
            item.price
        ]);

    return result;
}


module.exports = {
    createOrder,
    createOrderItem
}
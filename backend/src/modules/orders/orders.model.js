const db = require('../../config/db');

const createOrder = async (user_id, total_amount) => {
    const [result] = await db.query(`INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`, [user_id, total_amount]);

    return result.insertId;
}

const createOrderItem = async (order_id, item) => {
    const [result] = await db.query(`INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?,?,?,?)`, 
        [
            order_id,
            item.food_id,
            item.quantity,
            item.price
        ]);

    return result;
}



const getOrdersByUserId = async (userId) => {
    const query = `SELECT 
            o.id AS order_id,
            o.total_amount,
            o.status,
            o.created_at,
            oi.quantity,
            oi.price AS price_at_purchase,
            f.name AS food_name
             FROM ORDERS o
            JOIN order_items oi 
            ON o.id = oi.order_id
            JOIN food_items f
            ON oi.food_id = f.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC;`
    const [result] = await db.query(query, [userId]);
    return result;
}

// this is a temporary comment


const removeOrders = async (id) => {
    
}

const removeOrderItem = async (id) => {
    
}


module.exports = {
    createOrder,
    createOrderItem,
    getOrdersByUserId
}
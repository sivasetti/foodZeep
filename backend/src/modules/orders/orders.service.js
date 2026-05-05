const orderModel = require('../orders/orders.model.js');

const placeOrder = async (userId, orderData) => {
    const {items, total_amount} = orderData;

    const orderId = await orderModel.createOrder(userId, total_amount);

    for (let item of items){
        await orderModel.createOrderItem(orderId, item);
    }

    return {
        orderId,
        message : "Order placed and items recorded successfully"
    }
}

const getOrder = async (userId) => {
    const result = await orderModel.getOrdersByUserId(userId);
    const ordersMap = {};

    result.forEach(row =>{
        if(!ordersMap[row.order_id]){
            ordersMap[row.order_id] ={
                order_id : row.order_id,
                total_amount : row.total_amount,
                status : row.status,
                date : row.created_at,
                items : []
            };
        }
        ordersMap[row.order_id].items.push({
            name : row.food_name,
            quantity : row.quantity,
            price : row.price_at_purchase
        });
    });

    return Object.values(ordersMap);
}



module.exports = {
    placeOrder,
    getOrder
}
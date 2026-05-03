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


module.exports = {
    placeOrder
}
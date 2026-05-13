const orderModel = require('../orders/orders.model.js');


const changeStatus = async (userId, sellerId, status) => {
    const validStatuses = ['PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    const normalizedStatus = status.toUpperCase();

    if(!validStatuses.includes(normalizedStatus)){
        const error = new Error("Invalid Stauses, Please use : " + validStatuses.join(', '));
        error.status = 400;
        throw error;
    }

    const result = await orderModel.updateOrderStatus(orderId, sellerId, normalizedStatus);

    if(result.affectedRows === 0){
        const error = new Error("Order not found or you are not authorized to update it");
        error.status = 403 // forbidden
        throw error;
    }

    return {
        message : `Order ${orderId} is now ${normalizedStatus}`
    }

}

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


const removeOrders = async (userId) => {
    try{

    }
    catch(error){
        
    }
}



module.exports = {
    changeStatus,
    placeOrder,
    getOrder
}
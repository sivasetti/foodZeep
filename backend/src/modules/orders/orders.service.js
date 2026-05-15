const orderModel = require('../orders/orders.model.js');
const {runInTransaction} = require('../../utils/transaction.js');


const changeStatus = async (orderId, sellerId, status) => {
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
    try{
    return await runInTransaction(async (connection) => {
        const orderId = await orderModel.createOrder(userId, total_amount, connection);

        for(item of items){
            await orderModel.createOrderItem(orderId, item, connection);
        }

        return {
            orderId,
            message : `Order placed successfully without polluting service layer architecture`
            };
        });
    }
    catch(error){
        await connection.rollback();

        throw error;
    }
    finally{
        connection.release();
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
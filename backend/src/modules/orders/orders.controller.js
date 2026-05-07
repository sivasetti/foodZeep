const orderService = require('../orders/orders.service');

const addOrder = async (req, res, next) => {
    try{
        const userId = req.user.id;

        const result = await orderService.placeOrder(userId, req.body);

        return res.status(201).json({
            success : true,
            message : "Order placed successfully",
            data : result
        });
    }
    catch(error){
        next(error);
    }
}


const getOrder = async (req, res, next) => {
    try{
        const userId = req.user.id;

        const result = await orderService.getOrder(userId);

        return res.status(200).json({
            success : true,
            message : "Orders fetched successfully",
            data : result
        });
    }
    catch(error){
        next(error);
    }
}


const removeOrder = async (req, res, next) => {
    
}
module.exports = {
    addOrder,
    getOrder
}
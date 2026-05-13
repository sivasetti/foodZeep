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

const updateStatus = async (req, res, next) => {
    try{
        const {id} = req.params;
        const { status } = req.body;
        if(!status || typeof status != 'string'){
            const error = new Error("Status is required and must be a string text");
            error.status = 400;
            throw error;
        }
        
        const sellerId = req.user.id;

        const result = await orderService.changeStatus(id, sellerId, status);

        return res.status(200).json({
            success : true,
            message : result.message
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
    getOrder,
    updateStatus
}
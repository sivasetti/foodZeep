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

module.exports = {
    addOrder
}
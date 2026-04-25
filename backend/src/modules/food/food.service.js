const foodModel = require('./food.model');


 addFoodItem = async (data, user) => {
    const {name, quantity, price, expiry_time, veg } = data;
    const seller_id = user.id;
    
    const result = await foodModel.createFood({
        seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg    
    });

    return result;
    
}

getFood = async (user) => {
    const [result] = await foodModel.getFood(user);
    return result;
}


updateFoodService = async (id, user, data) => {
    const result = await foodModel.updateFood(id, user, data);
    return result;
}

module.exports = {
    addFoodItem,
    getFood,
    updateFoodService
}
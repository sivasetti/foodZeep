const foodModel = require('./food.model');
const fs = require('fs');
const path = require('path');


 addFoodItem = async (data, user) => {
    const {name, quantity, price, expiry_time, veg, image_url } = data;
    const seller_id = user.id;
    
    const result = await foodModel.createFood({
        seller_id,
        name,
        quantity,
        price,
        expiry_time,
        veg,
        image_url
    });

    return result;
    
}

const getFood = async (user, query) => {
    const filters = {
        search : query.search || '',
        veg : query.veg,
        price : query.price ? parseFloat(query.price) : null,
        sort : query.sort || 'id',
        order : query.order || 'ASC',
        page : parseInt(query.page) || 1,
        limit : parseInt(query.limit) || 10
    }

    const result = await foodModel.getFood(user, filters);
    return result;
}


updateFoodService = async (id, user, data) => {
    const result = await foodModel.updateFood(id, user, data);
    return result;
}

removeFoodService = async (id, user) => {
    const food = await foodModel.getFoodById(id);
    if(!food){
        throw new Error('Food not found');
    }
    const result = await foodModel.removeFoodModel(id, user);

    if(result.affectedRows>0 && food.image_url){
        const filePath = path.join(process.cwd(), food.image_url);
            if(fs.existsSync(filePath)){
                fs.unlink(filePath, (err) =>{
                    if (err) console.error("Failed to delete image file:", err);
                });
        }
    }
    return result;
}

module.exports = {
    addFoodItem,
    getFood,
    updateFoodService,
    removeFoodService
}
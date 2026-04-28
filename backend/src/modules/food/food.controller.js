const foodService = require('./food.service');

 addFood = async (req, res) => {
    try{
        const result = await foodService.addFoodItem(
            req.body,
            req.user
        )

        return res.status(200).json({
            message : `Food item added successfully`,
            data : result
        });
    }
    catch(error){
        next(error);
    }
}


getFood = async (req, res) => {
    try{
        const result = await foodService.getFood(
            req.user
        )

        return res.status(200).json({
            message : `food items fetched`,
            data : result
        });
    }
    catch(error){
        next(error);
    }
}



updateFoodController = async (req, res) => {
    try{
        const result = await foodService.updateFoodService(req.params.id, req.user, req.body);
        
        return res.status(200).json({
            success : true,
            message : "Food Updated Successfully",
            data : result
        });
    }
    catch(error){
        next(error);
    }
}

removeFoodController = async (req, res) => {
    try{
        const result = await foodService.removeFoodService(req.params.id, req.user);
        if(result.affectedRows === 0){
            return res.status(404).json({
                success : false,
                message : `No food items with this id`
            });
        }

        return res.status(200).json({
            success : true,
            message : `Food with Id: ${req.params.id} deleted successfully by ${req.user.id}`,
            data : result
        })
    }
    catch(error){
        next(error);
    }
};

module.exports = {
    addFood, 
    getFood, 
    updateFoodController, 
    removeFoodController
};
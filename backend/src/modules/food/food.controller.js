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
        return res.status(400).json({
            nessage :  `Unable to add food item`,
            error : error.message
        });
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
        return res.status(500).json({
            message : `unable to fetch food`,
            error : error.message
        });
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
        return res.status(403).json({
            message : 'unable to update food',
            error : error.message
        });
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
        res.status(403).json({
            success : false,
            message : `Unable to remove food`,
            error : error.message
        });
    }
}

module.exports = {addFood, getFood, updateFoodController, removeFoodController};
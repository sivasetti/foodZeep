const foodService = require('./food.service');

 addFood = async (req, res) => {
    try{
        const result = await foodService.addFoodItem(
            req.body,
            req.user
        )

        res.status(200).json({
            messsage : `Food item added successfully`,
            data : result
        });
    }
    catch(error){
        res.status(400).json({
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

        res.status(200).json({
            message : `food items fetched`,
            data : result
        });
    }
    catch(error){
        res.status(500).json({
            message : `unable to fetch food`,
            error : error.message
        });
    }
}

module.exports = {addFood, getFood};
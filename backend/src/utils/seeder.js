const db = require('../config/db');


// 1. create an array of realistic mock food items

const mockFoodItems = [
    {
        seller_id : 1,
        name : 'Margherita Pizza',
        quantity : 50,
        veg : 1,
        image_url : ''
    }
];

const seedDataBase = async () =>{
    try{
        console.log(`Starting database seeding`);

        for(let food of mockFoodItems){
            const query = `INSERT INTO food_items (name, price, description, )`
        }
    }
    catch(error){

    }
}
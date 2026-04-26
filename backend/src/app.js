const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());


const authRoutes = require('./modules/auth/auth.routes');
const foodRoutes = require('./modules/food/food.routes');




app.use('/auth', authRoutes);
app.use('/food', foodRoutes);




app.get('/', (req, res) => {
    res.json({message : `FoodZeep API is running!`});
});

module.exports = app;

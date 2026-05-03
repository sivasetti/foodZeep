const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middlewares/error.middleware')

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);



const authRoutes = require('./modules/auth/auth.routes');
const foodRoutes = require('./modules/food/food.routes');
const orderRoutes = require('./modules/orders/orders.routes');


app.use('/auth', authRoutes);
app.use('/food', foodRoutes);
app.use('/orders', orderRoutes);
app.use(errorHandler);



app.get('/', (req, res) => {
    res.json({message : `FoodZeep API is running!`});
});

console.log(typeof errorHandler)
module.exports = app;

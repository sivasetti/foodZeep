const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../src/config/swagger');
const errorHandler = require('../src/middlewares/error.middleware')

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);



const authRoutes = require('./modules/auth/auth.routes');
const foodRoutes = require('./modules/food/food.routes');


app.use('/auth', authRoutes);
app.use('/food', foodRoutes);
app.use(errorHandler);



app.get('/', (req, res) => {
    res.json({message : `FoodZeep API is running!`});
});

module.exports = app;

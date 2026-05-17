const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const morgan = require('morgan');
const logger = require('./config/logger');
const errorHandler = require('./middlewares/error.middleware')

const app = express();

app.use(morgan('combined', {
    stream : { write : (message) =>  logger.info(message.trim()) }
}));

app.use(helmet());

const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 100,
    message : {
        success : false,
        message : `Too many requests, Please try again in 15 minutes.`
    },
    standardHeaders : true,
    legacyHeaders : false
});
app.use(express.json({limit : '10kb'}));

app.use(cors());
app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use('/api', apiLimiter);

app.use('/uploads', express.static('uploads'));



const authRoutes = require('./modules/auth/auth.routes');
const foodRoutes = require('./modules/food/food.routes');
const orderRoutes = require('./modules/orders/orders.routes');


app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);



app.get('/', (req, res) => {
    res.json({message : `FoodZeep API is running!`});
});

// console.log(typeof errorHandler)
module.exports = app;

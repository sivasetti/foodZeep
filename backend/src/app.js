const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
require('dotenv').config();

const app = express();



app.use(express.json());
app.use('/auth', authRoutes);





app.get('/', (req, res) => {
    res.json({message : `FoodZeep API is running!`});
});

module.exports = app;

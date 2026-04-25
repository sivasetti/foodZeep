const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth.middleware');
const foodController = require('./food.controller');

router.post('/add',authMiddleware.protect, authMiddleware.authorize('Admin', 'seller'), foodController.addFood);
router.get('/my-food', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.getFood);
router.put('/update/:id', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.updateFoodController);

module.exports = router;
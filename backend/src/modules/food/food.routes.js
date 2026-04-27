const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth.middleware');
const foodController = require('./food.controller');

/**
 * @swagger
 * /food/add:
 *   post:
 *     summary: Add food item
 *     description: Seller adds a new food item
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chicken Biryani
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               price:
 *                 type: number
 *                 example: 150
 *               expiry_time:
 *                 type: string
 *                 example: 2026-04-28 12:00:00
 *               veg:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Food item added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.post('/add',authMiddleware.protect, authMiddleware.authorize('Admin', 'seller'), foodController.addFood);

/**
 * @swagger
 * /food/my-food:
 *   get:
 *     summary: Get seller food items
 *     description: Fetch all food items created by the logged-in seller
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Food items fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
router.get('/my-food', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.getFood);

/**
 * @swagger
 * /food/update/{id}:
 *   put:
 *     summary: Update food item
 *     description: Update an existing food item by ID
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Special Chicken Biryani
 *               quantity:
 *                 type: integer
 *                 example: 15
 *               price:
 *                 type: number
 *                 example: 200
 *               expiry_time:
 *                 type: string
 *                 example: 2026-04-30 12:00:00
 *               veg:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Food updated successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.put('/update/:id', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.updateFoodController);

/**
 * @swagger
 * /food/delete/{id}:
 *   delete:
 *     summary: Delete food item
 *     description: Delete a food item by ID
 *     tags:
 *       - Food
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Food item ID
 *     responses:
 *       200:
 *         description: Food deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Food not found
 *       500:
 *         description: Server Error
 */
router.delete('/delete/:id', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.removeFoodController);

module.exports = router;
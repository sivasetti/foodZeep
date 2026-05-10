const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {addFoodSchema, updateFoodSchema} = require('../../validators/food.validator');
const foodController = require('./food.controller');

/**
 * @swagger
 * /food/add:
 *   post:
 *     summary: Add food item with image
 *     description: Seller adds a new food item including an image file.
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *                 example: "2026-04-28 12:00:00"
 *               veg:
 *                 type: boolean
 *                 example: false
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The food image file to upload (jpg, png, webp)
 *     responses:
 *       201:
 *         description: Food item added successfully
 */
router.post('/add',
  validate(addFoodSchema),
   authMiddleware.protect,
   authMiddleware.authorize('Admin', 'seller'), 
   upload.single('image'),
   foodController.addFood
  );

/**
 * @swagger
 * /food/my-food:
 *   get:
 *     summary: Fetch food items with advanced filtering
 *     description: Returns a paginated list of food items. Sellers see their own items; Admins/Buyers see all.
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by food name
 *       - in: query
 *         name: veg
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by veg/non-veg
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, expiry_time, name, id]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Successful response with data and pagination metadata
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 data: [{ "id": 1, "name": "Biryani", "price": 250 }]
 *                 pagination: { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
 */
router.get(
  '/my-food',
  authMiddleware.protect,
  authMiddleware.authorize('seller', 'Admin'),
  foodController.getFood
);


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
router.put('/update/:id', validate(updateFoodSchema), authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.updateFoodController);
/**
 * @swagger
 * /food/delete/{id}:
 *   delete:
 *     summary: Delete food item
 *     description: Removes a food item from the database and deletes its image file from the server.
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the food item to delete
 *     responses:
 *       200:
 *         description: Food and associated image deleted successfully
 *       404:
 *         description: Food item not found
 */
router.delete('/delete/:id', authMiddleware.protect, authMiddleware.authorize('seller', 'Admin'), foodController.removeFoodController);

module.exports = router;
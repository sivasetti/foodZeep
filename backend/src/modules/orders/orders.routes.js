 const express = require('express');
 const router = express.Router();

 const orderController = require('./orders.controller');
 const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { checkOutSchema } = require('../../validators/orders.validator');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_amount:
 *                 type: number
 *                 example: 350.00
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     food_id:
 *                       type: integer
 *                       example: 5
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 350.00
 *     responses:
 *       201:
 *         description: Order created inside secure transaction block successfully.
 */

 router.post(
    '/checkout',
    authMiddleware.protect,
    authMiddleware.authorize('buyer', 'Admin'),
    validate(checkOutSchema),
    orderController.addOrder
 );

/**
 * @swagger
 * /orders/my-orders:
 *   get:
 *     summary: Get logged-in user's order history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders with nested items
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: [
 *                 {
 *                   "order_id": 1,
 *                   "total_amount": 500.00,
 *                   "status": "pending",
 *                   "items": [
 *                     { "name": "Biryani", "quantity": 2, "price": 250.00 }
 *                   ]
 *                 }
 *               ]
 */
 router.get('/my-orders',
      authMiddleware.protect,
      authMiddleware.authorize('buyer', 'Admin'),
      validate(checkOutSchema),
      orderController.getOrder
 );

/**
 * @swagger
 * /orders/status/{id}:
 *   patch:
 *     summary: Update order status (Sellers Only)
 *     description: Allows a restaurant owner to update the lifecycle of an order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique ID of the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLACED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED]
 *                 example: PREPARING
 *     responses:
 *       200:
 *         description: Status updated successfully.
 *       403:
 *         description: Not authorized (Seller doesn't own this order).
 *       400:
 *         description: Invalid status provided.
 */
 router.patch(
   '/status/:id',
   authMiddleware.protect,
   authMiddleware.authorize('seller', 'Admin'),
   orderController.updateStatus
 );


 module.exports = router;
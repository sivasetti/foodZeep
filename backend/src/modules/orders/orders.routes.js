 const express = require('express');
 const router = express.Router();

 const orderController = require('./orders.controller');
 const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { checkOutSchema } = require('../../validators/orders.validator');


/**
 * @swagger
 * /orders/checkout:
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
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     food_id: { type: integer }
 *                     quantity: { type: integer }
 *                     price: { type: number }
 */

 router.post(
    '/checkout',
    authMiddleware.protect,
    authMiddleware.authorize('buyer', 'Admin'),
    validate(checkOutSchema),
    orderController.addOrder
 );


 router.get('/fetch',
      authMiddleware.protect,
      authMiddleware.authorize('buyer', 'Admin'),
      validate(checkOutSchema),
      orderController.getOrder
 );

 module.exports = router;
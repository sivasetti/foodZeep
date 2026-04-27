const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const validate = require('../../middlewares/validation.middleware.js')
const {registerSchema, loginSchema}= require('../../validators/auth.validator.js');
const { valid } = require('joi');


router.post('/register',validate(registerSchema), authController.register);

router.get('/getAllUsers',authMiddleware.protect, authMiddleware.authorize('Admin'), authController.getUsersAll);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login user and generate JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post('/login',validate(loginSchema), authController.login);

module.exports = router;

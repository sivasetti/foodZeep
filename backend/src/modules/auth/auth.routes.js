const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware.js');



router.post('/register', authController.register);

router.get('/getAllUsers',authMiddleware.protect, authMiddleware.authorize('Admin'), authController.getUsersAll);

router.post('/login', authController.login);

module.exports = router;

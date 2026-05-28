const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const validate = require('../../middlewares/validation.middleware.js')
const {registerSchema, loginSchema}= require('../../validators/auth.validator.js');
const { valid } = require('joi');

router.post('/register',validate(registerSchema), authController.register);

router.get('/getAllUsers',authMiddleware.protect, authMiddleware.authorize('Admin'), authController.getUsersAll);


router.post('/login',validate(loginSchema), authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

module.exports = router;

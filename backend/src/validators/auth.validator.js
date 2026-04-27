const Joi = require('joi');

const registerSchema = Joi.object({
    name : Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),
    email : Joi.string()
            .trim()
            .email()
            .required(),
    password : Joi.string()
            .trim()
            .min(6)
            .max(30)
            .required(),
    role : Joi.string()
            .valid('Admin', 'seller', 'buyer')
            .required()
});

const loginSchema = Joi.object({
    email : Joi.string()
            .trim()
            .email()
            .required(),
    password : Joi.string()
            .trim()
            .min(4)
            .max(30)
            .required()
});


module.exports = {
    registerSchema,
    loginSchema
}
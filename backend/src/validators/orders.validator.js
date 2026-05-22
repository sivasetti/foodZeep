const Joi = require('joi');

const checkOutSchema = Joi.object({
    total_amount : Joi.number().precision(2).positive().required()
    .messages({
        'number.base' : 'Total amount must be a number',
        'number.positive' : 'Total amount must be greater than zero',
        'any.required' : 'Total amount is a required field'
    }),
    items : Joi.array().items(
        Joi.object({
            food_id : Joi.number().integer().required(),
            quantity : Joi.number().integer().min(1).required(),
            price : Joi.number().precision(2).positive().required()
        })
    ).min(1).required()
    .messages({
        'array.min' : 'An order must contain at least one food item',
        'any.required' : 'Order items list is required'
    })
});


module.exports = {
    checkOutSchema
}
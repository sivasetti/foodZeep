const Joi = require('joi');

const checkOutSchema = Joi.object({
    total_amount : Joi.number().precision(2).positive().required(),
    items : Joi.array().items(
        Joi.object({
            food_id : Joi.number().integer().required(),
            quantity : Joi.number().integer().min(1).required(),
            price : Joi.number().precision(2).positive().required()
        })
    ).min(1).required()
});


module.exports = {
    checkOutSchema
}
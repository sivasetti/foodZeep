const Joi = require('joi');

const addFoodSchema = Joi.object({
    name : Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),
    quantity : Joi.number()
            .integer()
            .min(1)
            .required(),
    price : Joi.number()
            .integer()
            .min(1)
            .required(),
    expiry_time : Joi.date()
            .greater('now')
            .required(),
    veg : Joi.boolean()
            .required()
});

const updateFoodSchema = Joi.object({
    name : Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required(),
    quantity : Joi.number()
            .integer()
            .min(1)
            .required(),
    price : Joi.number()
            .integer()
            .min(1)
            .required(),
    expiry_time : Joi.date()
            .required(),
    veg : Joi.boolean()
            .required()
})




module.exports =  {
    addFoodSchema,
    updateFoodSchema
};

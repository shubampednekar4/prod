import Joi from "joi";

export const createProductSchema = Joi.object({
    name : Joi.string().trim().required(),
    description : Joi.string().trim().min(20).required(),
    category: Joi.string().valid(
    "Electronics",
    "Clothing",
    "Books"
  ).required(),
    price : Joi.number().positive().required(),
    stockQuantity : Joi.number().integer().min(1).required()

})

export const updateProductSchema = Joi.object({
    name : Joi.string().trim(),
    description : Joi.string().trim().min(20),
    category : Joi.string().trim(),
    price : Joi.number().positive(),
    stockQuantity : Joi.number().integer().min(1)
}).min(1)

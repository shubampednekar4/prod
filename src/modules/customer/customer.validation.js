import Joi from "joi";

export const createCustomerSchema = Joi.object({
    name : Joi.string().trim().required(),
    email : Joi.string().email().required(),
    phone : Joi.string().allow("",null).min(1)
})

export const updateCustomerSchema = Joi.object({
    name : Joi.string().trim(),
    email : Joi.string().trim(),
    phone : Joi.string().allow("",null)
}).min(1)
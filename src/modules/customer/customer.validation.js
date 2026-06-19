import Joi from "joi";

export const createCustomerSchema = Joi.object({
    name : Joi.string().trim().required(),
    email : Joi.string().email().required(),
    phone : Joi.string().allow("",null)
})
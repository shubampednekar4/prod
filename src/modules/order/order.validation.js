import Joi from "joi";

export const createOrderSchema = Joi.object({
    customerId : Joi.number().integer().required(),
    orderDate : Joi.date().greater('now').required(),
    items : Joi.array().items(
        Joi.object({
            productId : Joi.number().integer().required(),
            quantity : Joi.number().integer().min(1).required()
        })
    ).min(1).max(5).required()
})

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        )
        .required()
});
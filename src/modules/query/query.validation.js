import Joi from "joi";

export const naturalLanguageQuerySchema = Joi.object({
  query: Joi.string()
    .trim()
    .min(3)
    .max(500)
    .required(),
});
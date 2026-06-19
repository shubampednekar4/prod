import express from "express";
import validate from "../../middleware/validate.js";
import { createCustomerController } from "./customer.controller.js";
import { createCustomerSchema } from "./customer.validation.js";

const customerRouter = express.Router();

customerRouter.post('/', 
    validate(createCustomerSchema),
    createCustomerController
)

export default customerRouter;
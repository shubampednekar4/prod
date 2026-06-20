import express from "express";
import validate from "../../middleware/validate.js";
import { createCustomerController, deleteCustomerController, getCustomerByIdController, getCustomerController, updateCustomerController } from "./customer.controller.js";
import { createCustomerSchema, updateCustomerSchema } from "./customer.validation.js";

const customerRouter = express.Router();

customerRouter.post('/', 
    validate(createCustomerSchema),
    createCustomerController
)

customerRouter.get('/', getCustomerController);
customerRouter.get('/:id', getCustomerByIdController);
customerRouter.put('/:id', validate(updateCustomerSchema),updateCustomerController)
customerRouter.delete('/:id', deleteCustomerController);

export default customerRouter;